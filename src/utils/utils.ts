import { User } from '@/app/types/dashboard';

// Format $999.999.999
export const formatCurrency = (amount: number | string): string => {
  // Convert to number if it's a string
  const num = typeof amount === 'string' ? Number(amount) : amount;

  // Handle the case where the input is not a valid number
  if (isNaN(num)) {
    return 'Invalid input'; // Or throw an error, or return a default value like "$0"
  }

  const formatted = new Intl.NumberFormat('es-AR', {
    // Use 'es-AR' for Argentine Peso formatting
    style: 'currency',
    currency: 'ARS', // Specify the currency (Argentine Peso)
    minimumFractionDigits: 0, // No decimal places for whole numbers
    maximumFractionDigits: 0, // No decimal places for whole numbers
  }).format(num);

  return formatted;
};

// Format 123.123.123
export const formatNumberWithDots = (amount: number | string): string => {
  const num = typeof amount === 'string' ? Number(amount) : amount;

  if (isNaN(num)) {
    return 'Invalid input';
  }

  const formatted = new Intl.NumberFormat('es-AR').format(num); // No currency options

  return formatted;
};

// Format 2.9MM
export const formatNumberWithSuffix = (amount: number | string): string => {
  const num = typeof amount === 'string' ? Number(amount) : amount;

  if (isNaN(num)) {
    return 'Invalid input';
  }

  const absNum = Math.abs(num); // Handle negative numbers correctly

  if (absNum >= 1e9) {
    return `${(num / 1e9).toFixed(1)}B`;
  } else if (absNum >= 1e6) {
    return `${(num / 1e6).toFixed(1)}M`;
  } else if (absNum >= 1e3) {
    return `${(num / 1e3).toFixed(1)}K`;
  } else {
    return num.toString();
  }
};

// Returns last 4 months in format { month: 'Diciembre 2024', period: '202412' }
export const getPastMonths = (numMonths: number) => {
  const months = [];
  const today = new Date();

  for (let i = 2; i < 2 + numMonths; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);

    const formattedDate = date.toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });

    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    const period = `${year}${formattedMonth}`;

    months.push({
      month: formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1),
      period: period,
    });
  }

  return months.reverse();
};

export type Period = string;

export const getPeriod = (monthsToSubtract: number = 2): Period => {
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1 - monthsToSubtract; // Months are 0-indexed

  if (month <= 0) {
    month = 12 + month; // Adjust for previous year
    year--;
  }

  const formattedMonth = month < 10 ? `0${month}` : `${month}`;

  return `${year}${formattedMonth}`;
};

export const getMonthFormatted = (monthsToSubtract: number = 2): string => {
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1 - monthsToSubtract;

  if (month <= 0) {
    month = 12 + month;
    year--;
  }

  const dateToFormat = new Date(year, month - 1, 1);
  let formattedMonth = dateToFormat.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  formattedMonth = formattedMonth.replace(/^\w/, (c) => c.toUpperCase());

  return formattedMonth;
};

export const getMonth = (monthsToSubtract: number = 2): string => {
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1 - monthsToSubtract;

  if (month <= 0) {
    month = 12 + month;
    year--;
  }

  const dateToFormat = new Date(year, month - 1, 1);
  let formattedMonth = dateToFormat.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  formattedMonth = formattedMonth.replace(/^\w/, (c) => c.toUpperCase());
  const monthOnly = formattedMonth.split(' ')[0];

  return monthOnly;
};

export const getInitials = (user: User): string => {
  if (!user || !user.UserFirstName || !user.UserLastName) {
    return ''; // Handle cases where user or names are missing
  }

  const firstNameInitial = user.UserFirstName.charAt(0).toUpperCase();
  const lastNameInitial = user.UserLastName.charAt(0).toUpperCase();

  return `${firstNameInitial}${lastNameInitial}`;
};

export const toTitleCase = (str: string): string => {
  if (!str) {
    return '';
  }

  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
