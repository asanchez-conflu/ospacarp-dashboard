/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useEffect, useState } from 'react';
import CardAfiliados from './cardAfiliados';
import CardOtros from './cardOtros';
import axios from 'axios';
import HorizontalBar from './horizontalBar';
import { MdFavorite } from 'react-icons/md';
import { MdTune } from 'react-icons/md';
import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react';
interface Affiliates {
  total: string;
  totalExcludes: string;
  totalMembers: string;
}

interface Delegation {
  count: string;
  delegation: number;
  delegationDesc: string;
  percentage: number;
}

interface Origin {
  count: string;
  origin: number;
  originDesc: string;
  percentage: number;
}

interface DataItem {
  label: string;
  percentage: number;
  id: number;
}

export default function AfiliadosPage() {
  const [affiliatesCount, setAffiliatesCount] = useState('0');
  const [othersCount, setOthersCount] = useState('0');
  const [filterType, setFilterType] = useState<'origin' | 'delegations'>(
    'origin'
  );

  const [graphData, setGraphData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);

  /*
    const [error, setError] = useState<string | null>(null);
  */

  const endpoints = {
    totals:
      'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/affiliates/totals?Clientappid=21&Excludeorigins=3,7,17&Period=202501',
    origin: {
      all: 'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/affiliates/distribution/origin?Clientappid=21&Period=202405',
      specific:
        'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/affiliates/distribution/origin?Clientappid=21&Period=202501&Delegation=:originId',
    },
    delegations: {
      all: 'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/affiliates/distribution/delegation?Clientappid=21&Period=202405',
      specific:
        'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/affiliates/distribution/delegation?Clientappid=21&Period=202501&Origin=:delegationId',
    },
  };

  // Deshabilitar boton cuando esta cargando
  const handleFilterSelect = (type: 'origin' | 'delegations') => {
    setFilterType(type);
    console.log('Filtered by ', type);
  };

  const handleBarClick = (id: number) => {
    // Function now takes an ID
    console.log(`Bar with ID ${id} clicked!`);
    fetchData(id);
  };

  // Error handling with try catch finally (loading) poner loading true aca
  const fetchData = async (id = null) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt');

      // segun filter type consulto
      let endpoint = '';

      console.log('ID: ', id);
      console.log('filter: ', filterType);

      if (filterType === 'origin') {
        endpoint = id
          ? endpoints.delegations.specific.replace(':delegationId', id)
          : endpoints.origin.all;
      } else if (filterType === 'delegations') {
        endpoint = id
          ? endpoints.origin.specific.replace(':originId', id)
          : endpoints.delegations.all;
      }

      console.log(endpoint);

      const [affiliatesResponse, dataResponse] = await Promise.all([
        axios.get<Affiliates>(endpoints.totals, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      // Afiliados = totalExcludes
      // Otros = totalMembers
      setAffiliatesCount(affiliatesResponse.data.totalExcludes);
      setOthersCount(affiliatesResponse.data.totalMembers);

      console.log('delegationsResponse: ', dataResponse.data);

      // segun filtro delegations o origins
      // el label tambien segun filtro

      const data = dataResponse.data;
      let processedData: DataItem[] = [];

      if (!data) {
        console.warn('No delegations data received');
        return; // Exit early if no delegations data
      }

      let type = '';

      if (filterType === 'origin' && id === null) {
        type = 'origin';
      } else if (filterType === 'delegations' && id) {
        type = 'origin';
      } else {
        type = 'delegations';
      }

      console.log('TYPE: ', type);

      if (type === 'origin') {
        console.log('origines', data.origins);

        if (!data.origins) {
          console.log('no data');
          setGraphData([]);
          return;
        }

        const totalCount = data.origins.reduce(
          (acc: number, origin: Origin) => acc + parseInt(origin.count),
          0
        );

        processedData = data.origins.map((origin: Origin) => {
          const percentage = (parseFloat(origin.count) / totalCount) * 100;

          // Type conversion and creation of DataItem object
          const dataItem: DataItem = {
            label: origin.originDesc,
            percentage: parseFloat(percentage.toFixed(2)), // Parse to number
            id: origin.origin,
          };
          return dataItem;
        });
      } else {
        // process delegations
        console.log('delegaciones', data.delegations);

        if (!data.delegations) {
          console.log('no data');
          setGraphData([]);
          return;
        }

        const totalCount = data.delegations.reduce(
          (acc: number, delegation: Delegation) =>
            acc + parseInt(delegation.count),
          0
        );

        processedData = data.delegations.map((delegation: Delegation) => {
          const percentage = (parseFloat(delegation.count) / totalCount) * 100;
          return { ...delegation, percentage: percentage.toFixed(2) }; // Add percentage property
        });

        processedData = data.delegations.map((delegation: Delegation) => {
          const percentage = (parseFloat(delegation.count) / totalCount) * 100;

          // Type conversion and creation of DataItem object
          const dataItem: DataItem = {
            label: delegation.delegationDesc,
            percentage: parseFloat(percentage.toFixed(2)), // Parse to number
            id: delegation.delegation,
          };
          return dataItem;
        });
      }

      setGraphData(processedData);
      console.log('processedData', processedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [filterType]);

  return (
    <div>
      <div className='my-6 flex flex-col items-center'>
        <MdFavorite size={30} color='#56CFE1' />
      </div>
      <hr className='border-gray-200 mx-10' />

      <div className='m-10'>
        <h2 className='font-bold text-4xl'>Panel gráfico de Afiliados</h2>
        <p className='font-bold text-xl'>
          Gráficos de distribución de padrón de Afiliados.
        </p>
      </div>

      <div className='flex m-10 gap-5'>
        <CardAfiliados affiliates={affiliatesCount} />
        <CardOtros affiliates={othersCount} />
      </div>

      <div className='m-10 py-5 bg-white rounded'>
        <div className='px-7 pt-4 pb-2 relative'>
          <h3 className='font-bold'>
            Distribución de padrón por{' '}
            {filterType === 'origin' ? 'orígenes' : 'delegaciones'} de Afiliado
          </h3>
          <p className='text-sm'>Valores acumulados</p>

          <Popover>
            <PopoverButton className='absolute top-4 right-7 p-2 bg-white rounded-md shadow-md hover:bg-gray-100 active:bg-gray-200 active:scale-95 transition-all duration-75'>
              <MdTune size={20} color='black' />
            </PopoverButton>
            <PopoverPanel className='absolute right-7 top-12 w-48 bg-white rounded-md shadow-lg z-10'>
              <div className='p-2'>
                <PopoverGroup>
                  <PopoverButton
                    as='button'
                    className='block px-4 py-2 w-full text-left text-sm text-gray-700 hover:bg-gray-200 rounded-md'
                    onClick={() => handleFilterSelect('origin')}
                  >
                    Origen
                  </PopoverButton>
                  <PopoverButton
                    as='button'
                    className='block px-4 py-2 w-full text-left text-sm text-gray-700 hover:bg-gray-200 rounded-md'
                    onClick={() => handleFilterSelect('delegations')}
                  >
                    Delegación
                  </PopoverButton>
                </PopoverGroup>
              </div>
            </PopoverPanel>
          </Popover>
        </div>
        <div className='flex flex-col p-5 gap-3 relative'>
          {loading === true && (
            <p className='px-2'>
              Cargando {filterType === 'origin' ? 'orígenes' : 'delegaciones'}
              ...
            </p>
          )}

          {!loading && graphData?.length > 0 && (
            <>
              <span className='absolute top-0 right-5 text-xs text-gray-500'>
                Porcentaje
              </span>
              {graphData?.map((item, index) => (
                <HorizontalBar
                  key={index}
                  leftLabel={item.label}
                  barWidth={item.percentage}
                  onClick={() => handleBarClick(item.id)}
                />
              ))}
            </>
          )}

          {!loading && graphData?.length === 0 && (
            <p className='px-2'>
              No se encontraron datos de{' '}
              {filterType === 'origin' ? 'orígenes' : 'delegaciones'}.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
