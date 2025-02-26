import { formatNumberWithDots, formatNumberWithSuffix } from '@/utils/utils';
import { MdTrendingUp } from 'react-icons/md';

interface IncomesCardProps {
  month: string;
  current: string;
  previous: string;
}

const IncomesCard: React.FC<IncomesCardProps> = ({
  month,
  current,
  previous,
}) => {
  const monthOnly = month.split(' ')[0];

  return (
    <div className='bg-[#0560EA] text-white rounded-lg p-2 w-full h-[140px] flex flex-col justify-between'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold'>Ingresos</h3>
        <MdTrendingUp className='text-2xl ml-2' />
      </div>
      <div>
        <p className='text-xs'>Mes de {monthOnly}</p>
      </div>
      <div className='flex-grow text-right font-[Poppins] flex flex-col justify-end'>
        <p className='text-3xl font-bold'>{formatNumberWithSuffix(current)}</p>
        <p className='text-sm font-bold'>{formatNumberWithDots(previous)}</p>
      </div>
    </div>
  );
};

export default IncomesCard;
