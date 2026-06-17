import React from 'react';
import { Shield, Building2, Globe, TrendingUp, Zap, Sigma } from 'lucide-react'; // Icons for various metrics

interface IntelligenceSummaryProps {
  datasetName: string;
  totalRecords: number;
  totalCompanies: number;
  affectedSectors: number;
  averageRiskScore: number;
  highestRiskSector: string;
  mostCommonAttackType: string;
}

export function IntelligenceSummary({
  datasetName,
  totalRecords,
  totalCompanies,
  affectedSectors,
  averageRiskScore,
  highestRiskSector,
  mostCommonAttackType,
}: IntelligenceSummaryProps) {
  const summaryItems = [
    { label: 'Dataset', value: datasetName, icon: Globe },
    { label: 'Total Records', value: totalRecords.toLocaleString(), icon: Shield },
    { label: 'Total Entities', value: totalCompanies.toLocaleString(), icon: Building2 },
    { label: 'Affected Sectors', value: affectedSectors.toLocaleString(), icon: Globe },
    { label: 'Avg Risk Score', value: averageRiskScore.toFixed(2), icon: TrendingUp },
    { label: 'High Risk Sector', value: highestRiskSector || 'N/A', icon: Sigma },
    { label: 'Primary Attack', value: mostCommonAttackType || 'N/A', icon: Zap },
  ];

  return (
    <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-xl">
      <div className="flex items-center gap-2 mb-6">
        <Sigma className="w-4 h-4 text-primary-accent" />
        <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400">Intelligence Briefing</h2>
      </div>
      <div className="space-y-4">
        {summaryItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between border-b border-zinc-800/50 pb-3 last:border-0 last:pb-0">
            <div className="flex items-center gap-3">
              <item.icon className="h-3.5 w-3.5 text-zinc-500" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">{item.label}</span>
            </div>
            <span className="text-sm font-semibold text-zinc-200">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
