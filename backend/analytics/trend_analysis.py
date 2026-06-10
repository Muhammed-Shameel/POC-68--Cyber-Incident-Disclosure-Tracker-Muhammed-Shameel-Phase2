import pandas as pd
from typing import Dict
from datetime import datetime, timedelta

def calculate_trends(df: pd.DataFrame) -> Dict:
    if df.empty:
        return {
            "monthly": {"current": 0, "previous": 0, "growth": 0},
            "quarterly": {"current": 0, "previous": 0, "growth": 0},
            "yearly": {"current": 0, "previous": 0, "growth": 0}
        }

    now = datetime.now()
    
    # Monthly
    current_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    last_month_end = current_month_start - timedelta(seconds=1)
    last_month_start = (last_month_end - timedelta(days=27)).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    curr_month_count = len(df[df['filing_date_dt'] >= current_month_start])
    prev_month_count = len(df[(df['filing_date_dt'] >= last_month_start) & (df['filing_date_dt'] <= last_month_end)])
    
    # Quarterly
    current_quarter_start = now.replace(month=((now.month - 1) // 3) * 3 + 1, day=1, hour=0, minute=0, second=0, microsecond=0)
    last_quarter_end = current_quarter_start - timedelta(seconds=1)
    last_quarter_start = (last_quarter_end - timedelta(days=80)).replace(month=((last_quarter_end.month - 1) // 3) * 3 + 1, day=1, hour=0, minute=0, second=0, microsecond=0)
    
    curr_quarter_count = len(df[df['filing_date_dt'] >= current_quarter_start])
    prev_quarter_count = len(df[(df['filing_date_dt'] >= last_quarter_start) & (df['filing_date_dt'] <= last_quarter_end)])
    
    # Yearly
    current_year_start = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
    last_year_end = current_year_start - timedelta(seconds=1)
    last_year_start = last_year_end.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
    
    curr_year_count = len(df[df['filing_date_dt'] >= current_year_start])
    prev_year_count = len(df[(df['filing_date_dt'] >= last_year_start) & (df['filing_date_dt'] <= last_year_end)])
    
    def calc_growth(curr, prev):
        if prev == 0:
            return None if curr > 0 else 0.0
        return round(((curr - prev) / prev) * 100, 2)

    return {
        "monthly": {
            "current": curr_month_count,
            "previous": prev_month_count,
            "growth": calc_growth(curr_month_count, prev_month_count)
        },
        "quarterly": {
            "current": curr_quarter_count,
            "previous": prev_quarter_count,
            "growth": calc_growth(curr_quarter_count, prev_quarter_count)
        },
        "yearly": {
            "current": curr_year_count,
            "previous": prev_year_count,
            "growth": calc_growth(curr_year_count, prev_year_count)
        }
    }
