import { formatNumberWithDots, formatNumberWithSuffix } from '@/utils/utils';
import { MdTrendingUp } from 'react-icons/md';

interface IncomesCardProps {
  month: string;
  amount: string;
}

const IncomesCard: React.FC<IncomesCardProps> = ({ month, amount }) => {
  return (
    <div className='bg-[#0560EA] text-white rounded-lg shadow-md p-3 w-full h-[140px] flex flex-col justify-between'>
      <div className='flex items-center justify-between'>
        <h3 className='text-xl font-semibold'>Ingresos</h3>
        <MdTrendingUp className='text-2xl ml-2' />
      </div>
      <div>
        <p className='text-sm'>{month}</p>
      </div>
      <div className='mt-4 text-right'>
        <p className='text-2xl font-bold'>{formatNumberWithSuffix(amount)}</p>
        <p className='text-sm'>{formatNumberWithDots(amount)}</p>
      </div>
    </div>
  );
};

export default IncomesCard;
