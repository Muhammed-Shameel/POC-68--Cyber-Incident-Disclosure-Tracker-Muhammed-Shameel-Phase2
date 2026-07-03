'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { IntelligenceTrends } from '../types';

interface TrendIntelligenceProps {
  trends: IntelligenceTrends;
}

const TrendIntelligence: React.FC<TrendIntelligenceProps> = ({ trends }) => {
  const renderTrend = (label: string, data: { current: number; previous: number; growth: number | null }) => {
    const isPositive = (data.growth ?? 0) > 0;
    
    return (
      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
        <p className="text-slate-400 text-sm mb-1">{label}</p>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-2xl font-bold text-white">{data.current}</span>
            <span className="text-slate-500 text-xs ml-2">vs {data.previous}</span>
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-red-400' : 'text-emerald-400'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {Math.abs(data.growth ?? 0)}%
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Activity className="w-5 h-5 text-blue-500" />
        </div>
        <h2 className="text-xl font-bold text-white">Trend Intelligence</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderTrend('Monthly Growth', trends.monthly)}
        {renderTrend('Quarterly Growth', trends.quarterly)}
        {renderTrend('Yearly Growth', trends.yearly)}
      </div>
    </div>
  );
};

export default TrendIntelligence;
