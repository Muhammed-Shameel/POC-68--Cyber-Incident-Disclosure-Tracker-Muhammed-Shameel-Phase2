import pandas as pd
import numpy as np
import os
from typing import List, Optional, Dict
from models.schemas import Incident
import io

DATA_PATH_CSV = os.path.join(os.path.dirname(__file__), "..", "data", "processed", "incidents_clean.csv")
DATA_PATH_PARQUET = os.path.join(os.path.dirname(__file__), "..", "data", "processed", "incidents_clean.parquet")

class IncidentService:
    _df: Optional[pd.DataFrame] = None

    @classmethod
    def load_data(cls):
        if cls._df is None:
            # Prioritize CSV as it is human-readable/editable as requested
            if os.path.exists(DATA_PATH_CSV):
                cls._df = pd.read_csv(DATA_PATH_CSV)
                print(f"Loaded data from {DATA_PATH_CSV}")
            elif os.path.exists(DATA_PATH_PARQUET):
                cls._df = pd.read_parquet(DATA_PATH_PARQUET)
                print(f"Loaded data from {DATA_PATH_PARQUET}")
            else:
                print("Warning: No incident data file found. Using empty dataset.")
                cls._df = pd.DataFrame()

            if not cls._df.empty:
                # Sanitize NaN values for Pydantic compatibility (FastAPI)
                # Pydantic expects strings or None, not float('nan')
                # We use replace with numpy.nan to be explicit
                cls._df = cls._df.replace({np.nan: None})

                # Convert filing_date to datetime for sorting/filtering
                cls._df['filing_date_dt'] = pd.to_datetime(cls._df['filing_date'])
                # Ensure it's timezone-naive for easier comparison
                if cls._df['filing_date_dt'].dt.tz is not None:
                    cls._df['filing_date_dt'] = cls._df['filing_date_dt'].dt.tz_localize(None)
        return cls._df

    def _get_filtered_incidents_df(
        self,
        company: Optional[str] = None,
        sector: Optional[str] = None,
        severity: Optional[str] = None,
        attack_type: Optional[str] = None
    ) -> pd.DataFrame:
        df = self.load_data()
        if df.empty:
            return pd.DataFrame()

        filtered_df = df.copy()
        if company:
            filtered_df = filtered_df[filtered_df['company'].str.contains(company, case=False, na=False)]
        if sector:
            filtered_df = filtered_df[filtered_df['sector'] == sector]
        if severity:
            filtered_df = filtered_df[filtered_df['severity'] == severity]
        if attack_type:
            filtered_df = filtered_df[filtered_df['attack_type'] == attack_type]
        
        # Always sort by filing date descending
        filtered_df = filtered_df.sort_values(by='filing_date_dt', ascending=False)

        # Remove the helper datetime column before returning (for export purposes mainly)
        return filtered_df.drop(columns=['filing_date_dt'], errors='ignore')

    def get_filtered_df(
        self,
        company: Optional[str] = None,
        sector: Optional[str] = None,
        severity: Optional[str] = None,
        attack_type: Optional[str] = None
    ) -> pd.DataFrame:
        return self._get_filtered_incidents_df(company, sector, severity, attack_type)


    def get_incidents(
        self, 
        skip: int = 0, 
        limit: int = 20, 
        company: Optional[str] = None,
        sector: Optional[str] = None,
        severity: Optional[str] = None,
        attack_type: Optional[str] = None
    ) -> List[Dict]:
        filtered_df = self._get_filtered_incidents_df(company, sector, severity, attack_type)
        if filtered_df.empty:
            return []
        
        paginated_df = filtered_df.iloc[skip : skip + limit]
        
        result = paginated_df.to_dict(orient='records')
        return result

    def get_incident_by_id(self, incident_id: str) -> Optional[Dict]:
        df = self.load_data() # Use load_data here as we're not filtering by general params
        if df.empty:
            return None
        
        record = df[df['incident_id'] == incident_id]
        if record.empty:
            return None
            
        return record.drop(columns=['filing_date_dt'], errors='ignore').iloc[0].to_dict()

    def get_total_count(self) -> int:
        df = self.load_data()
        return len(df)
    
    def export_incidents_to_csv(
        self,
        company: Optional[str] = None,
        sector: Optional[str] = None,
        severity: Optional[str] = None,
        attack_type: Optional[str] = None
    ) -> str:
        filtered_df = self._get_filtered_incidents_df(company, sector, severity, attack_type)
        if filtered_df.empty:
            return "" # Return empty string for empty CSV
        
        output = io.StringIO()
        filtered_df.to_csv(output, index=False)
        return output.getvalue()

    def export_incidents_to_json(
        self,
        company: Optional[str] = None,
        sector: Optional[str] = None,
        severity: Optional[str] = None,
        attack_type: Optional[str] = None
    ) -> str:
        filtered_df = self._get_filtered_incidents_df(company, sector, severity, attack_type)
        if filtered_df.empty:
            return "[]" # Return empty JSON array for empty data
        
        return filtered_df.to_json(orient='records', indent=2)
