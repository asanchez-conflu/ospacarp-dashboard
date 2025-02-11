import React from 'react';

interface AffiliatesProps {
  affiliates: string;
}

const CardOtros: React.FC<AffiliatesProps> = ({ affiliates }) => {
  return (
    <div className='w-1/2 bg-white rounded-lg p-4 flex justify-between items-center'>
      <div>
        <h2 className='text-lg font-semibold'>Otros</h2>
        <p className='text-sm'>Osde Genuino - Visitar - Tercerizado</p>
      </div>
      <div className='text-2xl font-bold'>{affiliates}</div>
    </div>
  );
};

export default CardOtros;
