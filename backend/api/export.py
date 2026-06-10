from fastapi import APIRouter, Depends, Query, HTTPException
from fastapi.responses import StreamingResponse
from typing import Optional
from services.incident_service import IncidentService
from datetime import datetime
import io

router = APIRouter()
incident_service = IncidentService()

@router.get("/csv", description="Export filtered incidents as CSV")
async def export_csv(
    company: Optional[str] = Query(None, description="Filter by company name (case-insensitive search)"),
    sector: Optional[str] = Query(None, description="Filter by sector"),
    severity: Optional[str] = Query(None, description="Filter by severity level"),
    attack_type: Optional[str] = Query(None, description="Filter by attack type")
):
    csv_content = incident_service.export_incidents_to_csv(company, sector, severity, attack_type)
    
    if not csv_content:
        raise HTTPException(status_code=404, detail="No data found for the specified filters to export.")

    filename = f"cyber_incidents_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    
    return StreamingResponse(
        io.StringIO(csv_content),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/json", description="Export filtered incidents as JSON")
async def export_json(
    company: Optional[str] = Query(None, description="Filter by company name (case-insensitive search)"),
    sector: Optional[str] = Query(None, description="Filter by sector"),
    severity: Optional[str] = Query(None, description="Filter by severity level"),
    attack_type: Optional[str] = Query(None, description="Filter by attack type")
):
    json_content = incident_service.export_incidents_to_json(company, sector, severity, attack_type)

    if json_content == "[]": # Check for empty JSON array
        raise HTTPException(status_code=404, detail="No data found for the specified filters to export.")

    filename = f"cyber_incidents_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"

    return StreamingResponse(
        io.StringIO(json_content),
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
