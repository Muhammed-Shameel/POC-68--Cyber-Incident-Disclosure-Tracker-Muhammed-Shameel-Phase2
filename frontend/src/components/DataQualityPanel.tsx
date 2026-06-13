'use client';

import React from 'react';
import { ChartCard } from './ChartCard';
import { Incident } from '@/types';
import { BadgeCheck, XCircle, HelpCircle } from 'lucide-react';

interface DataQualityPanelProps {
  incidents: Incident[];
}

const DataQualityPanel: React.FC<DataQualityPanelProps> = ({ incidents }) => {
  const safeIncidents = Array.isArray(incidents) ? incidents : [];
  
  if (safeIncidents.length === 0) {
    return (
      <ChartCard title="Data Quality Coverage">
        <div className="flex items-center justify-center h-full text-text-secondary">
          No incident data available for quality metrics.
        </div>
      </ChartCard>
    );
  }

  const totalIncidents = safeIncidents.length;

  const sectorAttributed = safeIncidents.filter(
    (incident) => incident.sector !== 'Unknown' && incident.sector !== null
  ).length;
  const sectorAttributionCoverage = (sectorAttributed / totalIncidents) * 100;

  const attackAttributed = safeIncidents.filter(
    (incident) => incident.attack_type !== 'Unknown' && incident.attack_type !== null
  ).length;
  const attackAttributionCoverage = (attackAttributed / totalIncidents) * 100;

  const unknownSector = safeIncidents.filter(
    (incident) => incident.sector === 'Unknown' || incident.sector === null
  ).length;
  const unknownAttack = safeIncidents.filter(
    (incident) => incident.attack_type === 'Unknown' || incident.attack_type === null
  ).length;
  const percentageUnknown = ((unknownSector + unknownAttack) / (totalIncidents * 2)) * 100; // *2 because each incident has 2 classification fields (sector, attack_type)

  const dataQualityMetrics = [
    {
      label: 'Sector Attribution Coverage',
      value: `${sectorAttributionCoverage.toFixed(1)}%`,
      icon: BadgeCheck,
      colorClass: 'text-green-500',
    },
    {
      label: 'Attack Attribution Coverage',
      value: `${attackAttributionCoverage.toFixed(1)}%`,
      icon: BadgeCheck,
      colorClass: 'text-green-500',
    },
    {
      label: 'Percentage of Unknown Classifications',
      value: `${percentageUnknown.toFixed(1)}%`,
      icon: XCircle,
      colorClass: 'text-red-500',
    },
  ];

  return (
    <ChartCard title="Data Quality Coverage">
      <div className="space-y-4">
        {dataQualityMetrics.map((metric, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-secondary-surface/30 rounded-lg border border-border/30">
            <div className="flex items-center gap-3">
              <metric.icon className={`w-5 h-5 ${metric.colorClass}`} />
              <span className="text-sm font-medium text-text-primary">{metric.label}</span>
            </div>
            <span className="text-base font-semibold text-text-primary">{metric.value}</span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
};

export default DataQualityPanel;