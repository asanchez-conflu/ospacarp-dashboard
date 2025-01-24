'use client';
import React, { useEffect, useState } from 'react';
import CardAfiliados from './cardAfiliados';
import CardOtros from './cardOtros';
import axios from 'axios';
import HorizontalBar from './horizontalBar';

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

export default function AfiliadosPage() {
  const endpointTotals =
    'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/affiliates/totals?Clientappid=21&Excludeorigins=3,7,17&Period=202501';

  const endpointDelegations =
    'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/affiliates/distribution/delegation?Clientappid=21&Period=202501&Origin=1';

  const [affiliatesCount, setAffiliatesCount] = useState('0');
  const [othersCount, setOthersCount] = useState('0');

  const [delegations, setDelegations] = useState<Delegation[] | null>(null); // Optional type for delegations

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('jwt');

      const [affiliatesResponse, delegationsResponse] = await Promise.all([
        axios.get<Affiliates>(endpointTotals, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(endpointDelegations, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      // Afiliados = totalExcludes
      // Otros = totalMembers

      setAffiliatesCount(affiliatesResponse.data.totalExcludes);
      setOthersCount(affiliatesResponse.data.totalMembers);

      // Process delegations data
      const delegations = delegationsResponse.data.delegations;
      if (!delegations) {
        console.warn('No delegations data received');
        return; // Exit early if no delegations data
      }

      const totalCount = delegations.reduce(
        (acc: number, delegation: Delegation) =>
          acc + parseInt(delegation.count),
        0
      );

      const processedDelegations = delegations.map((delegation: Delegation) => {
        const percentage = (parseFloat(delegation.count) / totalCount) * 100;
        return { ...delegation, percentage: percentage.toFixed(2) }; // Add percentage property
      });

      setDelegations(processedDelegations);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
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
        <div className='px-7 pt-4 pb-2'>
          <h3 className='font-bold'>
            Distribución de padrón por origen de Afiliado
          </h3>
          <p className='text-sm'>Valores acumulados</p>
        </div>

        <div className='flex flex-col p-5 gap-3 relative'>
          {delegations === null && <p>Cargando delegaciones...</p>}

          {delegations && delegations?.length > 0 && (
            <>
              <span className='absolute top-0 right-5 text-xs text-gray-500'>
                Porcentaje
              </span>
              {delegations?.map((item, index) => (
                <HorizontalBar
                  key={index}
                  leftLabel={item.delegationDesc}
                  barWidth={item.percentage}
                />
              ))}
            </>
          )}

          {delegations?.length === 0 && (
            <p>No se encontraron datos de delegaciones.</p>
          )}
        </div>
      </div>
    </div>
  );
}
