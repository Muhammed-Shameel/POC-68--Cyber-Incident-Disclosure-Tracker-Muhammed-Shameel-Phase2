from fastapi import APIRouter
from typing import List, Dict, Optional
from services.analytics_service import AnalyticsService
from models.schemas import AnalyticsSummary, SectorStats, SeverityStats, TimelineStats

router = APIRouter()
service = AnalyticsService()

@router.get("/summary", response_model=AnalyticsSummary, description="Get high-level summary of cyber incidents")
async def get_summary(company: Optional[str] = None, sector: Optional[str] = None, severity: Optional[str] = None, attack_type: Optional[str] = None):
    return service.get_summary(company, sector, severity, attack_type)

@router.get("/sectors", response_model=List[SectorStats], description="Get incident statistics by industry sector")
async def get_sectors(company: Optional[str] = None, sector: Optional[str] = None, severity: Optional[str] = None, attack_type: Optional[str] = None):
    return service.get_sector_stats(company, sector, severity, attack_type)

@router.get("/severity", response_model=SeverityStats, description="Get distribution of incidents by severity")
async def get_severity(company: Optional[str] = None, sector: Optional[str] = None, severity: Optional[str] = None, attack_type: Optional[str] = None):
    return {"distribution": service.get_severity_distribution(company, sector, severity, attack_type)}

@router.get("/timeline", response_model=List[TimelineStats], description="Get monthly timeline of reported incidents")
async def get_timeline(company: Optional[str] = None, sector: Optional[str] = None, severity: Optional[str] = None, attack_type: Optional[str] = None):
    return service.get_timeline(company, sector, severity, attack_type)
