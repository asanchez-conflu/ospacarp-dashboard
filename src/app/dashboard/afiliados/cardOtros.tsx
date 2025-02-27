import React from 'react';

interface AffiliatesProps {
  affiliates: string;
}

const CardOtros: React.FC<AffiliatesProps> = ({ affiliates }) => {
  return (
    <div className='h-[50px] w-1/2 bg-white rounded-lg p-2 flex justify-between items-center'>
      <div>
        <h2 className='font-semibold leading-5'>Otros</h2>
        <p className='text-xs'>Osde Genuino - Visitar - Tercerizado</p>
      </div>
      <div className='text-2xl font-bold font-[Poppins]'>{affiliates}</div>
    </div>
  );
};

export default CardOtros;
