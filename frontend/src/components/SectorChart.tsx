'use client';

import ReactECharts from 'echarts-for-react';
import { SectorStats } from '@/types';

interface SectorChartProps {
  data: SectorStats[];
}

export function SectorChart({ data }: SectorChartProps) {
  const safeData = Array.isArray(data) ? data : [];

  if (safeData.length === 0) {
    return (
      <div className="w-full h-[350px] min-h-[350px] flex items-center justify-center text-text-secondary border border-border rounded-lg">
        No data available
      </div>
    );
  }

  // Sort by count and take top 10
  const sortedData = [...safeData].sort((a, b) => b.count - a.count).slice(0, 10);
  const categories = sortedData.map(d => d.sector);
  const values = sortedData.map(d => d.count);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        color: '#a1a1aa'
      },
      splitLine: {
        lineStyle: {
          color: '#27272a'
        }
      }
    },
    yAxis: {
      type: 'category',
      data: categories.reverse(),
      axisLabel: {
        color: '#a1a1aa',
        width: 100,
        overflow: 'break'
      },
      axisLine: {
        lineStyle: {
          color: '#3f3f46'
        }
      }
    },
    series: [
      {
        data: values.reverse(),
        type: 'bar',
        itemStyle: {
          color: '#3b82f6',
          borderRadius: [0, 4, 4, 0]
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
