'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { SummaryCard } from '@/components/SummaryCard';
import { ChartCard } from '@/components/ChartCard';
import { SeverityChart } from '@/components/SeverityChart';
import { TimelineChart } from '@/components/TimelineChart';
import { IncidentTable } from '@/components/IncidentTable';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { SectorPieChart } from '@/components/SectorPieChart';
import AttackDistributionPanel from '@/components/AttackDistributionPanel';
import { 
  ShieldAlert, 
  Building2, 
  Globe2, 
  TrendingUp,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentFilters, setCurrentFilters] = useState({ company: '', sector: '', severity: '', attackType: '' });

  async function loadDashboardData(filters: typeof currentFilters) {
    setLoading(true);
    try {
      const responses = await Promise.allSettled([
        api.getSummary(filters),
        api.getSeverityStats(filters),
        api.getTimelineStats(filters),
        api.getIntelligenceTrends(),
        api.getIntelligenceSectors(),
        api.getIntelligenceAttacks(),
        api.getIntelligenceInsights(),
        api.getHealth(),
        api.getIncidents({ ...filters, limit: 100 })
      ]);

      const results: any = {};
      const keys = ['summary', 'severity', 'timeline', 'trends', 'sectorIntel', 'attackIntel', 'insights', 'health', 'incidents'];
      
      responses.forEach((res, index) => {
        if (res.status === 'fulfilled') {
          results[keys[index]] = res.value;
        } else {
          console.error(`Failed to load ${keys[index]}:`, res.reason);
          results[keys[index]] = null;
        }
      });
      setData(results);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData(currentFilters);
  }, [currentFilters]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <ShieldAlert size={48} className="text-text-secondary mb-4" />
        <h2 className="text-xl font-semibold text-text-primary">Data Load Error</h2>
        <p className="text-text-secondary mt-2">
          Could not connect to the intelligence backend. Please ensure the API is running.
        </p>
      </div>
    );
  }

  const {
    summary,
    severity,
    timeline,
    sectorIntel,
    attackIntel,
    insights,
    incidents
  } = data;

  const highestRiskSector = sectorIntel?.highest_risk?.sector || 'N/A';
  const mostCommonAttackType = (attackIntel?.attacks && Array.isArray(attackIntel.attacks) && attackIntel.attacks[0]?.attack_type) || 'N/A';

  return (
    <div className="flex min-h-screen bg-background">
      {/* Main Intelligence Area */}
      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tighter">Cyber Incident Disclosure Tracker</h1>
          <p className="text-zinc-400 mt-2 text-lg">Governance, Trust, and Real-time SEC Disclosure Monitoring</p>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Total Incidents"
            value={summary?.total_incidents ?? 0}
            icon={ShieldAlert}
            description="Tracked SEC cyber disclosures"
          />
          <SummaryCard
            title="Total Companies"
            value={summary?.total_companies ?? 0}
            icon={Building2}
            description="Unique reporting entities"
          />
          <SummaryCard
            title="Affected Sectors"
            value={summary?.sectors_affected ?? 0}
            icon={Globe2}
            description="Industries with disclosed exposure"
          />
          <SummaryCard
            title="Avg Risk Score"
            value={summary?.average_risk_score?.toFixed(1) || "0.0"}
            icon={TrendingUp}
            description="Portfolio-wide severity signal"
          />
        </div>

        {/* Full-width Disclosure Timeline */}
        <ChartCard title="Disclosure Timeline">
          <TimelineChart data={timeline ?? []} />
        </ChartCard>

        {/* Full-width Attack Distribution */}
        <AttackDistributionPanel data={attackIntel ?? { attacks: [] }} />

        {/* Severity and Sector Exposure (Pie) Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard title="Severity Distribution">
            <SeverityChart data={severity ?? {}} />
          </ChartCard>
          <ChartCard title="Sector Exposure Percentage">
             <SectorPieChart data={sectorIntel?.all_sectors ?? []} />
          </ChartCard>
        </div>

        {/* Incident Table */}
        <IncidentTable data={incidents ?? []} />
      </main>

      {/* Dashboard Sidebar */}
      <div className="w-[30%]">
        <DashboardSidebar
          highestRiskSector={highestRiskSector}
          mostCommonAttackType={mostCommonAttackType}
          insights={insights ?? []}
          currentFilters={currentFilters}
          onFilterChange={setCurrentFilters}
          summary={summary}
          incidents={incidents}
        />
      </div>
    </div>
  );

}
