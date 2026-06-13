'use client';

import ReactECharts from 'echarts-for-react';
import { SectorStats } from '@/types';

interface SectorPieChartProps {
  data: SectorStats[];
}

export function SectorPieChart({ data }: SectorPieChartProps) {
  const safeData = Array.isArray(data) ? data : [];

  if (safeData.length === 0) {
    return (
      <div className="w-full h-[350px] min-h-[350px] flex items-center justify-center text-text-secondary border border-border rounded-lg">
        No data available
      </div>
    );
  }

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: { color: '#a1a1aa' }
    },
    series: [
      {
        name: 'Sector Exposure',
        type: 'pie',
        radius: '60%',
        label: {
          show: false
        },
        data: safeData.map(d => ({ name: d.sector, value: d.incident_count })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  return (
    <div className="w-full h-[350px] min-h-[350px]">
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}
