from fastapi import APIRouter, Depends, Query, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional
from services.report_service import ReportService
from datetime import datetime

router = APIRouter()
report_service = ReportService()

@router.get("/executive-summary", description="Get Executive Summary Report")
async def get_executive_summary():
    report_data = await report_service.get_executive_summary_report()
    if not report_data:
        raise HTTPException(status_code=404, detail="No data available for Executive Summary Report.")
    return JSONResponse(content=report_data)

@router.get("/data-quality", description="Get Data Quality Report")
async def get_data_quality():
    report_data = await report_service.get_data_quality_report()
    if not report_data:
        raise HTTPException(status_code=404, detail="No data available for Data Quality Report.")
    return JSONResponse(content=report_data)
