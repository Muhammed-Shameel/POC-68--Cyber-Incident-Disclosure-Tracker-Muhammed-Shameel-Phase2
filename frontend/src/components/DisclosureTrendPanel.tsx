'use client';

import React from 'react';
import { ChartCard } from './ChartCard';
import { IntelligenceTrends } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DisclosureTrendPanelProps {
  trends: IntelligenceTrends;
}

const DisclosureTrendPanel: React.FC<DisclosureTrendPanelProps> = ({ trends }) => {
  const safeTrends = trends ?? { 
    monthly: { current: 0, previous: 0, growth: 0 }, 
    quarterly: { current: 0, previous: 0, growth: 0 }, 
    yearly: { current: 0, previous: 0, growth: 0 } 
  };

  const trendData = [
    { name: 'Monthly', current: safeTrends.monthly.current, previous: safeTrends.monthly.previous, growth: safeTrends.monthly.growth },
    { name: 'Quarterly', current: safeTrends.quarterly.current, previous: safeTrends.quarterly.previous, growth: safeTrends.quarterly.growth },
    { name: 'Yearly', current: safeTrends.yearly.current, previous: safeTrends.yearly.previous, growth: safeTrends.yearly.growth },
  ];

  const hasMeaningfulData = trendData.some(item => item.growth !== null && item.growth !== 0);

  return (
    <ChartCard title="Disclosure Trend (Incidents Growth)">
      {hasMeaningfulData ? (
        <div className="w-full h-[350px] min-h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trendData}
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
                formatter={(value, name) => [
                  `${(Number(value) || 0).toFixed(2)}`,
                  String(name ?? '')
                ]}
                contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568', borderRadius: '4px' }}
                itemStyle={{ color: '#E2E8F0' }}
              />
              <Legend />
              <Line type="monotone" dataKey="growth" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-text-secondary">
          No significant trend data available.
        </div>
      )}
    </ChartCard>
  );
};

export default DisclosureTrendPanel;
