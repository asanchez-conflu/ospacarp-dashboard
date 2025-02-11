import React from 'react';
import { MdOutlineArrowCircleRight } from 'react-icons/md';

const HistoricButton = ({ onClick = () => {} }: { onClick?: () => void }) => {
  return (
    <button
      onClick={onClick}
      className='bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full inline-flex items-center'
    >
      Gráfico Histórico
      <MdOutlineArrowCircleRight className='ml-2 text-2xl' />
    </button>
  );
};

export default HistoricButton;
