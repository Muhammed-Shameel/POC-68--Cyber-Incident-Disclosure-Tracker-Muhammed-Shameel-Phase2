'use client';

import React from 'react';
import { Shield, TrendingUp, TrendingDown } from 'lucide-react';
import { AttackIntelligence as AttackIntelType } from '../types';

interface AttackIntelligenceProps {
  data: AttackIntelType;
}

const AttackIntelligence: React.FC<AttackIntelligenceProps> = ({ data }) => {
  const attacks = data?.attacks ?? [];
  return (
    <div className="bg-surface border border-border rounded-xl p-6 h-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-primary-accent/10 rounded-lg">
          <Shield className="w-5 h-5 text-primary-accent" />
        </div>
        <h2 className="text-xl font-bold text-text-primary">Attack Intelligence</h2>
      </div>

      <div className="space-y-4">
        {attacks.map((attack, index) => {
          const isPositive = (attack.growth ?? 0) > 0;
          return (
            <div key={index} className="p-4 bg-secondary-surface/30 rounded-lg border border-border/30">
              <div className="flex justify-between items-start mb-2">
                <span className="text-text-primary font-medium">{attack.attack_type}</span>
                <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-secondary-accent' : 'text-primary-accent'}`}>
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(attack.growth)}%
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-secondary-surface rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-accent/60" 
                    style={{ width: `${attack.percentage}%` }}
                  />
                </div>
                <span className="text-text-secondary text-xs min-w-[3rem] text-right">
                  {attack.percentage}%
                </span>
              </div>
              <div className="mt-1 text-text-secondary text-[10px] uppercase tracking-wider">
                {attack.count} total incidents
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttackIntelligence;
;
};

export default AttackIntelligence;
