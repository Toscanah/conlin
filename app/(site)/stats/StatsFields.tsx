import {
  subDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  startOfDay,
  subYears,
} from "date-fns";
import { it } from "date-fns/locale";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  CaretUpDown,
  Check,
} from "@phosphor-icons/react";
import { format } from "date-fns";
import { Dispatch, SetStateAction, useState } from "react";
import { Rider } from "@prisma/client";
import { DateRange } from "react-day-picker";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function StatsFields({
  dateChoice,
  setDateChoice,
  riders,
  rider,
  setRider,
  dateRange,
  setDateRange,
  periodChoice,
  setPeriodChoice,
  setContext,
  setSession,
  setDaysOfWeek,
  month,
  setMonth,
  yearOfMonth,
  setYearOfMonth,
  year,
  setYear,
}: {
  dateChoice: string;
  riders: Rider[];
  rider: Rider;
  dateRange: DateRange | undefined;
  periodChoice: string;
  yearOfMonth: string;
  year: string;
  month: string;
  setRider: Dispatch<SetStateAction<Rider>>;
  setDateRange: Dispatch<SetStateAction<DateRange | undefined>>;
  setContext: Dispatch<SetStateAction<string>>;
  setSession: Dispatch<SetStateAction<string>>;
  setDateChoice: Dispatch<SetStateAction<string>>;
  setDaysOfWeek: Dispatch<SetStateAction<string[]>>;
  setPeriodChoice: Dispatch<SetStateAction<string>>;
  setYear: Dispatch<SetStateAction<string>>;
  setMonth: Dispatch<SetStateAction<string>>;
  setYearOfMonth: Dispatch<SetStateAction<string>>;
}) {
  const daysOfWeek = [
    "martedì",
    "mercoledì",
    "giovedì",
    "venerdì",
    "sabato",
    "domenica",
  ];

  const getMonths = () => {
    const months = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(2020, i, 1);
      let monthName = format(date, "LLLL", { locale: it });
      monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
      months.push(monthName);
    }
    return months;
  };
  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 2020; year <= currentYear; year++) {
      years.push(year.toString());
    }
    return years.reverse();
  };
  const handlePresetSelect = (value: string) => {
    const today = new Date();

    switch (value) {
      case "today":
        setDateRange({ from: startOfDay(today), to: startOfDay(today) });
        break;
      case "yesterday":
        const yesterday = subDays(today, 1);
        setDateRange({
          from: startOfDay(yesterday),
          to: startOfDay(yesterday),
        });
        break;
      case "last7":
        const last7 = subDays(today, 6);
        setDateRange({ from: startOfDay(last7), to: startOfDay(today) });
        break;
      case "last30":
        const last30 = subDays(today, 29);
        setDateRange({ from: startOfDay(last30), to: startOfDay(today) });
        break;
      case "thisMonth":
        setDateRange({
          from: startOfMonth(today),
          to: startOfDay(endOfMonth(today)),
        });
        break;
      case "thisYear":
        setDateRange({
          from: startOfYear(today),
          to: startOfDay(endOfYear(today)),
        });
        break;
      default:
        break;
    }
  };
  const toggleDay = (day: string) => {
    setDaysOfWeek((prevDays) => {
      if (prevDays.includes(day)) {
        return prevDays.filter((d) => d !== day);
      } else {
        return [...prevDays, day];
      }
    });
  };

  const handleYearChange = (year: string) => {
    if (periodChoice == "year") {
      setYear(year);
    } else if (periodChoice == "month") {
      setYearOfMonth(year);
    }
  };

  const periodOptions = {
    year: {
      label: "Anno?",
      placeholder: "Seleziona l'anno",
      options: getYears(),
      onValueChange: handleYearChange,
      defaultValue: "",
    },
    month: {
      label: "Mese?",
      placeholder: "Seleziona il mese",
      options: getMonths(),
      onValueChange: (month: string) => {
        setMonth(month);
      },
      defaultValue: "",
      value: month,
    },
  };

  return (
    <div className="w-full flex gap-8 items-center flex-col">
      <RadioGroup
        defaultValue="range"
        onValueChange={(e) => {
          setDateChoice(e);
        }}
        className="flex w-full flex-row justify-around h-10"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="range"
            id="range"
            className="w-[20px] h-[20px]"
          />
          <Label htmlFor="range">Intervallo</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="periodic-day"
            id="periodic-day"
            className="w-[20px] h-[20px]"
          />
          <Label htmlFor="periodic-day">Giorno/i della settimana</Label>
        </div>
      </RadioGroup>

      <div className={`w-full ${dateChoice !== "range" ? "hidden" : "block"}`}>
        <div className="w-full flex gap-8">
          <div className="space-y-2 w-1/2">
            <Label htmlFor="rider">Ragazzo</Label>
            <Popover>
              <PopoverTrigger asChild id="rider">
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-[100%] justify-between",
                    !rider && "text-muted-foreground"
                  )}
                >
                  {rider ? (
                    rider.nickname ?? rider.name + " " + rider.surname
                  ) : (
                    <span className="invisible">no placeholder</span>
                  )}
                  <CaretUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                <Command>
                  <CommandInput placeholder="Cerca..." />
                  <CommandEmpty>Nessun ragazzo trovato</CommandEmpty>
                  <CommandGroup>
                    <CommandList>
                      <CommandItem
                        key={-1}
                        onSelect={() => {
                          setRider({
                            id: -1,
                            name: "Tutti",
                            surname: "Tutti",
                            nickname: "Tutti",
                            is_active: false,
                          });
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            rider && rider.id === -1
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        Tutti
                      </CommandItem>
                      {riders?.length ? (
                        riders.map((singleRider) => (
                          <CommandItem
                            key={singleRider.id}
                            onSelect={() => {
                              setRider(singleRider);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                singleRider === rider
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <div className="truncate">
                              {singleRider.name.charAt(0)} {". "}
                              {singleRider.surname}{" "}
                              {singleRider.nickname && (
                                <>
                                  (<strong>{singleRider.nickname}</strong>)
                                </>
                              )}
                            </div>
                          </CommandItem>
                        ))
                      ) : (
                        <CommandEmpty>Nessun ragazzo trovato</CommandEmpty>
                      )}
                    </CommandList>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2 w-[50%]">
            <Label htmlFor="date">Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange ? (
                    <>
                      {dateRange.from
                        ? `${format(dateRange.from, "PPP", {
                            locale: it,
                          })}`
                        : ""}
                      {" - "}
                      {dateRange.to
                        ? `${format(dateRange.to, "PPP", {
                            locale: it,
                          })}`
                        : ""}
                    </>
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
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div
        className={`w-full ${
          dateChoice !== "periodic-day" ? "hidden" : "block"
        }`}
      >
        <div className="w-full flex gap-8">
          <div className="space-y-2 w-[50%] overflow-hidden">
            <Label>Che giorni?</Label>
            <ToggleGroup
              className="flex h-10 w-full border rounded-lg gap-0 overflow-hidden"
              type="multiple"
            >
              {daysOfWeek.map((day, index) => (
                <ToggleGroupItem
                  key={day}
                  className={cn(
                    "flex-1 hover:cursor-pointer min-w-0 rounded-none",
                    index === 0 && "rounded-s-lg",
                    index + 1 === daysOfWeek.length && "rounded-e-lg"
                  )}
                  onClick={() => toggleDay(day)}
                  value={day}
                >
                  <div className="w-full truncate">{day.toUpperCase()}</div>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="w-[50%] flex gap-8">
            <Select onValueChange={setPeriodChoice} defaultValue="year">
              <div className="space-y-2 w-[50%]">
                <Label htmlFor="period">Ogni cosa?</Label>
                <SelectTrigger id="period">
                  <SelectValue placeholder="" />
                </SelectTrigger>
              </div>

              <SelectContent>
                <SelectItem key={1} value={"month"}>
                  Mese
                </SelectItem>
                <SelectItem key={2} value={"year"} defaultChecked={true}>
                  Anno
                </SelectItem>
              </SelectContent>
            </Select>

            {periodChoice === "month" && (
              <div className="space-y-2 w-[50%]">
                <Label htmlFor="open-popover">Dati (click per inserire)</Label>
                <Popover>
                  <PopoverTrigger asChild className="w-full" id="open-popover">
                    <Button variant="secondary" className="hover:underline">
                      {month && yearOfMonth
                        ? `${month}, ${yearOfMonth}`
                        : month || yearOfMonth
                        ? month || yearOfMonth
                        : "Dati"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="space-y-2">
                    <SelectComponent
                      id="period-month"
                      label={periodOptions.month.label}
                      placeholder={periodOptions.month.placeholder}
                      options={periodOptions.month.options}
                      onValueChange={periodOptions.month.onValueChange}
                      defaultValue={periodOptions.month.defaultValue}
                      value={periodOptions.month.value}
                    />
                    <SelectComponent
                      id="period-year"
                      label={periodOptions.year.label}
                      placeholder={periodOptions.year.placeholder}
                      options={getYears()}
                      onValueChange={periodOptions.year.onValueChange}
                      defaultValue={""}
                      value={yearOfMonth}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {periodChoice === "year" && (
              <div className="w-1/2">
                <SelectComponent
                  id="period-year"
                  label={periodOptions.year.label}
                  placeholder={periodOptions.year.placeholder}
                  options={periodOptions.year.options}
                  onValueChange={periodOptions.year.onValueChange}
                  defaultValue={periodOptions.year.defaultValue}
                  value={year}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full flex gap-8">
        <Select onValueChange={setContext} defaultValue="all">
          <div className="space-y-2 w-[50%]">
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
            <SelectItem key={4} value={"pay"}>
              Paga
            </SelectItem>
            <SelectItem key={5} value={"tip"}>
              Mancie
            </SelectItem>
            <SelectItem key={6} value={"total"}>
              Incasso totale
            </SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setSession} defaultValue="both">
          <div className="space-y-2 w-[50%]">
            <Label htmlFor="session">Turno?</Label>
            <SelectTrigger id="session">
              <SelectValue placeholder="Seleziona un turno" />
            </SelectTrigger>
          </div>

          <SelectContent>
            <SelectItem key={1} value={"both"} defaultChecked={true}>
              Pranzo + cena
            </SelectItem>
            <SelectItem key={2} value={"lunch"}>
              Pranzo
            </SelectItem>
            <SelectItem key={3} value={"dinner"}>
              Cena
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

const SelectComponent = ({
  id,
  label,
  placeholder,
  options,
  onValueChange,
  defaultValue,
  value,
}: {
  id: string;
  label: string;
  placeholder: string;
  options: string[];
  onValueChange: (value: string) => void;
  defaultValue: string;
  value: string;
}) => (
  <Select
    onValueChange={onValueChange}
    defaultValue={defaultValue}
    value={value}
  >
    <div className={cn("space-y-2 w-full")}>
      <Label htmlFor={id}>{label}</Label>
      <SelectTrigger id={id}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
    </div>

    <SelectContent>
      {options.map((option: string) => (
        <SelectItem key={option} value={option}>
          {option}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);
