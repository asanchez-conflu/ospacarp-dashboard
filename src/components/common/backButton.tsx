import React from 'react';
import { MdOutlineArrowCircleLeft } from 'react-icons/md';

const BackButton = ({ onClick = () => {} }: { onClick?: () => void }) => {
  return (
    <button
      onClick={onClick}
      className='bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full inline-flex items-center'
    >
      <MdOutlineArrowCircleLeft className='mr-2 text-2xl' />
      Gráfico General
    </button>
  );
};

export default BackButton;
