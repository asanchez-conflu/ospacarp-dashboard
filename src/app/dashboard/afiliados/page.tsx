import React from 'react';
import { HorizontalChart } from './barChart';
import CardAfiliados from './cardAfiliados';
import CardOtros from './cardOtros';

export default function AfiliadosPage() {
  return (
    <div>
      <div className=' m-10'>
        <h2 className='font-bold	text-4xl'>Panel gráfico de Afiliados</h2>
        <p className='font-bold text-xl'>
          Gráficos de distriución de padrón de Afiliados.
        </p>
      </div>

      <div className='flex m-10 gap-5'>
        <CardAfiliados />
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
