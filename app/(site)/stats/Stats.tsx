"use client";

import { DateRange } from "react-day-picker";
import { Rider } from "@prisma/client";
import { useEffect, useState } from "react";
import RangeResults from "./results/date-range/Results";
import ReccuringResults from "./results/recurring-days/Results";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import StatsFields from "./StatsFields";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Broom } from "@phosphor-icons/react";

export const revalidate = false;

export default function Stats({
  riders,
  index,
}: {
  riders: Rider[];
  index: number;
}) {
  const [rider, setRider] = useState<Rider>({
    id: -1,
    name: "Tutti",
    surname: "Tutti",
    nickname: "Tutti",
    is_active: false,
  });
  const [date, setDate] = useState<DateRange | undefined>();
  const [context, setContext] = useState<string>("all");
  const [session, setSession] = useState<string>("both");

  // robe per il confronta date
  const [dateChoice, setDateChoice] = useState<string>("range");
  const [days, setDays] = useState<string[]>([]);
  const [periodChoice, setPeriodChoice] = useState<string>("month");
  const [period, setPeriod] = useState<string>("");
  const [yearOfPeriod, setYearOfPeriod] = useState<string>(
    new Date().getFullYear().toString()
  );

  return (
    <div
      className="flex flex-col items-center p-6 w-full 
    gap-8 border-2 rounded-lg  hover:border-foreground "
    >
      {/* <Broom  className="absolute top-0 left-0 p-1 hover:cursor-pointer" size={32} onClick={() => {
        setRider({
          id: -1,
          name: "Tutti",
          surname: "Tutti",
          nickname: "Tutti",
          is_active: false,
        });
        setDate(undefined)
        setContext("all")
        setSession("both")
        setDateChoice("range")
        setDays([])
        setPeriodChoice("month");
        setPeriod("");
      }}>pulisci</Broom > */}

      <StatsFields
        riders={riders}
        rider={rider}
        date={date}
        dateChoice={dateChoice}
        days={days}
        periodChoice={periodChoice}
        period={period}
        yearOfPeriod={yearOfPeriod}
        setRider={setRider}
        setDate={setDate}
        setContext={setContext}
        setSession={setSession}
        setDateChoice={setDateChoice}
        setDays={setDays}
        setPeriodChoice={setPeriodChoice}
        setPeriod={setPeriod}
        setYearOfPeriod={setYearOfPeriod}
      />

      <div className={`w-full ${dateChoice === "range" ? "block" : "hidden"}`}>
        {date?.from && date?.to && (
          <RangeResults
            date={date}
            context={context}
            session={session}
            riderId={rider.id !== -1 ? rider.id : undefined}
            isAllRiders={rider.id === -1}
          />
        )}
      </div>

      <div
        className={`w-full ${
          dateChoice === "periodic-day" ? "block" : "hidden"
        }`}
      >
        {days.length > 0 && period && (
          <ReccuringResults
            days={days}
            context={context}
            session={session}
            periodChoice={periodChoice}
            period={period}
            yearOfPeriod={yearOfPeriod}
          />
        )}
      </div>
    </div>
  );
}
