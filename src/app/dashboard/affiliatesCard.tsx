import { formatNumberWithDots, getMonth } from '@/utils/utils';
import { MdPeople } from 'react-icons/md';

interface AffiliatesCardProps {
  amount: string;
}

const AffiliatesCard: React.FC<AffiliatesCardProps> = ({ amount }) => {
  return (
    <div className='bg-white rounded-lg p-2 w-full h-[140px] flex flex-col justify-between'>
      <div className='flex items-center justify-between'>
        <h3 className='text-xl font-semibold'>Afiliados</h3>
        <MdPeople className='text-2xl ml-2' />
      </div>
      <div>
        <p className='text-xs'>Mes de {getMonth(0)}</p>
      </div>
      <div className='flex-grow text-right font-[Poppins] flex flex-col justify-end'>
        <p className='text-2xl font-bold'>{formatNumberWithDots(amount)}</p>
      </div>
    </div>
  );
};

export default AffiliatesCard;
