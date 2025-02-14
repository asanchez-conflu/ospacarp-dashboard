interface CardData {
  currentExpense: string;
  currentIncome: string;
  previousExpense: string;
  previousIncome: string;
}

interface TotalsData {
  total: string;
  totalExcludes: string;
  totalMembers: string;
}

interface VersusData {
  expense: string;
  income: string;
}

interface TrendsData {
  // Define trends data structure later
  // Add properties as needed
  [key: string]: string; // Example: Allow any property for now
}

interface DashboardData {
  cards: CardData;
  totals: TotalsData;
  versus: VersusData;
  trends: TrendsData | null; // Trends can be null initially
}

export { DashboardData, VersusData, TrendsData, TotalsData, CardData };
