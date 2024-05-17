"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { it } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  subDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  format,
} from "date-fns";

import { DateRange } from "react-day-picker";
import { Rider } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "@phosphor-icons/react";
import { useEffect, useState, memo } from "react";
import StatsResult from "./StatsResult";
import { StatsType } from "./StatsType";

export default function Stats({
  riders: receivedRiders,
  index,
  onResult,
}: {
  riders: Rider[];
  index: number;
  onResult: (result: StatsType[], index: number) => void;
}) {
  const riders = receivedRiders;
  const [rider, setRider] = useState<string>("all");
  const [date, setDate] = useState<DateRange>();
  const [context, setContext] = useState<string>("all");

  function handlePresetSelect(value: string) {
    switch (value) {
      case "today":
        setDate({ from: new Date(), to: new Date() });
        break;
      case "yesterday":
        setDate({ from: subDays(new Date(), 1), to: subDays(new Date(), 1) });
        break;
      case "last7":
        setDate({ from: subDays(new Date(), 6), to: new Date() });
        break;
      case "last30":
        setDate({ from: subDays(new Date(), 29), to: new Date() });
        break;
      case "thisMonth":
        setDate({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) });
        break;
      case "thisYear":
        setDate({ from: startOfYear(new Date()), to: endOfYear(new Date()) });
        break;
      default:
        break;
    }
  }

  return (
    <div className="flex flex-col items-center p-6 w-[100%] gap-8 border- border rounded-lg">
      <div className="flex items-center gap-8 w-full">
        <Select onValueChange={setRider} defaultValue="all">
          <div className="space-y-2 w-1/3">
            <Label htmlFor="rider">Chi?</Label>
            <SelectTrigger id="rider">
              <SelectValue placeholder="Seleziona un ragazzo" />
            </SelectTrigger>
          </div>

          <SelectContent id="rider">
            <SelectItem key={0} value={"all"} defaultChecked={true}>
              Tutti
            </SelectItem>
            {riders.map((rider) => (
              <SelectItem
                key={rider.id}
                value={rider.id.toString() + "-" + rider.nickname}
              >
                {rider.name + " " + (rider.surname ? rider.surname : "")}
                {rider.nickname && (
                  <>
                    {" "}
                    (<strong>{rider.nickname}</strong>)
                  </>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="space-y-2 w-1/2">
          <Label htmlFor="date">Data</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? (
                  date.from && date.to ? (
                    `${format(date.from, "PPP", {
                      locale: it,
                    })} - ${format(date.to, "PPP", { locale: it })}`
                  ) : (
                    <span>Seleziona la data</span>
                  )
                ) : (
                  <span>Seleziona la data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
              <Select
                onValueChange={(value) => {
                  handlePresetSelect(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Date veloci" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="today">Oggi</SelectItem>
                  <SelectItem value="yesterday">Ieri</SelectItem>
                  <SelectItem value="last7">Ultimi 7 giorni</SelectItem>
                  <SelectItem value="last30">Ultimi 30 giorni</SelectItem>
                  <SelectItem value="thisMonth">Questo mese</SelectItem>
                  <SelectItem value="thisYear">Questo'anno</SelectItem>
                </SelectContent>
              </Select>
              <div className="rounded-md border">
                <Calendar
                  locale={it}
                  mode="range"
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                  //onDayTouchStart={(e) => console.log(e)}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Select onValueChange={setContext} defaultValue="all">
          <div className="space-y-2 w-1/3">
            <Label htmlFor="context">Cosa?</Label>
            <SelectTrigger id="context">
              <SelectValue placeholder="Seleziona un contesto" />
            </SelectTrigger>
          </div>

          <SelectContent>
            <SelectItem key={1} value={"all"} defaultChecked={true}>
              Tutto
            </SelectItem>
            <SelectItem key={2} value={"orders"}>
              Consegne
            </SelectItem>
            <SelectItem key={3} value={"time"}>
              Ore
            </SelectItem>
            <SelectItem key={4} value={"money"}>
              Incassi (no mancia)
            </SelectItem>
            <SelectItem key={5} value={"tip"}>
              Mancie
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {rider !== "all" && date?.from && date?.to && (
        <StatsResult
          riderId={parseInt(rider.split("-")[0])}
          date={date}
          index={index}
          context={context}
          isAllRiders={false}
          onResult={onResult}
        />
      )}

      {rider === "all" && date?.from && date?.to && (
        <StatsResult
          date={date}
          index={index}
          context={context}
          isAllRiders={true}
          onResult={onResult}
        />
      )}
    </div>
  );
}
