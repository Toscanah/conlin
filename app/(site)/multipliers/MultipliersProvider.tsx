"use client";

import { createContext, useContext, useState } from "react";

export const MultiplierContext = createContext({
  lunchMultiplier: 6,
  dinnerMultiplier: 7,
  ordersMultiplier: 1,
  setLunchMultiplier: (multiplier: number) => {},
  setDinnerMultiplier: (multiplier: number) => {},
  setOrdersMultiplier: (multiplier: number) => {},
});

export function MultiplierProvider({ children }: { children: any }) {
  const [lunchMultiplier, setLunchMultiplier] = useState(6);
  const [dinnerMultiplier, setDinnerMultiplier] = useState(7);
  const [ordersMultiplier, setOrdersMultiplier] = useState(1);

  return (
    <MultiplierContext.Provider
      value={{
        lunchMultiplier,
        dinnerMultiplier,
        ordersMultiplier,
        setLunchMultiplier,
        setDinnerMultiplier,
        setOrdersMultiplier,
      }}
    >
      {children}
    </MultiplierContext.Provider>
  );
}

export default MultiplierProvider;
