'use client';

import ReactECharts from 'echarts-for-react';
import { TimelineData } from '@/types';

interface TimelineChartProps {
  data: TimelineData[];
}

export function TimelineChart({ data }: TimelineChartProps) {
  const safeData = Array.isArray(data) ? data : [];
  
  if (safeData.length === 0) {
    return (
      <div className="w-full h-[350px] min-h-[350px] flex items-center justify-center text-text-secondary border border-border rounded-lg">
        No data available
      </div>
    );
  }

  const categories = safeData.map(d => d.date);
  const values = safeData.map(d => d.count);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis'
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
        type: 'line',
        smooth: true,
        showSymbol: false,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0)' }
            ]
          }
        },
        lineStyle: {
          color: '#3b82f6',
          width: 3
        },
        itemStyle: {
          color: '#3b82f6'
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
