import React from 'react';

interface Props {
  leftLabel: string;
  barWidth: number;
  onClick: () => void;
}

const HorizontalBar: React.FC<Props> = ({
  leftLabel,
  barWidth,
  onClick,
}: Props) => {
  return (
    <div className='relative w-full min-h-8 cursor-pointer' onClick={onClick}>
      <div className='bg-gradient-to-r from-[#0560EA] via-[#FF9441]/95 to-[#FF9441] w-full h-8 rounded-lg absolute top-0 right-px' />
      <div
        className='bg-gray-300 w-full h-8 rounded-r-lg absolute top-0 right-0 max-w-[99%]'
        style={{ width: `calc(100% - ${barWidth}%)` }}
      />
      <span className='text-sm font-bold text-white px-2 absolute top-1/2 -translate-y-1/2 left-2'>
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
