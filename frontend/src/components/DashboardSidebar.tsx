"use client";

import React from 'react';
import { Filter, X } from 'lucide-react';
import {
  AnalyticsSummary,
  Incident as IncidentType,
} from '@/types';
import { IntelligenceSummary } from './IntelligenceSummary';
import DataQualityPanel from './DataQualityPanel';
import { WhoControlsTheRail } from './WhoControlsTheRail';
import { ResponseChecklist } from './ResponseChecklist';

interface DashboardSidebarProps {
  highestRiskSector: string;
  mostCommonAttackType: string;
  insights: string[];
  currentFilters: {
    company: string;
    sector: string;
    severity: string;
    attackType: string;
  };
  onFilterChange: (filters: any) => void;
  summary: AnalyticsSummary;
  incidents: IncidentType[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';

export function DashboardSidebar({
  highestRiskSector,
  mostCommonAttackType,
  insights,
  currentFilters,
  onFilterChange,
  summary,
  incidents,
}: DashboardSidebarProps) {

  const sectors = ['Financial Services', 'Technology', 'Healthcare', 'Energy', 'Retail', 'Manufacturing', 'Telecommunications', 'Unknown'];
  const attacks = ['Ransomware', 'Phishing', 'Malware', 'DDoS', 'Data Breach', 'Supply Chain', 'Insider Threat', 'Unknown'];
  const severities = ['Low', 'Medium', 'High', 'Critical'];

  const handleClearFilters = () => {
    onFilterChange({ company: '', sector: '', severity: '', attackType: '' });
  };

  const handleExport = async (format: 'csv' | 'json') => {
    let queryParams = new URLSearchParams();
    if (currentFilters.company) queryParams.append('company', currentFilters.company);
    if (currentFilters.sector) queryParams.append('sector', currentFilters.sector);
    if (currentFilters.severity) queryParams.append('severity', currentFilters.severity);
    if (currentFilters.attackType) queryParams.append('attack_type', currentFilters.attackType);

    const url = `${API_BASE_URL}/export/${format}?${queryParams.toString()}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Export failed');
      const blob = await response.blob();
      const filename = response.headers.get('Content-Disposition')?.split('filename=')[1] || `incidents.${format}`;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename.replace(/"/g, '');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed.');
    }
  };

  return (
    <aside className="w-full bg-zinc-950 border-l border-zinc-800 p-6 space-y-6">
      <div className="text-xl font-bold text-white mb-6 tracking-tighter uppercase italic">Strategic Intelligence</div>

      {/* Filters */}
      <section className="border border-zinc-800 p-5 rounded-lg space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">
          <div className="flex items-center gap-2">
            <Filter size={14} />
            Filters
          </div>
          <button onClick={handleClearFilters} className="text-primary-accent hover:text-white">Clear</button>
        </div>
        <input type="text" placeholder="Company..." className="w-full bg-zinc-900 text-sm text-white p-2 rounded border border-zinc-700" 
          value={currentFilters.company} onChange={e => onFilterChange({...currentFilters, company: e.target.value})} />
        <select className="w-full bg-zinc-900 text-sm text-white p-2 rounded border border-zinc-700"
          value={currentFilters.sector} onChange={e => onFilterChange({...currentFilters, sector: e.target.value})}>
          <option value="">All Sectors</option>
          {sectors.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="w-full bg-zinc-900 text-sm text-white p-2 rounded border border-zinc-700"
          value={currentFilters.severity} onChange={e => onFilterChange({...currentFilters, severity: e.target.value})}>
          <option value="">All Severities</option>
          {severities.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="w-full bg-zinc-900 text-sm text-white p-2 rounded border border-zinc-700"
          value={currentFilters.attackType} onChange={e => onFilterChange({...currentFilters, attackType: e.target.value})}>
          <option value="">All Attacks</option>
          {attacks.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </section>

      {/* Intelligence Summary and Data Quality */}
      <IntelligenceSummary 
          datasetName="SEC Cyber Incident Disclosures"
          totalRecords={summary?.total_incidents ?? 0}
          totalCompanies={summary?.total_companies ?? 0}
          affectedSectors={summary?.sectors_affected ?? 0}
          averageRiskScore={summary?.average_risk_score ?? 0}
          highestRiskSector={highestRiskSector}
          mostCommonAttackType={mostCommonAttackType}
        />
        
      <DataQualityPanel incidents={incidents ?? []} />
      <WhoControlsTheRail />
      <ResponseChecklist />
      
      {/* Quick Export Actions */}
      <section className="border border-zinc-800 p-5 rounded-lg">
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">Export</div>
        <div className="grid grid-cols-1 gap-2">
          <button onClick={() => handleExport('csv')} className="text-sm text-zinc-300 hover:text-white bg-zinc-800 p-2 rounded border border-zinc-700">Export CSV</button>
          <button onClick={() => handleExport('json')} className="text-sm text-zinc-300 hover:text-white bg-zinc-800 p-2 rounded border border-zinc-700">Export JSON</button>
        </div>
      </section>
    </aside>
  );
}
