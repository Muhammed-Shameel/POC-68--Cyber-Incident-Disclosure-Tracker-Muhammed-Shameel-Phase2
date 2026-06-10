from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from services.incident_service import IncidentService
from models.schemas import Incident

router = APIRouter()
service = IncidentService()

@router.get("", response_model=List[Incident], description="Get list of cyber incidents with filtering and pagination")
async def get_incidents(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    company: Optional[str] = None,
    sector: Optional[str] = None,
    severity: Optional[str] = None,
    attack_type: Optional[str] = None
):
    return service.get_incidents(skip, limit, company, sector, severity, attack_type)

@router.get("/{incident_id}", response_model=Incident, description="Get detailed information about a specific incident")
async def get_incident(incident_id: str):
    incident = service.get_incident_by_id(incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident
