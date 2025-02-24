// components/ProgressChart.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ProgressChartProps {
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      fill: boolean;
      backgroundColor: string;
      borderColor: string;
    }[];
  };
}

const ProgressChart: React.FC<ProgressChartProps> = ({ chartData }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Weekly Progress',
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default ProgressChart;
