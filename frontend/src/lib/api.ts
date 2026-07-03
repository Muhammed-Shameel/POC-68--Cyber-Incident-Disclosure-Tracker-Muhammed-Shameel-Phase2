import axios from 'axios';
import { 
  Incident, 
  AnalyticsSummary, 
  SectorStats, 
  SeverityStats, 
  TimelineData,
  IntelligenceTrends,
  SectorIntelligence,
  AttackIntelligence,
  HighRiskIncident
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://poc-68-cyber-incident-disclosure-tracker.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Incidents
  getIncidents: async (params?: { 
    company?: string; 
    sector?: string; 
    severity?: string; 
    skip?: number; 
    limit?: number; 
  }) => {
    const response = await apiClient.get<Incident[]>('/incidents', { params });
    return response.data;
  },

  getIncidentById: async (id: string) => {
    const response = await apiClient.get<Incident>(`/incidents/${id}`);
    return response.data;
  },

  // Analytics
  getSummary: async (params?: { company?: string; sector?: string; severity?: string; attackType?: string }) => {
    const response = await apiClient.get<AnalyticsSummary>('/analytics/summary', { params });
    return response.data;
  },

  getSectorStats: async (params?: { company?: string; sector?: string; severity?: string; attackType?: string }) => {
    const response = await apiClient.get<SectorStats[]>('/analytics/sectors', { params });
    return response.data;
  },

  getSeverityStats: async (params?: { company?: string; sector?: string; severity?: string; attackType?: string }) => {
    const response = await apiClient.get<SeverityStats>('/analytics/severity', { params });
    return response.data;
  },

  getTimelineStats: async (params?: { company?: string; sector?: string; severity?: string; attackType?: string }) => {
    const response = await apiClient.get<TimelineData[]>('/analytics/timeline', { params });
    return response.data;
  },

  // Intelligence
  getIntelligenceTrends: async () => {
    const response = await apiClient.get<IntelligenceTrends>('/intelligence/trends');
    return response.data;
  },

  getIntelligenceSectors: async () => {
    const response = await apiClient.get<SectorIntelligence>('/intelligence/sectors');
    return response.data;
  },

  getIntelligenceAttacks: async () => {
    const response = await apiClient.get<AttackIntelligence>('/intelligence/attacks');
    return response.data;
  },

  getIntelligenceHighRisk: async () => {
    const response = await apiClient.get<HighRiskIncident[]>('/intelligence/high-risk');
    return response.data;
  },

  getIntelligenceInsights: async () => {
    const response = await apiClient.get<{ value: string[]; Count: number }>('/intelligence/insights');
    return response.data.value;
  },

  // Health
  getHealth: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },
};
