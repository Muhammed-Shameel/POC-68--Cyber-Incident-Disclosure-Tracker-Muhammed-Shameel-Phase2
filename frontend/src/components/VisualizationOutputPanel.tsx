import React from 'react';
import { Database, FileText, Globe, Gauge, Clock, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

interface VisualizationOutputPanelProps {
  currentDataset: string;
  records: number;
  coverage: string;
  confidence: 'High' | 'Medium' | 'Low';
  dataFreshness: string;
}

const confidenceStyles: Record<VisualizationOutputPanelProps['confidence'], string> = {
  High: 'text-primary-accent bg-primary-accent/10 border-primary-accent/20',
  Medium: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  Low: 'text-red-500 bg-red-500/10 border-red-500/20',
};

export function VisualizationOutputPanel({
  currentDataset,
  records,
  coverage,
  confidence,
  dataFreshness,
}: VisualizationOutputPanelProps) {
  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-8">
        <div className="p-2 bg-primary-accent/10 rounded-lg">
          <Database className="w-5 h-5 text-primary-accent" />
        </div>
        <h2 className="text-xl font-bold text-text-primary tracking-tight">Visualization Output Summary</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <OutputMetric 
          label="Current Dataset" 
          value={currentDataset} 
          icon={FileText} 
        />
        <OutputMetric 
          label="Total Records" 
          value={records.toLocaleString()} 
          icon={Database} 
        />
        <OutputMetric 
          label="Intelligence Coverage" 
          value={coverage} 
          icon={Globe} 
        />
        <OutputMetric 
          label="Confidence Level" 
          value={confidence} 
          icon={ShieldCheck}
          valueClass={confidenceStyles[confidence]}
        />
        <OutputMetric 
          label="Data Freshness" 
          value={dataFreshness} 
          icon={Clock} 
        />
      </div>
    </div>
  );
}

function OutputMetric({ 
  label, 
  value, 
  icon: Icon, 
  valueClass 
}: { 
  label: string; 
  value: string; 
  icon: any;
  valueClass?: string;
}) {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center gap-2 text-text-secondary">
        <Icon className="w-4 h-4" />
        <span className="text-[10px] uppercase tracking-widest font-bold">{label}</span>
      </div>
      <div className={cn(
        "text-sm font-semibold text-text-primary truncate",
        valueClass && "px-2 py-0.5 rounded border inline-block w-fit"
      )}>
        {value}
      </div>
    </div>
  );
}
