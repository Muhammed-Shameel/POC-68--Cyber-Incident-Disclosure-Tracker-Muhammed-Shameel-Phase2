'use client';

import React from 'react';
import { Lightbulb, ChevronRight } from 'lucide-react';

interface ExecutiveInsightsProps {
  insights: string[];
}

const ExecutiveInsights: React.FC<ExecutiveInsightsProps> = ({
  insights = [],
}) => {
  return (
    <div className="bg-surface border border-border rounded-xl p-6 h-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-primary-accent/10 rounded-lg">
          <Lightbulb className="w-5 h-5 text-primary-accent" />
        </div>
        <h2 className="text-xl font-bold text-text-primary">Executive Insights</h2>
      </div>

      <div className="space-y-4">
        {insights?.length > 0 ? (
          insights.map((insight, index) => (
            <div 
              key={index} 
              className="flex gap-3 p-4 bg-secondary-surface/50 rounded-lg border border-border/50 hover:border-primary-accent/30 transition-colors group"
            >
              <ChevronRight className="w-5 h-5 text-primary-accent shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
              <p className="text-text-primary leading-relaxed">{insight}</p>
            </div>
          ))
        ) : (
          <p className="text-text-secondary italic">No insights available at this time.</p>
        )}
      </div>
    </div>
  );
};

export default ExecutiveInsights;
