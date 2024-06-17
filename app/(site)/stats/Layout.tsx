"use client";

import { Rider } from "@prisma/client";
import Stats from "./Stats";
import { ReactElement, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "@phosphor-icons/react";
import { Flipper, Flipped, spring } from "react-flip-toolkit";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl mt-8">Statistiche</h1>

      <Button className="" onClick={addStats}>
        <Plus className="mr-2 h-4 w-4" />
        Aggiungi sezione
      </Button>

      <Flipper
        flipKey={stats.map((stat) => stat.key).join("")}
        spring={"noWobble"}
        className="flex w-full space-x-4 p-8 overflow-x-auto"
      >
        {stats.map((stat, index) => (
          <Flipped
            key={stat.key}
            flipId={stat.key?.toString()}
            onAppear={onElementAppear}
          >
            <div
              className="relative group select-none w-full min-w-[45%]"
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
