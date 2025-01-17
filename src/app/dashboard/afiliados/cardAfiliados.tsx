import React from 'react';

interface AffiliatesProps {
  affiliates: string; // or the appropriate type for your affiliates data
}

const CardAfiliados: React.FC<AffiliatesProps> = ({ affiliates }) => {
  return (
    <div className='w-1/2 bg-blue-500 text-white rounded-lg p-4 flex justify-between items-center'>
      <div>
        <h2 className='text-lg font-semibold'>Afiliados</h2>
        <p className='text-sm'>Valores acumulados</p>
      </div>
      <div className='text-2xl font-bold'>{affiliates}</div>
    </div>
  );
};

export default CardAfiliados;
