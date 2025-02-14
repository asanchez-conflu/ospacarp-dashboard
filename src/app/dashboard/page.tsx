'use client';

import React from 'react';
import { MdFavorite } from 'react-icons/md';
import dynamic from 'next/dynamic';
import { TooltipItem } from 'chart.js';
import ExpensesCard from './expensesCard';
import IncomesCard from './incomesCard';
import AffiliatesCard from './affiliatesCard';

const DonutChart = dynamic(
  () => import('react-chartjs-2').then(({ Doughnut }) => Doughnut), // Import Doughnut
  { ssr: false } // Important: Disable SSR
);

const HomePage: React.FC = () => {
  // Mock data
  const data = {
    labels: ['Ingresos', 'Egresos'],
    datasets: [
      {
        data: [75, 35],
        backgroundColor: ['#0EA5E9', '#172554'],
        borderColor: 'transparent',
        cutout: '80%',
        borderRadius: 10,
        hoverOffset: 20,
      },
    ],
  };

  const options = {
    interaction: {
      mode: 'nearest' as const, // Use 'as const' to enforce type
      intersect: false,
    },
    plugins: {
      legend: {
        display: false, // Hide default legend
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: TooltipItem<'doughnut'>) => {
            const value = context.formattedValue; // Get the numeric value
            const percentage = parseFloat(value); // Ensure it's a number
            return `${percentage}%`; // Format as percentage
          },
        },
      },
    },
    layout: {
      padding: {
        left: 12,
        right: 12,
        top: 12,
        bottom: 12,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    circumference: 360,
    rotation: 90,
  };

  return (
    <div>
      <div className='my-6 flex flex-col items-center'>
        <MdFavorite size={30} color='#56CFE1' />
      </div>
      <hr className='border-gray-200 mx-10' />

      <div className='m-10'>
        <h2 className='text-4xl'>
          <span className='font-bold'>Obra Social</span> | Panel general
        </h2>
        <p className='font-bold text-xl'>
          Gráficos comparativos de ingresos y egresos del último mes completo.
        </p>
      </div>

      {/* Bloque de contenido */}
      <div className='flex flex-col md:flex-row gap-4 mx-10'>
        {/* Left Big Block */}
        <div className='md:w-1/3 bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-2xl font-bold'>Ingresos y Egresos</h2>
          <p className='text-gray-500'>Mes de Febrero</p>
          <div className='w-full h-[380px]'>
            <DonutChart data={data} options={options} />
          </div>
          {/* Custom Legend */}
          <div className='flex justify-around mt-4'>
            <div>
              <div
                className='w-4 h-4 rounded-full mr-2 my-2'
                style={{
                  backgroundColor: data.datasets[0].backgroundColor[0],
                }}
              ></div>
              <div className='font-bold text-3xl'>
                {data.datasets[0].data[0]}%
              </div>
              <div className='text-sm text-gray-500'>{data.labels[0]}</div>
            </div>
            <div>
              <div
                className='w-4 h-4 rounded-full mr-2 my-2'
                style={{
                  backgroundColor: data.datasets[0].backgroundColor[1],
                }}
              ></div>
              <div className='font-bold text-3xl'>
                {data.datasets[0].data[1]}%
              </div>
              <div className='text-sm text-gray-500'>{data.labels[1]}</div>
            </div>
          </div>
        </div>

        {/* Right Side Blocks */}
        <div className='md:w-2/3 flex flex-col gap-4'>
          {/* Top Row of Small Blocks */}
          <div className='flex gap-4'>
            <div className='w-1/3'>
              <IncomesCard month='Febrero' amount='3000500000' />
            </div>
            <div className='w-1/3'>
              <ExpensesCard month='Febrero' amount='2940526218' />
            </div>
            <div className='w-1/3'>
              <AffiliatesCard amount='88053' />
            </div>
          </div>

          {/* Bottom Big Block */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            {/* Content for the right bottom big block */}
            Right Bottom Big Block
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
