interface Delegation {
  count: string;
  delegation: number;
  delegationDesc: string;
  percentage: number;
}

interface Origin {
  count: string;
  origin: number;
  originDesc: string;
  percentage: number;
}

interface ExpensesOrigin {
  total: string;
  origin: number;
  description: string;
  percentage: number;
}

interface ExpensesDelegation {
  total: string;
  delegation: number;
  description: string;
  percentage: number;
}

interface DataItem {
  label: string;
  percentage: string;
  id: string;
  total: string;
}

interface TrendItem {
  count: string;
  month: string;
  monthName: string;
  percentage: string;
}

interface HistoryExpensesItem {
  expenses: string;
  month: string;
  monthName: string;
  percentage: string;
}

interface HistoryIncomeItem {
  income: string;
  month: string;
  monthName: string;
  percentage: string;
}

export {
  Delegation,
  Origin,
  DataItem,
  TrendItem,
  ExpensesOrigin,
  ExpensesDelegation,
  HistoryExpensesItem,
  HistoryIncomeItem,
};
