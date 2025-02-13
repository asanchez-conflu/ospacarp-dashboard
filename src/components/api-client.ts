import axios from 'axios';

// Poner fechas dinamicas
const endpoints = {
  totals:
    'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/affiliates/totals?Clientappid=21&Excludeorigins=3,7,13&Period=202501',
  origin: {
    all: 'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/affiliates/distribution/origin?Clientappid=21&Period=202405',
    specific:
      'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/affiliates/distribution/origin?Clientappid=21&Period=202501&Delegation=:originId',
  },
  delegations: {
    all: 'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/affiliates/distribution/delegation?Clientappid=21&Period=202405',
    specific:
      'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/affiliates/distribution/delegation?Clientappid=21&Period=202501&Origin=:delegationId',
  },
  trendsOrigin:
    'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/affiliates/trends/origin?Clientappid=21&Startperiod=202402&Endperiod=202501&Origin=:id',
  trendsDelegation:
    'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/affiliates/trends/delegation?Clientappid=21&Startperiod=202402&Endperiod=202501&Delegation=:id',
};

const expensesEndpoints = {
  origin: {
    all: 'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/expenses/origins?Clientappid=21&Period=202501',
    specific:
      'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/expenses/origins?Clientappid=21&Period=202501&Delegation=:originId',
  },
  delegations: {
    all: 'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/expenses/delegations?Clientappid=21&Period=202501',
    specific:
      'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/expenses/delegations?Clientappid=21&Period=202501&Origin=:delegationId',
  },
  historyOrigin:
    'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/expenses/history/origin?Clientappid=21&Origin=:id&Startperiod=202402&Endperiod=202501',
  historyDelegation:
    'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/expenses/history/delegation?Clientappid=21&Origin=:id&Startperiod=202402&Endperiod=202501',
};

const handleApiError = (error: unknown) => {
  console.error('API Error:', error);

  let errorMessage = 'Ocurrió un error.';

  if (axios.isAxiosError(error)) {
    // More specific error handling for Axios errors
    errorMessage =
      error.response?.data?.message || error.message || errorMessage; // Customize error message if available
    console.error('Error data:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Error headers:', error.response?.headers);
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  // Re-throw the error so the component can handle it
  throw new Error(errorMessage);
};

// Function to fetch totals
export const getTotals = async () => {
  try {
    const token = localStorage.getItem('jwt');
    const response = await axios.get(endpoints.totals, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to fetch origin and delegations
export const fetchAffiliates = async (
  filterType: 'origin' | 'delegations',
  id: string | null = null
) => {
  try {
    console.log('> Fetching ID: ', id);
    console.log('> Fetching type: ', filterType);

    const token = localStorage.getItem('jwt');
    let endpoint = '';

    if (filterType === 'origin') {
      endpoint = id
        ? endpoints.delegations.specific.replace(':delegationId', id)
        : endpoints.origin.all;
    } else if (filterType === 'delegations') {
      endpoint = id
        ? endpoints.origin.specific.replace(':originId', id)
        : endpoints.delegations.all;
    }

    console.log('> Endpoint: ');
    console.log(endpoint);

    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Fetch Affiliates Trends
export const fetchTrendsData = async (
  filterType: 'origin' | 'delegations',
  id: string
) => {
  try {
    console.log('> Fetching Trends ID: ', id);
    console.log('> Fetching Trends type: ', filterType);

    const token = localStorage.getItem('jwt');
    let endpoint = '';

    if (filterType === 'origin') {
      endpoint = endpoints.trendsOrigin.replace(':id', id);
    } else if (filterType === 'delegations') {
      endpoint = endpoints.trendsDelegation.replace(':id', id);
    } else {
      throw new Error('Invalid type provided');
    }

    console.log('> Endpoint: ');
    console.log(endpoint);

    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Expenses endpoints

// Function to fetch origin and delegations
export const fetchExpenses = async (
  filterType: 'origin' | 'delegations',
  id: string | null = null
) => {
  try {
    console.log('> Fetching exp ID: ', id);
    console.log('> Fetching exp type: ', filterType);

    const token = localStorage.getItem('jwt');
    let endpoint = '';

    if (filterType === 'origin') {
      endpoint = id
        ? expensesEndpoints.delegations.specific.replace(':delegationId', id)
        : expensesEndpoints.origin.all;
    } else if (filterType === 'delegations') {
      endpoint = id
        ? expensesEndpoints.origin.specific.replace(':originId', id)
        : expensesEndpoints.delegations.all;
    }

    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchExpensesHistoricData = async (
  filterType: 'origin' | 'delegations',
  id: string
) => {
  try {
    console.log('> Fetching historic ID: ', id);
    console.log('> Fetching historic type: ', filterType);

    const token = localStorage.getItem('jwt');
    let endpoint = '';

    if (filterType === 'origin') {
      endpoint = expensesEndpoints.historyOrigin.replace(':id', id);
    } else if (filterType === 'delegations') {
      endpoint = expensesEndpoints.historyDelegation.replace(':id', id);
    } else {
      throw new Error('Invalid type provided');
    }

    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
