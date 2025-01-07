'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);
export const options: ChartOptions<'bar'> = {
  indexAxis: 'y' as const,
  elements: {
    bar: {
      borderRadius: 10,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
    datalabels: {
      color: 'white',
      anchor: 'start',
      align: 'end',
      offset: 5,
      formatter: (context: { dataIndex: number }) => {
        return labels[context.dataIndex];
      },
    },
  },
  scales: {
    y: {
      ticks: {
        display: false,
      },
    },
  },
};

const labels = [
  'Adherente',
  'Bravo',
  'Desregulado',
  'Genuino',
  'Jubilado',
  'Municipal',
  'Nova',
  'Personal',
];

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => faker.number.int({ min: 0, max: 1000 })),
      backgroundColor: 'rgba(5, 96, 234, 1)',
    },
  ],
};

export function HorizontalChart() {
  return <Bar options={options} data={data} />;
}
