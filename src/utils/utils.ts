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
