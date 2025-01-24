import React from 'react';
import { HorizontalChart } from '../afiliados/barChart';

export default function EgresosPage() {
  return (
    <div>
      <h1>Egresos</h1>
      {/* Add your income page content here */}
      {/* For example: */}
      <p>This is the Egresos page.</p>
      {/* You can add components for displaying income data, charts, etc. */}
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
