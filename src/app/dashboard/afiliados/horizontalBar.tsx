import React from 'react';

interface Props {
  leftLabel: string;
  barWidth: number;
}

const HorizontalBar: React.FC<Props> = ({ leftLabel, barWidth }) => {
  return (
    <div className='relative w-full h-8'>
      <div className='bg-gradient-to-l from-[#0560EA] to-[#56CFE1] w-full h-full rounded-lg absolute top-0 right-px' />
      <div
        className='bg-gray-300 w-full h-full rounded-r-lg absolute top-0 right-0 max-w-[99%]'
        style={{ width: `calc(100% - ${barWidth}%)` }}
      />
      <span className='text-sm font-bold text-[#0560EA] px-2 absolute top-1/2 -translate-y-1/2 left-2'>
        {leftLabel}
      </span>

      <span
        className={`absolute top-1/2 -translate-y-1/2 right-0 text-sm text-gray-800 px-2`}
      >
        {barWidth}%
      </span>
    </div>
  );
};

export default HorizontalBar;
