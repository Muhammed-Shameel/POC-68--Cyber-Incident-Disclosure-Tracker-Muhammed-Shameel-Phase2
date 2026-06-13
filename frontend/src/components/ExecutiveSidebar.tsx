"use client";

import React from 'react';
import { Download, Filter, Landmark, TrendingUp, ShieldAlert, Building2 } from 'lucide-react';
import {
  AnalyticsSummary,
  IntelligenceTrends,
  SectorIntelligence as SectorIntelligenceType,
  AttackIntelligence as AttackIntelligenceType,
  Incident as IncidentType,
} from '@/types';
import AttackDistributionPanel from './AttackDistributionPanel';
import DisclosureTrendPanel from './DisclosureTrendPanel';
import DataQualityPanel from './DataQualityPanel';

interface ExecutiveSidebarProps {
  insights: string[];
  highestRiskSector: string;
  mostCommonAttackType: string;
  trends: IntelligenceTrends;
  sectorIntel: SectorIntelligenceType;
  attackIntel: AttackIntelligenceType;
  incidents: IncidentType[];
  currentFilters: {
    company: string;
    sector: string;
    severity: string;
    attackType: string;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

function formatGrowth(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return 'New'; // Or 'N/A', depending on desired display for new growth
  }
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(1)}%`;
}

export function ExecutiveSidebar({
  insights,
  highestRiskSector,
  mostCommonAttackType,
  trends,
  sectorIntel,
  attackIntel,
  incidents,
  currentFilters = { company: '', sector: '', severity: '', attackType: '' },
}: ExecutiveSidebarProps) {
  const primaryInsight = (Array.isArray(insights) && insights[0]) || 'Disclosure activity is being monitored for material changes.';

  const handleReportExport = (type: string) => {
    alert(`Report export for ${type} is not yet implemented.`);
  };

  const handleExport = async (format: 'csv' | 'json') => {
    let queryParams = new URLSearchParams();
    if (currentFilters.company) {
      queryParams.append('company', currentFilters.company);
    }
    if (currentFilters.sector) {
      queryParams.append('sector', currentFilters.sector);
    }
    if (currentFilters.severity) {
      queryParams.append('severity', currentFilters.severity);
    }
    if (currentFilters.attackType) {
      queryParams.append('attack_type', currentFilters.attackType);
    }

    const url = `${API_BASE_URL}/export/${format}?${queryParams.toString()}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error exporting data: ${errorData.detail || response.statusText}`);
        return;
      }
      const blob = await response.blob();
      const filename = response.headers.get('Content-Disposition')?.split('filename=')[1] || `incidents.${format}`;
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename.replace(/"/g, ''); // Remove quotes if present
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed due to a network error or server issue.');
    }
  };

  return (
    <aside className="space-y-4">
      {/* Executive Summary (Sidebar) */}
      <section className="border border-border bg-surface p-5">
        <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">Executive Summary</div>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-text-secondary">Highest Risk Sector</dt>
            <dd className="text-right text-text-primary">{highestRiskSector}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-text-secondary">Most Common Attack</dt>
            <dd className="text-right text-text-primary">{mostCommonAttackType}</dd>
          </div>
        </dl>
      </section>

      <section className="border border-border bg-surface p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
          <TrendingUp size={14} className="text-primary-accent" />
          Why This Matters
        </div>
        <p className="mt-3 text-sm leading-6 text-text-primary">{primaryInsight}</p>
        <p className="mt-3 text-sm leading-6 text-text-secondary">
          Watch whether concentrated sector exposure becomes a cross-sector reporting pattern; that shift usually changes board-level risk posture.
        </p>
      </section>

      <section className="border border-border bg-surface p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
          <Landmark size={14} className="text-secondary-accent" />
          Threat Landscape
        </div>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-text-secondary">Primary source</dt>
            <dd className="text-right text-text-primary">SEC 8-K disclosures</dd>
          </div>
        </dl>
      </section>
      
      {/* Relocated Analytics Panels */}
      <AttackDistributionPanel data={attackIntel} />
      <DisclosureTrendPanel trends={trends} />
      <DataQualityPanel incidents={incidents} />

      {/* Quick Export Actions */}
      <section className="border border-border bg-surface p-5">
        <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">Quick Export Actions</div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button 
            onClick={() => handleExport('csv')}
            className="flex h-10 items-center justify-center gap-2 border border-border bg-secondary-surface text-sm font-medium text-text-primary transition-colors hover:border-primary-accent focus:border-primary-accent focus:outline-none"
          >
            <Download size={16} />
            CSV (Filtered)
          </button>
          <button 
            onClick={() => handleExport('json')}
            className="flex h-10 items-center justify-center gap-2 border border-border bg-secondary-surface text-sm font-medium text-text-primary transition-colors hover:border-primary-accent focus:border-primary-accent focus:outline-none"
          >
            <Download size={16} />
            JSON (Filtered)
          </button>
          <button 
            onClick={() => handleReportExport('executive-summary')}
            className="col-span-2 flex h-10 items-center justify-center gap-2 border border-border bg-secondary-surface text-sm font-medium text-text-primary transition-colors hover:border-primary-accent focus:border-primary-accent focus:outline-none"
          >
            <Download size={16} />
            Executive Summary Report
          </button>
          <button 
            onClick={() => handleReportExport('data-quality')}
            className="col-span-2 flex h-10 items-center justify-center gap-2 border border-border bg-secondary-surface text-sm font-medium text-text-primary transition-colors hover:border-primary-accent focus:border-primary-accent focus:outline-none"
          >
            <Download size={16} />
            Data Quality Report
          </button>
        </div>
      </section>
    </aside>
  );
}
