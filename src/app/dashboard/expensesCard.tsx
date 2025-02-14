import { formatNumberWithDots, formatNumberWithSuffix } from '@/utils/utils';
import { MdTrendingDown } from 'react-icons/md';

interface ExpensesCardProps {
  month: string;
  amount: string;
}

const ExpensesCard: React.FC<ExpensesCardProps> = ({ month, amount }) => {
  return (
    <div className='bg-white rounded-lg shadow-md p-3 w-full h-[140px] flex flex-col justify-between'>
      <div className='flex items-center justify-between'>
        <h3 className='text-xl font-semibold'>Egresos</h3>
        <MdTrendingDown className='text-2xl ml-2' />
      </div>
      <div>
        <p className='text-gray-500 text-sm'>{month}</p>
      </div>
      <div className='mt-4 text-right'>
        <p className='text-2xl font-bold'>{formatNumberWithSuffix(amount)}</p>
        <p className='text-gray-500 text-sm'>{formatNumberWithDots(amount)}</p>
      </div>
    </div>
  );
};

export default ExpensesCard;
