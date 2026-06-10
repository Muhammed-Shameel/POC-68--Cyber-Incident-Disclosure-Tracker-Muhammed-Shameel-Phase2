from fastapi import APIRouter, Query
from services.ai_service import AIService

router = APIRouter()
ai_service = AIService()

@router.get("/executive-summary")
async def get_executive_summary(refresh: bool = Query(False)):
    summary = await ai_service.get_executive_summary(force_refresh=refresh)
    return {"summary": summary}

@router.get("/sector-brief")
async def get_sector_brief(refresh: bool = Query(False)):
    brief = await ai_service.get_sector_brief(force_refresh=refresh)
    return {"brief": brief}

@router.get("/trend-brief")
async def get_trend_brief(refresh: bool = Query(False)):
    brief = await ai_service.get_trend_brief(force_refresh=refresh)
    return {"brief": brief}

@router.get("/risk-brief")
async def get_risk_brief(refresh: bool = Query(False)):
    brief = await ai_service.get_risk_brief(force_refresh=refresh)
    return {"brief": brief}
