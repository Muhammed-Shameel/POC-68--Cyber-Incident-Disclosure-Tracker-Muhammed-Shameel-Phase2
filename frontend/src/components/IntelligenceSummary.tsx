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
    { label: 'Dataset Name', value: datasetName, icon: Globe },
    { label: 'Total Records', value: totalRecords.toLocaleString(), icon: Shield },
    { label: 'Total Companies', value: totalCompanies.toLocaleString(), icon: Building2 },
    { label: 'Affected Sectors', value: affectedSectors.toLocaleString(), icon: Globe },
    { label: 'Average Risk Score', value: averageRiskScore.toFixed(2), icon: TrendingUp },
    { label: 'Highest Risk Sector', value: highestRiskSector || 'N/A', icon: Sigma },
    { label: 'Most Common Attack Type', value: mostCommonAttackType || 'N/A', icon: Zap },
  ];

  return (
    <div className="p-6 bg-surface border border-border rounded-xl col-span-full">
      <h2 className="text-xl font-bold tracking-tight text-text-primary mb-6">Intelligence Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {summaryItems.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <item.icon className="h-5 w-5 text-primary-accent" />
            <div>
              <p className="text-sm text-text-secondary">{item.label}</p>
              <p className="text-lg font-semibold text-text-primary">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
