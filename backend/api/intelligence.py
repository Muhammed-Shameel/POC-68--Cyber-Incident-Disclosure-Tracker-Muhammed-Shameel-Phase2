from fastapi import APIRouter, Depends
from typing import List, Dict
from services.intelligence_service import IntelligenceService

router = APIRouter()
intelligence_service = IntelligenceService()

@router.get("/trends")
async def get_trends():
    return intelligence_service.get_trends()

@router.get("/sectors")
async def get_sectors():
    return intelligence_service.get_sectors()

@router.get("/attacks")
async def get_attacks():
    return intelligence_service.get_attacks()

@router.get("/high-risk")
async def get_high_risk():
    return intelligence_service.get_high_risk()

@router.get("/insights")
async def get_insights():
    return intelligence_service.get_insights()
