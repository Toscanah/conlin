"use client";

import { Rider } from "@prisma/client";
import Stats from "./Stats";
import { ReactElement, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "@phosphor-icons/react";
import { Flipper, Flipped, spring } from "react-flip-toolkit";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { createGlobalStyle } from "styled-components";

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

  const onElementAppear = (el: any, index: number) => {
    spring({
      onUpdate: (val) => {
        el.style.opacity = val;
      },
      delay: index * 50,
    });
  };

  const clearStats = () => {
    stats.forEach((_, i) => {
      setTimeout(() => {
        setStats((prevStats) => prevStats.filter((_, index) => index !== 0));
      }, i * 500); // Adjust the delay timing as needed
    });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl mt-8">Statistiche</h1>

      <div className="flex flex-col">
        <Button className="" onClick={addStats}>
          <Plus className="mr-2 h-4 w-4" />
          Aggiungi sezione
        </Button>

        <Button className="" onClick={clearStats} variant={"link"}>
          Cancella tutte
        </Button>
      </div>

      <Flipper
        flipKey={stats.map((stat) => stat.key).join("")}
        spring={"noWobble"}
        className="flex w-[97%] gap-4 p-8 overflow-x-auto justify-evenly"
      >
        {stats.map((stat, index) => (
          <Flipped
            key={stat.key}
            flipId={stat.key?.toString()}
            onAppear={onElementAppear}
          >
            <div
              className={cn(
                "relative group select-none min-w-[49%]",
                stats.length == 1 && "w-full",
                stats.length >= 2 && "w-[49%]"
              )}
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
          </Flipped>
        ))}
      </Flipper>
    </div>
  );
}
