import React from 'react';

const CardAfiliados = () => {
  return (
    <div className='w-1/2 bg-blue-500 text-white rounded-lg p-4 flex justify-between items-center'>
      <div>
        <h2 className='text-lg font-semibold'>Afiliados</h2>
        <p className='text-sm'>Valores acumulados</p>
      </div>
      <div className='text-2xl font-bold'>88.053</div>
    </div>
  );
};

export default CardAfiliados;
