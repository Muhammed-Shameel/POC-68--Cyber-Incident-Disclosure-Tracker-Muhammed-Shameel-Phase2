'use client';

import React from 'react';
import { ChartCard } from './ChartCard';
import { AttackIntelligence as AttackIntelligenceType } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AttackDistributionPanelProps {
  data: AttackIntelligenceType;
}

const AttackDistributionPanel: React.FC<AttackDistributionPanelProps> = ({ data }) => {
  const attacks = data?.attacks ?? [];
  const chartData = attacks.map(attack => ({
        name: attack.attack_type,
        Incidents: attack.count,
      }));

  return (
    <ChartCard title="Attack Type Distribution">
      {chartData.length > 0 ? (
        <div className="w-full h-[350px] min-h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" />
              <XAxis dataKey="name" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '4px' }}
                itemStyle={{ color: '#f4f4f5' }}
              />
              <Bar dataKey="Incidents" fill="#6366f1" activeBar={{ fill: '#4f46e5' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-text-secondary">
          No attack type distribution data available.
        </div>
      )}
    </ChartCard>
  );
};

export default AttackDistributionPanel;
