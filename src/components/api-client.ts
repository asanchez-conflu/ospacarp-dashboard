import { getPeriod } from '@/utils/utils';
import axios from 'axios';

type Period = string;

// const apiQA = 'https://api-prepro.ospatrones.sisaludevo1.com.ar/ospacarpqa';
const api = 'https://api.ospatrones.sisaludevo1.com.ar/ospacarp';

export const endpoints = {
  totals: (period: Period): string =>
    `${api}/affiliates/totals?Clientappid=21&Excludeorigins=3,7,13&Period=${period}`,
  origin: {
    all: (period: Period): string =>
      `${api}/affiliates/distribution/origin?Clientappid=21&Period=${period}&Excludeorigins=3,7,13`,
    specific: (period: Period, originId: string): string =>
      `${api}/affiliates/distribution/origin?Clientappid=21&Period=${period}&Delegation=${originId}&Excludeorigins=3,7,13`, // Corrected Delegation param
  },
  delegations: {
    all: (period: Period): string =>
      `${api}/affiliates/distribution/delegation?Clientappid=21&Period=${period}&Excludeorigins=3,7,13`,
    specific: (period: Period, delegationId: string): string =>
      `${api}/affiliates/distribution/delegation?Clientappid=21&Period=${period}&Origin=${delegationId}&Excludeorigins=3,7,13`, // Corrected Origin param
  },
  trendsOrigin: (startPeriod: Period, endPeriod: Period, id: string): string =>
    `${api}/affiliates/trends/origin?Clientappid=21&Startperiod=${startPeriod}&Endperiod=${endPeriod}&Origin=${id}&Excludeorigins=3,7,13`,
  trendsDelegation: (
    startPeriod: Period,
    endPeriod: Period,
    id: string
  ): string =>
    `${api}/affiliates/trends/delegation?Clientappid=21&Startperiod=${startPeriod}&Endperiod=${endPeriod}&Delegation=${id}&Excludeorigins=3,7,13`,
};

export const expensesEndpoints = {
  origin: {
    all: (period: Period): string =>
      `${api}/expenses/origins?Clientappid=21&Period=${period}`,
    specific: (period: Period, originId: string): string =>
      `${api}/expenses/origins?Clientappid=21&Period=${period}&Delegation=${originId}`,
  },
  delegations: {
    all: (period: Period): string =>
      `${api}/expenses/delegations?Clientappid=21&Period=${period}`,
    specific: (period: Period, delegationId: string): string =>
      `${api}/expenses/delegations?Clientappid=21&Period=${period}&Origin=${delegationId}`,
  },
  historyOrigin: (startPeriod: Period, endPeriod: Period, id: string): string =>
    `${api}/expenses/history/origin?Clientappid=21&Origin=${id}&Startperiod=${startPeriod}&Endperiod=${endPeriod}`,
  historyDelegation: (
    startPeriod: Period,
    endPeriod: Period,
    id: string
  ): string =>
    `${api}/expenses/history/delegation?Clientappid=21&Delegation=${id}&Startperiod=${startPeriod}&Endperiod=${endPeriod}`,
};

export const incomesEndpoints = {
  origin: {
    all: (period: Period): string =>
      `${api}/incomes/origins?Clientappid=21&Period=${period}`,
    specific: (period: Period, originId: string): string =>
      `${api}/incomes/origins?Clientappid=21&Period=${period}&Delegation=${originId}`,
  },
  delegations: {
    all: (period: Period): string =>
      `${api}/incomes/delegations?Clientappid=21&Period=${period}`,
    specific: (period: Period, delegationId: string): string =>
      `${api}/incomes/delegations?Clientappid=21&Period=${period}&Origin=${delegationId}`,
  },
  historyOrigin: (startPeriod: Period, endPeriod: Period, id: string): string =>
    `${api}/incomes/history/origin?Clientappid=21&Origin=${id}&Startperiod=${startPeriod}&Endperiod=${endPeriod}`,
  historyDelegation: (
    startPeriod: Period,
    endPeriod: Period,
    id: string
  ): string =>
    `${api}/incomes/history/delegation?Clientappid=21&Delegation=${id}&Startperiod=${startPeriod}&Endperiod=${endPeriod}`,
};

export const homeEndpoints = {
  incomeVsExpense: (period: string): string =>
    `${api}/overview/income-vs-expense?Period=${period}&Clientappid=21`,
  trends: (startPeriod: string, endPeriod: string): string =>
    `${api}/overview/trends?Startperiod=${startPeriod}&Endperiod=${endPeriod}&Clientappid=21`,
  affiliates: (period: string): string =>
    `${api}/overview/affiliates?Period=${period}&Clientappid=21&Excludeorigins=3,7,13`,
  totals: (period: string): string =>
    `${api}/overview/total?Period=${period}&Clientappid=21`,
};

// &Excludeorigins=3,7,13

export const loginEndpoints = {
  login: `${api}/oauth/gam/v2.0/access_token`,
  userData: (userId: string): string => `${api}/userdata/guid?Userid=${userId}`,
  userInfo: `${api}/oauth/userinfo`,
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
    const period = getPeriod(0); // Afiliados a mes actual
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
    const period = getPeriod(0);
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
    const token = localStorage.getItem('jwt');
    let endpoint: string = '';
    const period = getPeriod();

    if (filterType === 'origin') {
      endpoint = id
        ? expensesEndpoints.delegations.specific(period, id)
        : expensesEndpoints.origin.all(period);
    } else if (filterType === 'delegations') {
      endpoint = id
        ? expensesEndpoints.origin.specific(period, id)
        : expensesEndpoints.delegations.all(period);
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

export const fetchExpensesHistoricData = async (
  filterType: 'origin' | 'delegations',
  id: string
) => {
  try {
    let endpoint: string = '';
    const token = localStorage.getItem('jwt');
    const endPeriod = getPeriod();
    const startPeriod = getPeriod(13);

    if (filterType === 'origin') {
      endpoint = expensesEndpoints.historyOrigin(startPeriod, endPeriod, id);
    } else if (filterType === 'delegations') {
      endpoint = expensesEndpoints.historyDelegation(
        startPeriod,
        endPeriod,
        id
      );
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
    const period = getPeriod();
    const token = localStorage.getItem('jwt');
    let endpoint = '';

    if (filterType === 'origin') {
      endpoint = id
        ? incomesEndpoints.delegations.specific(period, id)
        : incomesEndpoints.origin.all(period);
    } else if (filterType === 'delegations') {
      endpoint = id
        ? incomesEndpoints.origin.specific(period, id)
        : incomesEndpoints.delegations.all(period);
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
    const token = localStorage.getItem('jwt');
    let endpoint = '';
    const endPeriod = getPeriod();
    const startPeriod = getPeriod(13);

    if (filterType === 'origin') {
      endpoint = incomesEndpoints.historyOrigin(startPeriod, endPeriod, id);
    } else if (filterType === 'delegations') {
      endpoint = incomesEndpoints.historyDelegation(startPeriod, endPeriod, id);
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
export const fetchDashboardVS = async (month?: string) => {
  try {
    const token = localStorage.getItem('jwt');
    let url: string;

    if (month) {
      url = homeEndpoints.incomeVsExpense(month); // Use the provided month
    } else {
      const period = getPeriod(); // Calculate period if month is not provided
      url = homeEndpoints.incomeVsExpense(period);
    }

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchDashboardTotals = async (month?: string) => {
  try {
    const token = localStorage.getItem('jwt');
    let url: string;

    if (month) {
      url = homeEndpoints.totals(month); // Use the provided month
    } else {
      const period = getPeriod(); // Calculate period if month is not provided
      url = homeEndpoints.totals(period);
    }

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
    const url = homeEndpoints.trends(startPeriod, endPeriod);
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Login calls
export const getUserData = async (userId: string) => {
  try {
    const token = localStorage.getItem('jwt');
    const response = await axios.get(loginEndpoints.userData(userId), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getUserInfo = async () => {
  try {
    const token = localStorage.getItem('jwt');
    const response = await axios.get(loginEndpoints.userInfo, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
