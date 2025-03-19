import { getMonth } from '@/utils/utils';
import React from 'react';

interface AffiliatesProps {
  affiliates: string;
}

const CardAfiliados: React.FC<AffiliatesProps> = ({ affiliates }) => {
  return (
    <div className='h-[50px] w-1/2 bg-[#0560EA] text-white rounded-lg p-2 flex justify-between items-center'>
      <div>
        <h2 className='font-semibold leading-5'>Afiliados</h2>
        <p className='text-xs'>Mes de {getMonth(0)}</p>
      </div>
      <div className='text-2xl font-bold font-[Poppins]'>{affiliates}</div>
    </div>
  );
};

export default CardAfiliados;
