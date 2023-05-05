import React, { useState, useEffect } from 'react';
import { Chart, ChartDataset, TooltipItem, TooltipModel, ChartData } from 'chart.js/auto';
import { DataItem, loadData } from '@/data';

type Props = {
  lat?: string;
  long?: string;
  assetName?: string;
  businessCategory?: string;
};

interface ExtendedChartDataSets extends ChartDataset<'line'> {
  assetNames: string[];
  riskFactors: string[];
}

const LineGraph: React.FC<Props> = ({ lat, long, assetName, businessCategory }) => {
  const [data, setData] = useState<DataItem[]>([]);
  const [chart, setChart] = useState<Chart | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    loadData().then(setData);
  }, []);

  useEffect(() => {
    if (!data.length || !canvasRef.current) return;

    const filteredData = data.filter((item) => {
      if (lat && long) {
        return item.Lat === lat && item.Long === long;
      } else if (assetName) {
        return item['Asset Name'] === assetName;
      } else if (businessCategory) {
        return item['Business Category'] === businessCategory;
      }
      return false;
    });

    if (!filteredData.length) return;

    const sortedData = filteredData.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
    const labels = sortedData.map((item) => item.Year);
    const riskRatings = sortedData.map((item) => parseFloat(item['Risk Rating']));
    const riskFactors = sortedData.map((item) => item['Risk Factors']);
    const assetNames = sortedData.map((item) => item['Asset Name']);

    if (chart) {
      chart.data.labels = labels;
      chart.data.datasets![0].data = riskRatings;
      (chart.data.datasets![0] as ExtendedChartDataSets).assetNames = assetNames;
      (chart.data.datasets![0] as ExtendedChartDataSets).riskFactors = riskFactors;
      chart.update();
    } else {
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      setChart(
        new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [
              {
                label: 'Risk Rating',
                data: riskRatings,
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                fill: false,
                assetNames,
                riskFactors,
              } as ExtendedChartDataSets,
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                  title: function (tooltipItems: (TooltipItem<'line'> & { index?: number })[], data?: ChartData<'line'>) {
                    if (data && data.labels && tooltipItems[0].index !== undefined) {
                      const index = tooltipItems[0].index;
                      return `Year: ${data.labels[index]}`;
                    }
                  },
                },
              },
            },
          },
        })
      );
    }
  }, [lat, long, assetName, businessCategory, data, chart]);

  return <canvas ref={canvasRef} />;
};

export default LineGraph;

