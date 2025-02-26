'use client';

import React, { useEffect, useState } from 'react';
import { MdDataUsage, MdFavorite } from 'react-icons/md';
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
import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react';
import {
  formatNumberWithSuffix,
  getMonthFormatted,
  getPastMonths,
} from '@/utils/utils';

const DonutChart = dynamic(
  () => import('react-chartjs-2').then(({ Doughnut }) => Doughnut),
  { ssr: false }
);

const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
  ssr: false,
});

// Opciones del gráfico de Dona
const options: ChartOptions<'doughnut'> = {
  cutout: '75%',
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
      left: 24,
      right: 24,
      top: 12,
      bottom: 12,
    },
  },
  responsive: true,
  maintainAspectRatio: false,
  circumference: 360,
  rotation: 90,
};

// Opciones del gráfico de Línea doble
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
        callback: function (value) {
          return formatNumberWithSuffix(value); // Apply your formatter
        },
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

interface MonthPeriod {
  month: string;
  period: string;
}

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    getMonthFormatted()
  );
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

  const lastFourMonths = getPastMonths(4);

  const handleFilterSelect = async (month: MonthPeriod) => {
    if (loading) {
      return;
    }
    console.log('Filtered by ', month);

    try {
      const versus = await fetchDashboardVS(month.period);
      const cards = await fetchDashboardTotals(month.period);

      const data = {
        versus: versus,
        cards: cards,
      };

      setSelectedMonth(month.month);

      setDashboardData((prevState) => ({
        ...prevState,
        versus: versus,
        cards: cards,
      }));

      convertVersusData(data.versus);

      console.log('Month: ', month);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

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
    const labels = trendData.map((item) => item.monthName.charAt(0));
    const incomeData = trendData.map((item) => parseInt(item.income, 10)); // Parse to number
    const expenseData = trendData.map((item) => parseInt(item.expenses, 10)); // Parse to number

    console.log('trendData', trendData);
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
    <div className='container max-w-[900px] 2xl:max-w-[1080px] ml-[calc(100%/12)]'>
      <div className='py-6 flex flex-col items-center'>
        <MdFavorite size={30} color='#56CFE1' />
      </div>
      <hr className='border-gray-200' />

      <div className='my-10'>
        <h2 className='text-4xl'>
          <span className='font-bold'>Obra Social</span> | Panel general
        </h2>
        <p className='font-bold text-xl'>
          Gráficos comparativos de ingresos y egresos del último mes completo.
        </p>
      </div>

      {/* Bloque de contenido */}
      <div className='flex flex-col md:flex-row gap-4'>
        {/* Gráfico de dona */}
        <div className='md:w-1/3 h-[500px] bg-white rounded-lg p-3'>
          {!loading && versusChartData && (
            <div className='flex flex-col h-full'>
              <div className='flex items-center justify-between'>
                <div>
                  <h2 className='font-bold'>Ingresos y Egresos</h2>
                  <p className='text-xs text-gray-500'>
                    Mes de {selectedMonth}
                  </p>
                </div>
                <Popover className='relative'>
                  <PopoverButton className='p-1 bg-white rounded-md shadow-md hover:bg-gray-100 active:bg-gray-200 active:scale-95 transition-all duration-75'>
                    <MdDataUsage size={20} />
                  </PopoverButton>
                  <PopoverPanel className='absolute top-12 w-48 bg-[#F6F7FB] font-semibold rounded-md shadow-lg z-10'>
                    <div className='p-2'>
                      <PopoverGroup>
                        {lastFourMonths.map((month) => {
                          return (
                            <PopoverButton
                              key={month.period}
                              as='button'
                              className={`
                                block px-4 py-2 w-full text-left text-sm text-[#2A2A2A] hover:bg-gray-200 rounded-md
                                ${
                                  selectedMonth === month.month
                                    ? 'text-white bg-[#0560EA]'
                                    : ''
                                }
                              `}
                              onClick={() => handleFilterSelect(month)}
                            >
                              {month.month}
                            </PopoverButton>
                          );
                        })}
                      </PopoverGroup>
                    </div>
                  </PopoverPanel>
                </Popover>
              </div>
              <div className='w-full flex-grow relative'>
                <DonutChart data={versusChartData} options={options} />
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-[Poppins] font-bold pointer-events-none'>
                  100%
                </div>
              </div>
              <div className='flex justify-around mt-4'>
                <div>
                  <div
                    className='w-4 h-4 rounded-full mr-2 my-2'
                    style={{
                      backgroundColor: '#0560EA',
                    }}
                  ></div>
                  <div className='font-bold font-[Poppins] text-3xl'>
                    {versusChartData.datasets[0].data[0]}%
                  </div>
                  <div className='text-xs text-gray-500'>Ingresos</div>
                </div>
                <div>
                  <div
                    className='w-4 h-4 rounded-full mr-2 my-2'
                    style={{
                      backgroundColor: '#56CFE1',
                    }}
                  ></div>
                  <div className='font-bold font-[Poppins] text-3xl'>
                    {versusChartData.datasets[0].data[1]}%
                  </div>
                  <div className='text-xs text-gray-500'>Egresos</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tarjetas de ingresos, egresos y afiliados */}
        <div className='md:w-2/3 h-[500px] flex flex-col gap-4'>
          <div className='flex h-full gap-4'>
            <div className='w-1/3'>
              <IncomesCard
                month={selectedMonth}
                current={dashboardData.cards.currentIncome}
                previous={dashboardData.cards.previousIncome}
              />
            </div>
            <div className='w-1/3'>
              <ExpensesCard
                month={selectedMonth}
                current={dashboardData.cards.currentExpense}
                previous={dashboardData.cards.previousExpense}
              />
            </div>
            <div className='w-1/3'>
              <AffiliatesCard amount={dashboardData.totals.totalMembers} />
            </div>
          </div>

          {/* Gráfico de tendencias */}
          <div className='bg-white rounded-lg p-3'>
            <div className='mb-4'>
              <div className='flex items-center justify-between'>
                <span className='font-bold mr-4'>Tendencias</span>
                <div className='flex items-center'>
                  <div className='flex items-center mr-4'>
                    <div className='w-2 h-2 rounded-full bg-[#0560EA] mr-2'></div>
                    <span className='text-xs text-gray-700'>Ingresos</span>
                  </div>
                  <div className='flex items-center'>
                    <div className='w-2 h-2 rounded-full bg-[#56CFE1] mr-2'></div>
                    <span className='text-xs text-gray-700'>Egresos</span>
                  </div>
                </div>
              </div>
              <span className='text-xs text-gray-500 mr-8'>Último año</span>
            </div>
            {/* Gráfico de líneas */}
            <div className='pl-6 w-full h-[250px]'>
              {!loading &&
                trendsChartData &&
                trendsChartData.labels &&
                trendsChartData.datasets &&
                trendsChartData.datasets.length > 0 && (
                  <Line data={trendsChartData} options={trendOptions} />
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
