import { formatNumberWithDots, formatNumberWithSuffix } from '@/utils/utils';
import { MdTrendingDown } from 'react-icons/md';

interface ExpensesCardProps {
  month: string;
  current: string;
  previous: string;
}

const ExpensesCard: React.FC<ExpensesCardProps> = ({
  month,
  current,
  previous,
}) => {
  const monthOnly = month.split(' ')[0];

  return (
    <div className='bg-white rounded-lg p-2 w-full h-[140px] flex flex-col justify-between'>
      <div className='flex items-center justify-between'>
        <h3 className='text-xl font-semibold'>Egresos</h3>
        <MdTrendingDown className='text-2xl ml-2' />
      </div>
      <div>
        <p className='text-gray-500 text-xs'>Mes de {monthOnly}</p>
      </div>
      <div className='flex-grow text-right font-[Poppins] flex flex-col justify-end'>
        <p className='text-3xl font-bold'>{formatNumberWithSuffix(current)}</p>
        <p className='text-gray-500 font-bold text-sm'>
          {formatNumberWithDots(previous)}
        </p>
      </div>
    </div>
  );
};

export default ExpensesCard;
