export type StatsType = {
  day: Date;
  //lunchOrders?: number | undefined;
  //dinnerOrders?: number | undefined;

 
  totalOrders?: number;
  
  //lunchHours?: number | undefined;
  //dinnerHours?: number | undefined;

   // ha senso totalHours?? sarebbe la somma delle ore lavorate da tutti, 
  //ma il turno ha un'ora fissa per tutti, 
  //forse ha senso fare una media?
  totalHours?: number;
  //lunchPay?: number | undefined;
  //dinnerPay?: number | undefined;
  totalPay?: number;
  //lunchTip?: number | undefined;
  //dinnerTip?: number | undefined;
  totalTip?: number | undefined;
  totalMoney?: number;
};
