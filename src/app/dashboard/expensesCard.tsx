import { MdTrendingDown } from 'react-icons/md';

interface ExpensesCardProps {
  month: string;
  amount: string;
}

const ExpensesCard: React.FC<ExpensesCardProps> = ({ month, amount }) => {
  const formattedAmount = formatNumberWithLetters(amount); // Format amount

  return (
    <div className='bg-white rounded-lg shadow-md p-6 w-full'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-xl font-semibold'>Egresos</h3>
          <p className='text-gray-500 text-sm'>{month}</p>
        </div>
        <MdTrendingDown className='text-2xl' />
      </div>
      <div className='mt-4'>
        <p className='text-2xl font-bold'>{formattedAmount}</p>{' '}
        {/* Use formatted amount */}
        <p className='text-gray-500 text-sm'>{amount}</p>{' '}
        {/* Detail (hardcoded for now) */}
      </div>
    </div>
  );
};

function formatNumberWithLetters(amount: string): string {
  let num = parseFloat(amount); // Parse to a number, use let for reassignment

  if (isNaN(num)) {
    return 'Invalid Number';
  }

  const absNum = Math.abs(num);
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  let i = 0;

  while (absNum >= 1000 && i < suffixes.length - 1) {
    num /= 1000; // Now num can be reassigned
    i++;
  }

  const formatted = num.toFixed(1).replace(/\.0$/, '');
  return formatted + suffixes[i];
}

export default ExpensesCard;
