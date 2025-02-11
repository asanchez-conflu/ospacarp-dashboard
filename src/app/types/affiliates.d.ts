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

interface DataItem {
  label: string;
  percentage: number;
  id: string;
}

interface TrendItem {
  count: string;
  month: string;
  monthName: string;
  percentage: string;
}

export { Delegation, Origin, DataItem, TrendItem };
