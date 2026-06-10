from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

class Incident(BaseModel):
    incident_id: str
    company: str
    sector: str
    filing_date: str
    incident_date: Optional[str] = None
    attack_type: str
    severity: str
    risk_score: float
    description: str
    filing_url: str
    source: str

class AnalyticsSummary(BaseModel):
    total_incidents: int
    total_companies: int
    sectors_affected: int
    average_risk_score: float

class SectorStats(BaseModel):
    sector: str
    count: int
    average_risk: float

class SeverityStats(BaseModel):
    distribution: Dict[str, int]

class TimelineStats(BaseModel):
    date: str
    count: int

class HealthResponse(BaseModel):
    status: str
    dataset_loaded: bool
    records: int
    
    # Repomix -> AI Handshake
    repomix_ai_data_source: str
    repomix_ai_backend_processing: str
    repomix_ai_analytics_engine: str
    repomix_ai_frontend_visualization: str
    repomix_ai_status: str # Healthy | Processing | Warning | Fallback

    # Backend -> Frontend Handshake
    bf_dataset_loaded: bool
    bf_api_connected: bool
    bf_analytics_generated: bool
    bf_insights_generated: bool
    bf_visualization_ready: bool

    # Visualization Output Panel
    vop_current_dataset: str
    vop_records: int
    vop_coverage: str
    vop_confidence: str # High | Medium | Low
    vop_data_freshness: str
