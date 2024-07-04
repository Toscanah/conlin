"use client";

import { DateRange } from "react-day-picker";
import { Rider } from "@prisma/client";
import { useEffect, useState } from "react";
import RangeResults from "./results/date-range/Results";
import ReccuringResults from "./results/recurring-days/Results";
import StatsFields from "./StatsFields";
import { daysToWeeks } from "date-fns";

export const revalidate = false;

export default function Stats({
  riders,
  index,
}: {
  riders: Rider[];
  index: number;
}) {
  // scelta del tipo di statistica
  const [dateChoice, setDateChoice] = useState<string>("range");

  // state che usano entrambi i casi
  const [context, setContext] = useState<string>("all");
  const [session, setSession] = useState<string>("both");

  // caso da data a data
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [rider, setRider] = useState<Rider>({
    id: -1,
    name: "Tutti",
    surname: "Tutti",
    nickname: "Tutti",
    is_active: false,
  });

  // caso dei giorni della sett specifici
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);
  const [periodChoice, setPeriodChoice] = useState<string>("year");

  // se il periodo è l'anno allora uso "year", altrimenti serve il "month" + "yearOfMonth"
  const [year, setYear] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [yearOfMonth, setYearOfMonth] = useState<string>("");

  const shouldRenderReccuringResults = () => {
    if (periodChoice === "year") {
      return daysOfWeek.length > 0 && year !== "";
    } else if (periodChoice === "month") {
      return daysOfWeek.length > 0 && month !== "" && yearOfMonth !== "";
    }
    return false;
  };



  const riderProps = { rider, setRider };
  const dateRangeProps = { dateRange, setDateRange };
  const contextProps = { context, setContext };
  const sessionProps = { session, setSession };
  const dateChoiceProps = { dateChoice, setDateChoice };
  const daysOfWeekProps = { daysOfWeek, setDaysOfWeek };
  const periodProps = {
    periodChoice,
    setPeriodChoice,
    year,
    setYear,
    month,
    setMonth,
    yearOfMonth,
    setYearOfMonth,
  };

  return (
    <div className="flex flex-col items-center p-6 w-full gap-8 border rounded-lg">
      <StatsFields
        riders={riders}
        {...riderProps}
        {...dateRangeProps}
        {...contextProps}
        {...sessionProps}
        {...dateChoiceProps}
        {...daysOfWeekProps}
        {...periodProps}
      />

      <div
        className={`w-full ${
          dateChoice === "range" && dateRange?.from && dateRange?.to
            ? "block relative"
            : "hidden absolute"
        }`}
      >
        {dateRange?.from && dateRange?.to && (
          <RangeResults
            dateRange={dateRange}
            context={context}
            session={session}
            riderId={rider.id !== -1 ? rider.id : undefined}
            isAllRiders={rider.id === -1}
          />
        )}
      </div>

      <div
        className={`w-full ${
          dateChoice === "periodic-day" && shouldRenderReccuringResults()
            ? "block relative"
            : "hidden absolute"
        }`}
      >
        {shouldRenderReccuringResults() && (
          <ReccuringResults
            index={index}
            daysOfWeek={daysOfWeek}
            context={context}
            session={session}
            periodChoice={periodChoice}
            year={year}
            month={month}
            yearOfMonth={yearOfMonth}
          />
        )}
      </div>
    </div>
  );
}
