import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add backend to path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "dataset_loaded" in data
    assert "records" in data

def test_incidents_endpoint():
    response = client.get("/api/incidents")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_incidents_pagination():
    response = client.get("/api/incidents?skip=0&limit=5")
    assert response.status_code == 200
    assert len(response.json()) <= 5

def test_analytics_summary():
    response = client.get("/api/analytics/summary")
    assert response.status_code == 200
    data = response.json()
    assert "total_incidents" in data
    assert "total_companies" in data

def test_analytics_sectors():
    response = client.get("/api/analytics/sectors")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_analytics_severity():
    response = client.get("/api/analytics/severity")
    assert response.status_code == 200
    assert isinstance(response.json(), dict)
    assert "Low" in response.json()

def test_analytics_timeline():
    response = client.get("/api/analytics/timeline")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_invalid_incident_id():
    response = client.get("/api/incidents/non_existent_id")
    assert response.status_code == 404
