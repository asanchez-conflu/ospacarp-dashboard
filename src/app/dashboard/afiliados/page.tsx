'use client';
import React, { useEffect, useState } from 'react';
import { HorizontalChart } from './barChart';
import CardAfiliados from './cardAfiliados';
import CardOtros from './cardOtros';
import axios from 'axios';
import HorizontalBar from './horizontalBar';

interface Affiliates {
  total: string;
  totalExcludes: string;
  totalMembers: string;
}

export default function AfiliadosPage() {
  const endpoint =
    'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/affiliates/totals?Clientappid=21&Period=202408';

  const [affiliatesCount, setAffiliatesCount] = useState('0');

  useEffect(() => {
    const fetchAffiliates = async () => {
      try {
        const token = localStorage.getItem('jwt'); // Assuming you store the token in localStorage

        const response = await axios.get<Affiliates>(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAffiliatesCount(response.data.total);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching affiliates:', error);
        // Handle error gracefully, e.g., display an error message to the user
        // You might also want to redirect the user to a login page if the token is invalid
      }
    };

    fetchAffiliates();
  }, []);

  return (
    <div>
      <div className=' m-10'>
        <h2 className='font-bold	text-4xl'>Panel gráfico de Afiliados</h2>
        <p className='font-bold text-xl'>
          Gráficos de distribución de padrón de Afiliados.
        </p>
      </div>
      Gráfico
      <div className='flex m-10 gap-5'>
        <HorizontalBar leftLabel='Adherente' barWidth={50}></HorizontalBar>
      </div>
      <div className='flex m-10 gap-5'>
        <CardAfiliados affiliates={affiliatesCount} />
        <CardOtros />
      </div>
      <div className='m-10 py-5 px-4 bg-white rounded'>
        <h3 className='pl-4 font-bold'>
          Distribución de padrón por origen de Afiliado
        </h3>
        <p className='pl-4 text-sm'>Valores acumulados</p>
        <HorizontalChart />
      </div>
    </div>
  );
}
