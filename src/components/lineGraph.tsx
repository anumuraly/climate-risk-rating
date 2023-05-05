import React, { useState, useEffect } from 'react';
import Chart from 'chart.js';
import { DataItem, loadData } from '@/data';

type Props = {
  lat?: string;
  long?: string;
  assetName?: string;
  businessCategory?: string;
};

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
      chart.data.datasets![0].assetNames = assetNames;
      chart.data.datasets![0].riskFactors = riskFactors;
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
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            tooltips: {
              mode: 'index',
              intersect: false,
              multiLine: true,
              callbacks: {
                title: function (tooltipItem: any, data: any) {
                  const index = tooltipItem[0].index;
                  return `Year: ${data.labels[index]}`;
                },
                label: function (tooltipItem: any, data: any) {
                  const dataset = data.datasets[tooltipItem.datasetIndex];
                  const index = tooltipItem.index;
                  return [
                    `Asset Name: ${dataset.assetNames[index]}`,
                    `Risk Rating: ${tooltipItem.yLabel}`,
                    `Risk Factors: ${dataset.riskFactors[index]}`,
                  ];
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
