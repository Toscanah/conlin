"use client";

import { createContext, useEffect, useState } from "react";

export const ConlinContext = createContext({
  lunchMultiplier: 6,
  dinnerMultiplier: 7,
  ordersMultiplier: 1,
  isLogged: false,
  setLunchMultiplier: (multiplier: number) => {},
  setDinnerMultiplier: (multiplier: number) => {},
  setOrdersMultiplier: (multiplier: number) => {},
  setIsLogged: (logged: boolean) => {},
});

export function ConlinProvider({ children }: { children: any }) {
  const [lunchMultiplier, setLunchMultiplier] = useState(() => {
    const savedValue = localStorage.getItem("lunchMultiplier");
    return savedValue !== null ? JSON.parse(savedValue) : 6;
  });
  const [dinnerMultiplier, setDinnerMultiplier] = useState(() => {
    const savedValue = localStorage.getItem("dinnerMultiplier");
    return savedValue !== null ? JSON.parse(savedValue) : 7;
  });
  const [ordersMultiplier, setOrdersMultiplier] = useState(() => {
    const savedValue = localStorage.getItem("ordersMultiplier");
    return savedValue !== null ? JSON.parse(savedValue) : 1;
  });
  const [isLogged, setIsLogged] = useState(() => {
    const savedValue = localStorage.getItem("isLogged");
    return savedValue !== null ? JSON.parse(savedValue) : false;
  });

  useEffect(() => {
    localStorage.setItem("lunchMultiplier", JSON.stringify(lunchMultiplier));
  }, [lunchMultiplier]);

  useEffect(() => {
    localStorage.setItem("dinnerMultiplier", JSON.stringify(dinnerMultiplier));
  }, [dinnerMultiplier]);

  useEffect(() => {
    localStorage.setItem("ordersMultiplier", JSON.stringify(ordersMultiplier));
  }, [ordersMultiplier]);

  useEffect(() => {
    localStorage.setItem("isLogged", JSON.stringify(isLogged));
  }, [isLogged]);

  return (
    <ConlinContext.Provider
      value={{
        lunchMultiplier,
        dinnerMultiplier,
        ordersMultiplier,
        isLogged,
        setLunchMultiplier,
        setDinnerMultiplier,
        setOrdersMultiplier,
        setIsLogged,
      }}
    >
      {children}
    </ConlinContext.Provider>
  );
}

export default ConlinProvider;
