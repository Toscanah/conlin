"use client";

import { createContext, useEffect, useState } from "react";

export const ConlinContext = createContext({
  lunchMultiplier: 6,
  dinnerMultiplier: 7,
  ordersMultiplier: 1,
  updateMultiplier: (field: string, value: number) => {},
  isLogged: false,
  setIsLogged: (logged: boolean) => {},
});

export function ConlinProvider({ children }: { children: any }) {
  const [lunchMultiplier, setLunchMultiplier] = useState<number>(6);
  const [dinnerMultiplier, setDinnerMultiplier] = useState<number>(7);
  const [ordersMultiplier, setOrdersMultiplier] = useState<number>(1);

  function fetchMultipliers() {
    fetch("/api/multipliers/get/", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setLunchMultiplier(data.lunchMultiplier);
          setDinnerMultiplier(data.dinnerMultiplier);
          setOrdersMultiplier(data.ordersMultiplier);
        }
      }).catch((error) => {
        console.error("Error fetching multipliers:", error);
      });
  }

  fetchMultipliers();

  function updateMultiplier(field: string, value: number) {
    fetch("/api/multipliers/update/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ field, value }),
    });

    switch (field) {
      case "lunchMultiplier":
        setLunchMultiplier(value);
        break;
      case "dinnerMultiplier":
        setDinnerMultiplier(value);
        break;
      case "ordersMultiplier":
        setOrdersMultiplier(value);
        break;
      default:
        break;
    }
  }

  const [isLogged, setIsLogged] = useState(() => {
    const savedValue = localStorage.getItem("isLogged");
    return savedValue !== null ? JSON.parse(savedValue) : false;
  });

  useEffect(() => {
    window.localStorage.setItem("isLogged", JSON.stringify(isLogged));
  }, [isLogged]);

  return (
    <ConlinContext.Provider
      value={{
        lunchMultiplier,
        dinnerMultiplier,
        ordersMultiplier,
        updateMultiplier,
        isLogged,
        setIsLogged,
      }}
    >
      {children}
    </ConlinContext.Provider>
  );
}

export default ConlinProvider;
