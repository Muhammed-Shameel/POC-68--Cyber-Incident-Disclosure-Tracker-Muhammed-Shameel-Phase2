from fastapi import APIRouter
from services.incident_service import IncidentService, DATA_PATH_CSV
from models.schemas import HealthResponse
import os
from datetime import datetime

router = APIRouter()
service = IncidentService()

@router.get("/health", response_model=HealthResponse, description="Check API health and dataset status")
async def get_health():
    df = service.load_data()
    dataset_loaded_status = not df.empty
    num_records = len(df)
    
    # Calculate real confidence
    confidence = "Medium"
    if dataset_loaded_status:
        avg_confidence = df['confidence_score'].mean()
        if avg_confidence > 80:
            confidence = "High"
        elif avg_confidence < 40:
            confidence = "Low"
            
    # Determine processing status
    status = "Healthy"
    if not dataset_loaded_status:
        status = "Warning"
    elif num_records < 10:
        status = "Processing"

    # Determine data freshness
    freshness = "Unknown"
    if os.path.exists(DATA_PATH_CSV):
        mtime = os.path.getmtime(DATA_PATH_CSV)
        dt = datetime.fromtimestamp(mtime)
        delta = datetime.now() - dt
        if delta.days > 0:
            freshness = f"Last Updated {delta.days} days ago"
        elif delta.seconds // 3600 > 0:
            freshness = f"Last Updated {delta.seconds // 3600} hours ago"
        else:
            freshness = f"Last Updated {delta.seconds // 60} minutes ago"

    return HealthResponse(
        status="healthy",
        dataset_loaded=dataset_loaded_status,
        records=num_records,
        
        # Repomix -> AI Handshake
        repomix_ai_data_source="SEC 8-K Feed",
        repomix_ai_backend_processing="Incident Enrichment",
        repomix_ai_analytics_engine="Risk Analysis",
        repomix_ai_frontend_visualization="Dashboard Ready",
        repomix_ai_status=status,

        # Backend -> Frontend Handshake
        bf_dataset_loaded=dataset_loaded_status,
        bf_api_connected=True,
        bf_analytics_generated=dataset_loaded_status,
        bf_insights_generated=dataset_loaded_status,
        bf_visualization_ready=dataset_loaded_status,

        # Visualization Output Panel
        vop_current_dataset="SEC Cyber Incident Disclosures",
        vop_records=num_records,
        vop_coverage=f"{df['company'].nunique()} Companies" if dataset_loaded_status else "0 Companies",
        vop_confidence=confidence,
        vop_data_freshness=freshness
    )
