/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react';
import { ChartData, ChartOptions } from 'chart.js';
import 'chart.js/auto';
import { MdFavorite, MdTune } from 'react-icons/md';

import {
  fetchExpenses,
  fetchExpensesHistoricData,
} from '@/components/api-client';

import type {
  ExpensesOrigin,
  DataItem,
  ExpensesDelegation,
  HistoryExpensesItem,
} from '@/app/types/affiliates';

import BackButton from '@/components/common/backButton';
import HistoricButton from '@/components/common/historicButton';
import HorizontalBar from '@/app/dashboard/egresos/horizontalBar';
import { formatNumberWithSuffix, getMonth, toTitleCase } from '@/utils/utils';
import withAuth from '@/components/withAuth';

const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
  ssr: false,
});

const EgresosPage: React.FC = () => {
  const [filterType, setFilterType] = useState<'origin' | 'delegations'>(
    'origin'
  );
  const [graphData, setGraphData] = useState<DataItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [listData, setListData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [trendData, setTrendData] = useState<ChartData<'line'> | null>(null);

  const selectedLabel = listData.find((item) => item.id === selectedId)?.label;

  // Opciones de chart.js
  const options: ChartOptions<'line'> = {
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
        position: 'right', // Y-axis on the right
        grid: {
          display: true,
        },
        ticks: {
          callback: function (value) {
            return formatNumberWithSuffix(value); // Apply your formatter
          },
        },
      },
    },
  };

  // Filtro de tipo origen/delegación
  const handleFilterSelect = (type: 'origin' | 'delegations') => {
    if (loading) {
      return;
    }
    setFilterType(type);
  };

  // Cuando se cliquea una barra
  const handleBarClick = (id: string) => {
    if (selectedId) {
      return;
    }
    setSelectedId(id);
    fetchData(id);
  };

  const handleListClick = (id: string) => {
    if (selectedId === id) {
      return;
    }

    setSelectedId(id);

    // Si es seccion historica/tendencias
    if (trendData) {
      fetchHistory(id);
      return;
    }

    // Sino busca datos para nuevo id
    fetchData(id);
  };

  // Obtiene datos de origen o delegación
  const fetchData = async (id: string | null = null) => {
    setLoading(true);
    try {
      const dataResponse = await fetchExpenses(filterType, id);

      let processedData: DataItem[] = [];

      if (!dataResponse) {
        console.warn('No delegations data received');
        return;
      }

      let type = '';

      if (filterType === 'origin' && id === null) {
        type = 'origin';
      } else if (filterType === 'delegations' && id) {
        type = 'origin';
      } else {
        type = 'delegations';
      }

      if (type === 'origin') {
        if (!dataResponse.origins) {
          setGraphData([]);
          return;
        }

        const totalCount = dataResponse.origins.reduce(
          (acc: number, origin: ExpensesOrigin) => acc + parseInt(origin.total),
          0
        );

        processedData = dataResponse.origins.map((origin: ExpensesOrigin) => {
          const percentage =
            totalCount === 0
              ? 0
              : (parseFloat(origin.total) / totalCount) * 100;

          const formattedPercentage = parseFloat(
            percentage.toFixed(2)
          ).toLocaleString('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

          // Type conversion and creation of DataItem object
          const dataItem: DataItem = {
            label: toTitleCase(origin.description),
            percentage: formattedPercentage,
            id: String(origin.origin),
            total: origin.total,
          };
          return dataItem;
        });
      } else {
        // process delegations
        if (!dataResponse.delegations) {
          setGraphData([]);
          return;
        }

        const totalCount = dataResponse.delegations.reduce(
          (acc: number, delegation: ExpensesDelegation) =>
            acc + parseInt(delegation.total),
          0
        );

        processedData = dataResponse.delegations.map(
          (delegation: ExpensesDelegation) => {
            const percentage =
              totalCount === 0
                ? 0
                : (parseFloat(delegation.total) / totalCount) * 100;

            const formattedPercentage = parseFloat(
              percentage.toFixed(2)
            ).toLocaleString('es-AR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            // Type conversion and creation of DataItem object
            const dataItem: DataItem = {
              label: toTitleCase(delegation.description),
              percentage: formattedPercentage,
              id: String(delegation.delegation),
              total: delegation.total,
            };
            return dataItem;
          }
        );
      }

      setGraphData(processedData);

      if (id === null) {
        setListData(processedData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Regresa al gráfico general
  const goBack = () => {
    setSelectedId(null);
    setTrendData(null);
    fetchData();
  };

  // Va a sección histórica
  const goTrend = () => {
    if (selectedId) {
      fetchHistory(selectedId);
    }
  };

  // Formatea Trend Data para los gráficos
  const convertTrendDataTyped = (trendData: HistoryExpensesItem[]) => {
    const labels = trendData.map((item) => item.monthName.substring(0, 3));
    const data = trendData.map((item) => parseInt(item.expenses, 10)); // Parse count to number

    return {
      labels: labels,
      datasets: [
        {
          label: 'Count',
          data: data,
          fill: false,
          borderColor: '#FF9441',
          legend: {
            display: false, // Hide the label in the legend
          },
          tension: 0.5, // Adjust this value for curve smoothness (0 = straight lines, 1 = maximum curve)
          pointRadius: 0, // Set point radius to 0 to hide the dots
        },
      ],
    };
  };

  // Obtiene histórico/tendencia
  const fetchHistory = async (id: string) => {
    try {
      setLoading(true);
      const dataResponse = await fetchExpensesHistoricData(filterType, id);

      if (!dataResponse || !dataResponse.history) {
        console.warn('No data received for this type.');
        setTrendData(null);
        return;
      } else {
        const history = convertTrendDataTyped(dataResponse.history);
        setTrendData(history);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setTrendData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setSelectedId(null);
    fetchData();
  }, [filterType]);

  return (
    <div className='container max-w-[900px] 2xl:max-w-[1080px] ml-[calc(100%/12)]'>
      <div className='my-6 flex flex-col items-center'>
        <MdFavorite size={30} color='#56CFE1' />
      </div>
      <hr className='border-gray-200' />

      <div className='my-10'>
        <h2 className='font-bold text-4xl'>Panel gráfico de Egresos</h2>
        <p className='font-bold text-xl'>
          Gráficos de distribución de egresos según padrón.
        </p>
      </div>

      {/* Bloque principal */}
      <div className='pt-4 bg-white rounded-lg h-[460px] flex flex-col'>
        <div className='px-7 relative h-[44px]'>
          <h3 className='font-bold'>
            Distribución de Egresos por
            {filterType === 'origin' ? ' orígenes ' : ' delegaciones '} de
            afiliado
          </h3>
          <p className='text-sm'>
            Mes de {getMonth()} {selectedLabel && ` | ${selectedLabel}`}
          </p>

          {/* FILTRO - ocultar fuera de pantalla 1 */}
          {!selectedId && (
            <Popover>
              <PopoverButton className='absolute top-0 right-7 p-2 bg-white rounded-md shadow-md hover:bg-gray-100 active:bg-gray-200 active:scale-95 transition-all duration-75'>
                <MdTune size={20} color='black' />
              </PopoverButton>
              <PopoverPanel className='absolute right-7 top-10 w-48 bg-[#F6F7FB] font-semibold rounded-md shadow-lg z-10'>
                <div className='p-2'>
                  <PopoverGroup>
                    <PopoverButton
                      as='button'
                      className={`
                        block px-4 py-2 w-full text-left text-sm text-[#2A2A2A] hover:bg-gray-200 rounded-md
                        ${
                          filterType === 'origin'
                            ? 'text-white bg-[#0560EA]'
                            : ''
                        }
                      `}
                      onClick={() => handleFilterSelect('origin')}
                    >
                      Origen
                    </PopoverButton>
                    <PopoverButton
                      as='button'
                      className={`
                        block px-4 py-2 w-full text-left text-sm text-[#2A2A2A] hover:bg-gray-200 rounded-md
                        ${
                          filterType === 'delegations'
                            ? 'text-white bg-[#0560EA]'
                            : ''
                        }
                      `}
                      onClick={() => handleFilterSelect('delegations')}
                    >
                      Delegación
                    </PopoverButton>
                  </PopoverGroup>
                </div>
              </PopoverPanel>
            </Popover>
          )}
        </div>

        {/* TAGS */}
        <div className='text-right pr-4 mb-1 h-[28px]'>
          {!loading && !trendData && (
            <>
              <span className='text-xs text-gray-500'>Monto</span>
              <span className='text-xs ml-12 text-gray-500'>Porcentaje</span>
            </>
          )}
        </div>

        {/* BLOQUE DE CONTENIDO */}
        <div className='flex h-[372px] pr-4 relative'>
          {loading === true && <p className='px-7'>Cargando...</p>}

          {/* Lista lateral de origenes/delegaciones */}
          {!loading && selectedId && (
            <ul
              className='w-64 border-r-2 pl-4 pr-2 space-y-3 border-[#0560EA] overflow-y-auto'
              style={{
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
              }}
            >
              {listData.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleListClick(item.id)}
                  className={`
                  px-4 py-2 hover:bg-gray-100 hover:rounded-[10px] cursor-pointer text-sm flex items-center relative font-bold
                  ${
                    selectedId === item.id
                      ? 'rounded-[10px] text-white bg-gradient-to-r from-[#0560EA] via-[#FF9441]/95 to-[#FF9441]'
                      : ''
                  }
                `}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          )}
          {/* Grafico de barras */}
          {!loading && !trendData && graphData?.length > 0 && (
            <div
              className='flex flex-col w-full gap-3 pl-6 overflow-y-auto'
              style={{
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
              }}
            >
              {graphData?.map((item, index) => (
                <HorizontalBar
                  key={index}
                  leftLabel={item.label}
                  barWidth={item.percentage}
                  total={item.total}
                  onClick={() => handleBarClick(item.id)}
                />
              ))}
            </div>
          )}
          {!loading && !trendData && graphData?.length === 0 && (
            <p className='px-2'>No se encontraron datos.</p>
          )}

          {/* Bloque histórico */}
          {!loading && trendData && (
            <div className='p-4 w-full h-full'>
              {trendData.labels &&
                trendData.datasets &&
                trendData.datasets.length > 0 && (
                  <Line data={trendData} options={options} />
                )}
            </div>
          )}
        </div>
      </div>

      {/* BOTONES */}
      <div className='mt-10 flex justify-between'>
        {selectedId && <BackButton onClick={goBack} />}
        <div></div>
        {selectedId && !trendData && <HistoricButton onClick={goTrend} />}
      </div>
    </div>
  );
};

export default withAuth(EgresosPage);
