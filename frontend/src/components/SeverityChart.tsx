'use client';

import ReactECharts from 'echarts-for-react';
import { SeverityStats } from '@/types';

interface SeverityChartProps {
  data: SeverityStats;
}

export function SeverityChart({ data }: SeverityChartProps) {
  const distribution = data?.distribution ?? {};
  const categories = Object.keys(distribution);
  const values = Object.values(distribution);

  if (!categories || categories.length === 0) {
    return (
      <div className="w-full h-[350px] min-h-[350px] flex items-center justify-center text-text-secondary border border-border rounded-lg">
        No data available
      </div>
    );
  }

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'none'
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
      type: 'category',
      data: categories,
      axisLabel: {
        color: '#a1a1aa'
      },
      axisLine: {
        lineStyle: {
          color: '#3f3f46'
        }
      }
    },
    yAxis: {
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
    series: [
      {
        data: values,
        type: 'bar',
        barWidth: '40%',
        itemStyle: {
          color: function(params: { name: string }) {
            const colors: Record<string, string> = {
              'CRITICAL': '#ef4444',
              'HIGH': '#f97316',
              'MEDIUM': '#facc15',
              'LOW': '#22c55e'
            };
            return colors[params.name] || '#3b82f6';
          },
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: '#4f46e5'
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
