'use client';

import React from 'react';
import { ChartCard } from './ChartCard';
import { SectorIntelligence as SectorIntelligenceType } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface SectorExposurePanelProps {
  data: SectorIntelligenceType;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF69B4', '#8A2BE2', '#32CD32'];

const SectorExposurePanel: React.FC<SectorExposurePanelProps> = ({ data }) => {
  const allSectors = data?.all_sectors ?? [];
  const chartData = allSectors
    .map(sector => ({
        name: sector.sector,
        value: sector.incident_count,
      })).filter(item => item.value > 0);

  return (
    <ChartCard title="Sector Exposure Percentage">
      {chartData.length > 0 ? (
        <div className="w-full h-[350px] min-h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                isAnimationActive={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-text-secondary">
          No sector exposure data available.
        </div>
      )}
    </ChartCard>
  );
};

export default SectorExposurePanel;