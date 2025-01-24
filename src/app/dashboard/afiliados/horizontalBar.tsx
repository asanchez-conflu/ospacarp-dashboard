import React from 'react';

interface Props {
  leftLabel: string;
  barWidth: number;
}

const HorizontalBar: React.FC<Props> = ({ leftLabel, barWidth }) => {
  return (
    <div className='relative w-full'>
      <div
        className={`h-8 bg-gradient-to-l from-blue-500 to-cyan-300 rounded-lg flex items-center justify-start`}
        style={{ width: `${barWidth}%` }}
      >
        <span className='text-xs text-white px-2'>{leftLabel}</span>
      </div>
      <span
        className={`absolute top-1/2 -translate-y-1/2 right-0 text-xs text-gray-500 px-2`}
      >
        {barWidth}%
      </span>
    </div>
  );
};

export default HorizontalBar;
