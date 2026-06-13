export interface Incident {
  incident_id: string;
  company: string;
  sector: string;
  filing_date: string;
  incident_date: string | null;
  attack_type: string;
  severity: string;
  risk_score: number;
  description: string;
  filing_url: string;
  source: string;
}

export interface AnalyticsSummary {
  total_incidents: number;
  total_companies: number;
  sectors_affected: number;
  average_risk_score: number;
}

export interface SectorStats {
  sector: string;
  count: number;
  average_risk: number;
}

export interface SeverityStats {
  distribution: Record<string, number>;
}

export interface TimelineData {
  date: string;
  count: number;
}

export interface HealthResponse {
  status: string;
  dataset_loaded: boolean;
  records: number;
  
  // Repomix -> AI Handshake
  repomix_ai_data_source: string;
  repomix_ai_backend_processing: string;
  repomix_ai_analytics_engine: string;
  repomix_ai_frontend_visualization: string;
  repomix_ai_status: string; // 'Healthy' | 'Processing' | 'Warning' | 'Fallback'

  // Backend -> Frontend Handshake
  bf_dataset_loaded: boolean;
  bf_api_connected: boolean;
  bf_analytics_generated: boolean;
  bf_insights_generated: boolean;
  bf_visualization_ready: boolean;

  // Visualization Output Panel
  vop_current_dataset: string;
  vop_records: number;
  vop_coverage: string;
  vop_confidence: string; // 'High' | 'Medium' | 'Low'
  vop_data_freshness: string;
}

export interface TrendMetric {
  current: number;
  previous: number;
  growth: number | null;
}

export interface IntelligenceTrends {
  monthly: TrendMetric;
  quarterly: TrendMetric;
  yearly: TrendMetric;
}

export interface SectorIntelligence {
  most_targeted: { sector: string; incident_count: number } | null;
  fastest_growing: { sector: string; growth: number | null; recent_count: number; previous_count: number } | null;
  highest_risk: { sector: string; avg_risk_score: number } | null;
  all_sectors: { sector: string; incident_count: number; avg_risk_score: number }[];
}

export interface AttackIntelligence {
  attacks: {
    attack_type: string;
    count: number;
    percentage: number;
    growth: number | null;
  }[];
}

export interface HighRiskIncident {
  incident_id: string;
  company: string;
  sector: string;
  severity: string;
  risk_score: number;
}
