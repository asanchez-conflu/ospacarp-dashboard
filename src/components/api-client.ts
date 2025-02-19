import axios from 'axios';

type Period = string;

export const endpoints = {
  totals: (period: Period): string =>
    `https://sisaludapi-prepro.confluenciait.com/ospacarpqa/affiliates/totals?Clientappid=21&Excludeorigins=3,7,13&Period=${period}`,
  origin: {
    all: (period: Period): string =>
      `https://sisaludapi-prepro.confluenciait.com/ospacarpqa/affiliates/distribution/origin?Clientappid=21&Period=${period}&Excludeorigins=3,7,13`,
    specific: (period: Period, originId: string): string =>
      `https://sisaludapi-prepro.confluenciait.com/ospacarpqa/affiliates/distribution/origin?Clientappid=21&Period=${period}&Delegation=${originId}&Excludeorigins=3,7,13`, // Corrected Delegation param
  },
  delegations: {
    all: (period: Period): string =>
      `https://sisaludapi-prepro.confluenciait.com/ospacarpqa/affiliates/distribution/delegation?Clientappid=21&Period=${period}&Excludeorigins=3,7,13`,
    specific: (period: Period, delegationId: string): string =>
      `https://sisaludapi-prepro.confluenciait.com/ospacarpqa/affiliates/distribution/delegation?Clientappid=21&Period=${period}&Origin=${delegationId}&Excludeorigins=3,7,13`, // Corrected Origin param
  },
  trendsOrigin: (startPeriod: Period, endPeriod: Period, id: string): string =>
    `https://sisaludapi-prepro.confluenciait.com/ospacarpqa/affiliates/trends/origin?Clientappid=21&Startperiod=${startPeriod}&Endperiod=${endPeriod}&Origin=${id}&Excludeorigins=3,7,13`,
  trendsDelegation: (
    startPeriod: Period,
    endPeriod: Period,
    id: string
  ): string =>
    `https://sisaludapi-prepro.confluenciait.com/ospacarpqa/affiliates/trends/delegation?Clientappid=21&Startperiod=${startPeriod}&Endperiod=${endPeriod}&Delegation=${id}&Excludeorigins=3,7,13`,
};

export const expensesEndpoints = {
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
    'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/expenses/history/delegation?Clientappid=21&Delegation=:id&Startperiod=202402&Endperiod=202501',
};

export const incomesEndpoints = {
  origin: {
    all: 'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/incomes/origins?Clientappid=21&Period=202501',
    specific:
      'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/incomes/origins?Clientappid=21&Period=202501&Delegation=:originId',
  },
  delegations: {
    all: 'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/incomes/delegations?Clientappid=21&Period=202501',
    specific:
      'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/incomes/delegations?Clientappid=21&Period=202501&Origin=:delegationId',
  },
  historyOrigin:
    'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/incomes/history/origin?Clientappid=21&Origin=:id&Startperiod=202402&Endperiod=202501',
  historyDelegation:
    'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/incomes/history/delegation?Clientappid=21&Delegation=:id&Startperiod=202402&Endperiod=202501',
};

export const homeEndpoints = {
  incomeVsExpense: (period: string): string =>
    `https://sisaludapi-prepro.confluenciait.com/ospacarpqa/overview/income-vs-expense?Period=${period}&Clientappid=21`,
  trends: (startPeriod: string, endPeriod: string): string =>
    `https://sisaludapi-prepro.confluenciait.com/ospacarpqa/overview/trends?Startperiod=${startPeriod}&Endperiod=${endPeriod}&Clientappid=21`,
  affiliates: (period: string): string =>
    `https://sisaludapi-prepro.confluenciait.com/ospacarpqa/overview/affiliates?Period=${period}&Clientappid=21&Excludeorigins=3,7,13`,
  totals: (period: string): string =>
    `https://sisaludapi-prepro.confluenciait.com/ospacarpqa/overview/total?Period=${period}&Clientappid=21`,
};

// &Excludeorigins=3,7,13

export const loginEndpoints = {
  userdata:
    'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/userdata/guid?Userid=:userid',
};

const getPeriod = (monthsToSubtract: number = 2): Period => {
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
    const period = getPeriod();
    const token = localStorage.getItem('jwt');
    const response = await axios.get(endpoints.totals(period), {
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
    const period = getPeriod();
    const token = localStorage.getItem('jwt');
    let endpoint: string = '';

    if (filterType === 'origin') {
      endpoint = id
        ? endpoints.delegations.specific(period, id)
        : endpoints.origin.all(period);
    } else if (filterType === 'delegations') {
      endpoint = id
        ? endpoints.origin.specific(period, id)
        : endpoints.delegations.all(period);
    } else {
      console.error('Invalid filterType:', filterType);
      throw new Error('Invalid filterType');
    }

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
    const token = localStorage.getItem('jwt');
    let endpoint: string = '';
    const endPeriod = getPeriod();
    const startPeriod = getPeriod(13);

    if (filterType === 'origin') {
      endpoint = endpoints.trendsOrigin(startPeriod, endPeriod, id);
    } else if (filterType === 'delegations') {
      endpoint = endpoints.trendsDelegation(startPeriod, endPeriod, id);
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

// Incomes endpoints

// Function to fetch origin and delegations
export const fetchIncomes = async (
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
        ? incomesEndpoints.delegations.specific.replace(':delegationId', id)
        : incomesEndpoints.origin.all;
    } else if (filterType === 'delegations') {
      endpoint = id
        ? incomesEndpoints.origin.specific.replace(':originId', id)
        : incomesEndpoints.delegations.all;
    }

    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchIncomesHistoricData = async (
  filterType: 'origin' | 'delegations',
  id: string
) => {
  try {
    console.log('> Fetching historic ID: ', id);
    console.log('> Fetching historic type: ', filterType);

    const token = localStorage.getItem('jwt');
    let endpoint = '';

    if (filterType === 'origin') {
      endpoint = incomesEndpoints.historyOrigin.replace(':id', id);
    } else if (filterType === 'delegations') {
      endpoint = incomesEndpoints.historyDelegation.replace(':id', id);
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

// Dashboard endpoints
export const fetchDashboardVS = async () => {
  try {
    const period = getPeriod();
    const token = localStorage.getItem('jwt');
    const url = homeEndpoints.incomeVsExpense(period); // Use typed endpoints
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchDashboardTotals = async () => {
  try {
    const period = getPeriod();
    const token = localStorage.getItem('jwt');
    const url = homeEndpoints.totals(period); // Use typed endpoints
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchDashboardTrends = async () => {
  try {
    const endPeriod = getPeriod();
    const startPeriod = getPeriod(13);
    const token = localStorage.getItem('jwt');
    const url = homeEndpoints.trends(startPeriod, endPeriod); // Use typed endpoints
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
