"use client";

import { Rider } from "@prisma/client";
import Stats from "./Stats";
import { ReactElement, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "@phosphor-icons/react";
import { Resizable } from "re-resizable";

export default function Layout({ riders }: { riders: Rider[] }) {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [stats, setStats] = useState<ReactElement<typeof Stats>[]>([
    <Stats key={crypto.randomUUID()} riders={riders} index={0} />,
  ]);

  function addStats() {
    setStats((prevStats) => [
      ...prevStats,
      <Stats key={crypto.randomUUID()} riders={riders} index={currentIndex} />,
    ]);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  }

  function removeStats(index: number) {
    setStats((prevStats) => prevStats.filter((_, i) => i !== index));
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <h1 className="text-4xl my-8">Statistiche</h1>

      <div className="flex flex-col items-center w-full gap-y-14">
        <div className="w-[97%] flex flex-wrap gap-y-8 justify-between">
          {stats.map((stat, index) => (
            <div
              className={`relative group select-none w-[49%] ${
                (index + 1) % 3 === 0 ? "" : ""
              }`}
              key={stat.key}
            >
              {stat}
              <X
                onClick={() => removeStats(index)}
                size={36}
                className="absolute top-[-1rem] right-[-1rem] invisible 
                          group-hover:visible hover:cursor-pointer hover:bg-opacity-50 
                          hover:bg-muted-foreground/20 rounded-full p-1"
              />
            </div>
          ))}

          <div
            className={`${
              stats.length % 2 === 0 ? "w-full" : "w-[49%]"
            } flex items-center justify-center`}
          >
            <Button className="" onClick={addStats}>
              <Plus className="mr-2 h-4 w-4" />
              Aggiungi sezione
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
