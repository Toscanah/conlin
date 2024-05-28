"use client";

import { Rider } from "@prisma/client";
import Stats from "./Stats";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "@phosphor-icons/react";
import { StatsType } from "../types/StatsType";
import Graph from "./results/Graph";

import { TotalsType } from "../types/TotalType";
import TotalStats from "./results/TotalStats";
import { Separator } from "@/components/ui/separator";

export default function Layout({ riders }: { riders: Rider[] }) {
  // state che tiene conto delle key A MANO, non facendo stats.length

  const [results, setResults] = useState<
    { index: number; data: StatsType[] }[]
  >([]);
  const [totals, setTotals] = useState<TotalsType>({});

  useEffect(() => {
    if (results && results[0] && results[0].data.length !== 0) {
      let totals: TotalsType = {};

      results[0].data.map((single) => {
        if (single.totalOrders !== undefined)
          totals.totalOrders = (totals.totalOrders ?? 0) + single.totalOrders;
        if (single.totalHours !== undefined)
          totals.totalHours = (totals.totalHours ?? 0) + single.totalHours;
        if (single.totalPay !== undefined)
          totals.totalPay = (totals.totalPay ?? 0) + single.totalPay;
        if (single.totalTip !== undefined)
          totals.totalTip = (totals.totalTip ?? 0) + single.totalTip;
        if (single.totalMoney !== undefined)
          totals.totalMoney = (totals.totalMoney ?? 0) + single.totalMoney;
        return null;
      });

      console.log(totals);
      setTotals(totals);
    }
  }, [results]);

  function onResult(result: StatsType[], index: number) {
    setResults((prevResults) => {
      const existingResultIndex = prevResults.findIndex(
        (item) => item.index === index
      );

      if (existingResultIndex !== -1) {
        return prevResults.map((item, i) =>
          i === existingResultIndex ? { ...item, data: result } : item
        );
      } else {
        return [...prevResults, { index, data: result }];
      }
    });
  }

  const [stats, setStats] = useState<ReactNode[]>([
    <Stats key={0} riders={riders} onResult={onResult} index={0} />,
  ]);

  const handleAddStats = () => {
    const newStats = [
      ...stats,
      <Stats
        riders={riders}
        onResult={onResult}
        index={stats.length}
        key={stats.length}
      />,
    ];
    setStats(newStats);
  };

  // per qualche motivo quando rimuovo un stat,
  //tutti gli stat davanti si resetttano graficamente ma i dati nel results rimangono correetti
  // ha a che fare qualcosa con la key={}

  // se non metto key={}
  // graficamente viene rimosso l'ultimo Stats, ma realmente viene eliminato il primo

  const handleRemoveStats = (indexToRemove: number) => {
    if (stats.length > 1) {
      const newStats = stats.filter((_, index) => index !== indexToRemove);
      setStats(newStats);

      setResults((prevResults) => {
        const updatedResults = prevResults.filter(
          (item) => item.index !== indexToRemove
        );
        return updatedResults.map((result, index) => ({
          ...result,
          index: index,
        }));
      });
    }
  };

  return (
    <div className="w-full flex flex-col gap-14 items-center justify-center">
      <div>
        <h1 className="text-4xl mt-8 w-full text-center">Statistiche</h1>
      </div>

      <div className="flex w-full flex-wrap gap-y-8 justify-center">
        <div className="w-[80%] flex flex-col gap-y-8">
          {stats.map((stat, index) => (
            <div className="relative group" key={index}>
              {stat}
              {/* <X
                onClick={() => handleRemoveStats(index)}
                size={36}
                className="absolute top-[-1rem] right-[-1rem] invisible 
            group-hover:visible hover:cursor-pointer hover:bg-opacity-50 hover:bg-white rounded-full p-1"
              /> */}
            </div>
          ))}
        </div>
        {/* <div className="w-[49%] flex flex-col gap-y-8">
          {stats.map(
            (stat, index) =>
              index % 2 === 0 && ( // Render in left column if index is odd
                <div className="relative group" key={stats.length}>
                  {stat}
                  <X
                    onClick={() => handleRemoveStats(index)}
                    size={36}
                    className="absolute top-[-1rem] right-[-1rem] invisible 
            group-hover:visible hover:cursor-pointer hover:bg-opacity-50 hover:bg-white rounded-full p-1"
                  />
                </div>
              )
          )}
        </div>

        <div className="w-[49%] flex flex-col gap-y-8">
          {stats.map(
            (stat, index) =>
              index % 2 !== 0 && ( // Render in right column if index is even
                <div className="relative group" key={stats.length}>
                  {stat}
                  <X
                    onClick={() => handleRemoveStats(index)}
                    size={36}
                    className="absolute top-[-1rem] right-[-1rem] invisible 
            group-hover:visible hover:cursor-pointer hover:bg-opacity-50 hover:bg-white rounded-full p-1"
                  />
                </div>
              )
          )}
        </div> */}
      </div>

      {Object.keys(totals).length !== 0 &&
        results[0] &&
        results[0].data.length > 1 && <TotalStats totals={totals} />}

      <div className="flex justify-center items-center">
        {results[0] && results[0]?.data.length !== 0 && (
          <Graph results={results} />
        )}
      </div>

      {/* <div
        className={`${
          stats.length % 2 === 0 ? "w-full invisible" : "w-[49%]"
        } flex items-center justify-center invisible`}
      >
        <Button className="" onClick={handleAddStats}>
          <Plus className="mr-2 h-4 w-4" />
          Aggiungi statistica
        </Button>
      </div> */}
    </div>
  );
}
