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
  Info,
  X,
  Menu,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentFilters, setCurrentFilters] = useState({ company: '', sector: '', severity: '', attackType: '' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCreatorInfo, setShowCreatorInfo] = useState(false);

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
    <div className="relative h-screen flex flex-col overflow-hidden bg-background">
      {/* Cinematic Header */}
      <header className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-8 h-20 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <div className="pointer-events-auto flex flex-col justify-center h-full"> {/* Added flex flex-col justify-center h-full */}
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic leading-none">Cyber Incident Disclosure Tracker</h1> {/* Added leading-none */}
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">Real-time Intelligence Platform</p>
        </div>
        
        <div className="flex items-center gap-4 pointer-events-auto">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-accent/10 border border-primary-accent/20 rounded-full text-xs font-bold text-primary-accent hover:bg-primary-accent/20 transition-all uppercase tracking-widest"
          >
            <Menu size={14} />
            Intelligence
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowCreatorInfo(!showCreatorInfo)}
              className="p-2 text-zinc-500 hover:text-white transition-colors"
            >
              <Info size={20} />
            </button>
            
            {showCreatorInfo && (
              <div className="absolute top-12 right-0 z-50 w-72 bg-surface border border-border rounded-xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-border"> {/* Adjusted mb-6 to mb-4 */}
                  <h3 className="text-xs font-black text-white uppercase tracking-widest">Inforcreon Internship: Architect Metadata</h3>
                  <button onClick={() => setShowCreatorInfo(false)} className="text-zinc-500 hover:text-white">
                    <X size={14} />
                  </button>
                </div>
                <div className="space-y-3"> {/* Adjusted space-y-4 to space-y-3 */}
                  <div>
                    <div className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mb-1">Architect</div>
                    <div className="text-sm text-white font-medium">Muhammed Shameel</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mb-1">Batch</div>
                    <div className="text-sm text-white font-medium">Batch 3</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mb-1">Stack</div>
                    <div className="text-[11px] text-zinc-300 font-medium">Next.js, FastAPI, Tailwind CSS, ECharts</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Full-Screen Content */}
      <main className="flex-1 w-full h-full overflow-y-auto pt-20 pb-12 px-8 space-y-12">
        {/* KPI Row - Immersive Style */}
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

        {/* Cinematic Data Visualization */}
        <div className="grid grid-cols-1 gap-12">
          <ChartCard title="Disclosure Timeline Intelligence">
            <TimelineChart data={timeline ?? []} />
          </ChartCard>

          <AttackDistributionPanel data={attackIntel ?? { attacks: [] }} />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <ChartCard title="Severity Spectrum Analysis">
              <SeverityChart data={severity ?? {}} />
            </ChartCard>
            <ChartCard title="Sector Exposure Distribution">
               <SectorPieChart data={sectorIntel?.all_sectors ?? []} />
            </ChartCard>
          </div>
        </div>

        {/* Global Incident Log */}
        <section className="pt-8 border-t border-border">
          <div className="mb-6">
            <h2 className="text-xl font-black text-white uppercase tracking-tight leading-none">Global Incident Disclosure Database</h2>
            <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-bold">Comprehensive disclosure tracking and metadata analysis</p>
          </div>
          <IncidentTable data={incidents ?? []} />
        </section>
      </main>

      {/* Dynamic Slide-over Intelligence Panel */}
      <div className={`fixed inset-y-0 right-0 z-50 w-full md:w-[450px] transform transition-transform duration-500 ease-in-out shadow-2xl ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full bg-zinc-950/95 backdrop-blur-xl border-l border-zinc-800 flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-black/20">
            <h2 className="text-lg font-black text-white uppercase tracking-tighter italic">Intelligence Brief</h2>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 text-zinc-500 hover:text-white transition-colors bg-zinc-900 rounded-full"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
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
      </div>

      {/* Panel Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );

}
