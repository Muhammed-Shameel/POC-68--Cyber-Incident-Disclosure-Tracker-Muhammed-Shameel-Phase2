'use client';

import React from 'react';
import { Target, Zap, ShieldAlert, BarChart3 } from 'lucide-react';
import { SectorIntelligence as SectorIntelType } from '../types';

interface SectorIntelligenceProps {
  data: SectorIntelType;
}

const SectorIntelligence: React.FC<SectorIntelligenceProps> = ({ data }) => {
  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-primary-accent/10 rounded-lg">
          <BarChart3 className="w-5 h-5 text-primary-accent" />
        </div>
        <h2 className="text-xl font-bold text-text-primary">Sector Intelligence</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Most Targeted */}
        <div className="flex flex-col p-4 bg-secondary-surface/50 rounded-lg border border-border/50">
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-3">
            <Target className="w-4 h-4 text-secondary-accent" />
            Most Targeted
          </div>
          <p className="text-lg font-bold text-text-primary truncate">
            {data.most_targeted?.sector || 'N/A'}
          </p>
          <p className="text-text-secondary text-sm mt-1">
            {data.most_targeted?.incident_count || 0} Incidents
          </p>
        </div>

        {/* Fastest Growing */}
        <div className="flex flex-col p-4 bg-secondary-surface/50 rounded-lg border border-border/50">
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-3">
            <Zap className="w-4 h-4 text-primary-accent" />
            Fastest Growing
          </div>
          <p className="text-lg font-bold text-text-primary truncate">
            {data.fastest_growing?.sector || 'N/A'}
          </p>
          <p className="text-primary-accent text-sm mt-1 font-medium">
            +{data.fastest_growing?.growth || 0}% Growth
          </p>
        </div>

        {/* Highest Risk */}
        <div className="flex flex-col p-4 bg-secondary-surface/50 rounded-lg border border-border/50">
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-3">
            <ShieldAlert className="w-4 h-4 text-secondary-accent" />
            Highest Avg Risk
          </div>
          <p className="text-lg font-bold text-text-primary truncate">
            {data.highest_risk?.sector || 'N/A'}
          </p>
          <p className="text-text-secondary text-sm mt-1">
            Score: <span className="text-text-primary font-medium">{data.highest_risk?.avg_risk_score || 0}</span> / 100
          </p>
        </div>
      </div>
    </div>
  );
};

export default SectorIntelligence;
