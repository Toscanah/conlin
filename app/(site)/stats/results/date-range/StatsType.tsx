export type StatsType = {
  riderName: string;
  lunchOrders?: number | undefined;
  dinnerOrders?: number | undefined;
  totalOrders?: number;
  lunchHours?: number | undefined;
  dinnerHours?: number | undefined;
  totalHours?: number;
  lunchPay?: number | undefined;
  dinnerPay?: number | undefined;
  totalPay?: number;
  lunchTip?: number | undefined;
  dinnerTip?: number | undefined;
  totalTip?: number | undefined;
  totalMoney?: number;
};
