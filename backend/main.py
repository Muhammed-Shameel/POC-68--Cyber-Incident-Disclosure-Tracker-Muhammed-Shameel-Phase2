from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import incidents, analytics, health, intelligence, ai, export, reports
from services.incident_service import IncidentService
from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    IncidentService.load_data()
    yield


app = FastAPI(
    title="Cyber Incident Disclosure Tracker API",
    description="API for tracking and analyzing publicly disclosed cyber incidents from SEC filings.",
    version="1.0.0",
    lifespan=lifespan,
)

# Enable CORS for frontend integration in future phases
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health.router, prefix="/api", tags=["System"])
app.include_router(incidents.router, prefix="/api/incidents", tags=["Incidents"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(intelligence.router, prefix="/api/intelligence", tags=["Intelligence"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI"])
app.include_router(export.router, prefix="/api/export", tags=["Export"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])

@app.get("/")
async def root():
    return {
        "message": "Cyber Incident Disclosure Tracker API is running",
        "docs": "/docs",
        "health": "/api/health"
    }
