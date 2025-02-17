'use client';

import React, { useEffect, useState } from 'react';
import { MdFavorite } from 'react-icons/md';
import dynamic from 'next/dynamic';
import { ChartData, ChartOptions, TooltipItem } from 'chart.js';
import ExpensesCard from './expensesCard';
import IncomesCard from './incomesCard';
import AffiliatesCard from './affiliatesCard';
import {
  fetchDashboardTotals,
  fetchDashboardTrends,
  fetchDashboardVS,
  getTotals,
} from '@/components/api-client';
import 'chart.js/auto';
import { DashboardData, VersusData, TrendItem } from '@/app/types/dashboard';

const DonutChart = dynamic(
  () => import('react-chartjs-2').then(({ Doughnut }) => Doughnut),
  { ssr: false }
);

const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
  ssr: false,
});

const options: ChartOptions<'doughnut'> = {
  cutout: '80%',
  interaction: {
    mode: 'nearest' as const,
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

const trendOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      type: 'category', // For category scale on x-axis (labels)
      grid: {
        display: false,
      },
    },
    y: {
      type: 'linear', // For linear scale on y-axis (numbers)
      position: 'left', // Y-axis on the right
      grid: {
        display: true,
      },
      ticks: {
        display: true,
      },
    },
    y1: {
      type: 'linear',
      position: 'right',
      grid: {
        display: false,
      },
      ticks: {
        display: false,
      },
    },
  },
};

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    cards: {
      currentExpense: '',
      currentIncome: '',
      previousExpense: '',
      previousIncome: '',
    },
    totals: {
      total: '',
      totalExcludes: '',
      totalMembers: '',
    },
    versus: {
      expense: '',
      income: '',
    },
    trends: null,
  });
  const [versusChartData, setVersusChartData] = useState<ChartData<
    'doughnut',
    number[],
    unknown
  > | null>(null);
  const [trendsChartData, setTrendsChartData] = useState<ChartData<
    'line',
    number[],
    unknown
  > | null>(null);

  const convertVersusData = (data: VersusData) => {
    if (data) {
      const expense = Number(data.expense);
      const income = Number(data.income);

      // Calculate total
      const total = expense + income;

      // Calculate percentages
      const expensePercentage = (expense / total) * 100;
      const incomePercentage = (income / total) * 100;

      const chart: ChartData<'doughnut', number[], unknown> = {
        labels: ['Ingresos', 'Egresos'],
        datasets: [
          {
            data: [incomePercentage, expensePercentage],
            backgroundColor: ['#0560EA', '#56CFE1'],
            borderColor: 'transparent',
            borderRadius: 10,
            hoverOffset: 20,
          },
        ],
      };
      setVersusChartData(chart);
    }
  };

  const convertTrendData = (trendData: TrendItem[]) => {
    const labels = trendData.map((item) => item.monthName);
    const incomeData = trendData.map((item) => parseInt(item.income, 10)); // Parse to number
    const expenseData = trendData.map((item) => parseInt(item.expenses, 10)); // Parse to number

    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Ingresos',
          data: incomeData,
          fill: false,
          borderColor: '#0560EA',
          tension: 0.5,
          pointRadius: 0,
          yAxisID: 'y',
        },
        {
          label: 'Egresos',
          data: expenseData,
          fill: false,
          borderColor: '#56CFE1',
          tension: 0.5,
          pointRadius: 0,
          yAxisID: 'y1',
        },
      ],
      type: 'line' as const,
    };
    setTrendsChartData(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totals = await getTotals();
        const versus = await fetchDashboardVS();
        const cards = await fetchDashboardTotals();
        const trends = await fetchDashboardTrends();

        const data = {
          totals: totals,
          versus: versus,
          cards: cards,
          trends: trends,
        };

        setDashboardData(data);
        convertVersusData(data.versus);

        if (data.trends && data.trends.trend) {
          convertTrendData(data.trends.trend);
        }

        console.log('DATA: ', data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        {/* Gráfico de dona */}
        <div className='md:w-1/3 bg-white rounded-lg p-6'>
          {!loading && versusChartData && (
            <>
              <h2 className='text-2xl font-bold'>Ingresos y Egresos</h2>
              <p className='text-gray-500'>Mes de Diciembre</p>
              <div className='w-full h-[380px]'>
                <DonutChart data={versusChartData} options={options} />
              </div>
              <div className='flex justify-around mt-4'>
                <div>
                  <div
                    className='w-4 h-4 rounded-full mr-2 my-2'
                    style={{
                      backgroundColor: '#0560EA',
                    }}
                  ></div>
                  <div className='font-bold text-3xl'>
                    {versusChartData.datasets[0].data[0]}%
                  </div>
                  <div className='text-sm text-gray-500'>Ingresos</div>
                </div>
                <div>
                  <div
                    className='w-4 h-4 rounded-full mr-2 my-2'
                    style={{
                      backgroundColor: '#56CFE1',
                    }}
                  ></div>
                  <div className='font-bold text-3xl'>
                    {versusChartData.datasets[0].data[1]}%
                  </div>
                  <div className='text-sm text-gray-500'>Egresos</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Tarjetas de ingresos, egresos y afiliados */}
        <div className='md:w-2/3 flex flex-col gap-4'>
          <div className='flex gap-4'>
            <div className='w-1/3'>
              <IncomesCard
                month='Diciembre'
                current={dashboardData.cards.currentIncome}
                previous={dashboardData.cards.previousIncome}
              />
            </div>
            <div className='w-1/3'>
              <ExpensesCard
                month='Diciembre'
                current={dashboardData.cards.currentExpense}
                previous={dashboardData.cards.previousExpense}
              />
            </div>
            <div className='w-1/3'>
              <AffiliatesCard amount={dashboardData.totals.totalMembers} />
            </div>
          </div>

          {/* Gráfico de tendencias */}
          <div className='bg-white rounded-lg p-6'>
            {!loading && (
              <div className='mb-5'>
                <div className='flex items-center justify-between'>
                  <span className='font-bold text-xl mr-4'>Tendencias</span>
                  <div className='flex items-center'>
                    <div className='flex items-center mr-4'>
                      <div className='w-2 h-2 rounded-full bg-[#0560EA] mr-2'></div>
                      <span className='text-gray-700'>Ingresos</span>
                    </div>
                    <div className='flex items-center'>
                      <div className='w-2 h-2 rounded-full bg-[#56CFE1] mr-2'></div>
                      <span className='text-gray-700'>Egresos</span>
                    </div>
                  </div>
                </div>
                <span className='text-sm text-gray-500 mr-8'>Último año</span>{' '}
              </div>
            )}
            {!loading && trendsChartData && (
              <div className='pl-6 w-full h-[320px]'>
                {trendsChartData.labels &&
                  trendsChartData.datasets &&
                  trendsChartData.datasets.length > 0 && (
                    <Line data={trendsChartData} options={trendOptions} />
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
