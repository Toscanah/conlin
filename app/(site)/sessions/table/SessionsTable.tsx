"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import {
  ColumnFiltersState,
  flexRender,
  VisibilityState,
} from "@tanstack/react-table";
import getColumns from "./getColumns";
import getTable from "./getTable";
import { SessionWithRider } from "../../types/SessionWithRider";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar as CalendarIcon,
  CaretUpDown,
  Check,
  Question,
} from "@phosphor-icons/react";
import { useToast } from "@/components/ui/use-toast";
import { Rider } from "@prisma/client";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function SessionsTable({
  initialSessions,
  riders,
}: {
  initialSessions: SessionWithRider[];
  riders: Rider[];
}) {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [rider, setRider] = useState<Rider>({
    id: -1,
    name: "Tutti",
    surname: "Tutti",
    nickname: "Tutti",
    is_active: false,
  });
  const [sessions, setSessions] = useState<SessionWithRider[]>(initialSessions);
  const [filteredSessions, setFilteredSession] =
    useState<SessionWithRider[]>(sessions);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  useEffect(() => {
    let filtered = sessions;

    if (date) {
      filtered = filtered.filter((session: SessionWithRider) => {
        return session.date?.toDateString() === date.toDateString();
      });
    }

    if (rider) {
      if (rider.id !== -1) {
        filtered = filtered.filter((session: SessionWithRider) => {
          return session.rider.id === rider.id;
        });
      }
    }

    setFilteredSession(filtered);
  }, [date, rider, sessions]);

  const saveRowData = (id: number, data: SessionWithRider) => {
    fetch("/api/sessions/edit/", {
      method: "POST",
      body: JSON.stringify({
        id: id,
        date: data.date,
        lunch_orders: data.lunch_orders,
        dinner_orders: data.dinner_orders,
        lunch_time: data.lunch_time,
        dinner_time: data.dinner_time,
        tip_lunch: data.tip_lunch,
        tip_dinner: data.tip_dinner,
        rider: data.rider,
      }),
    }).then((response) => {
      if (response.ok) {
        toast({
          className: cn("w-full justify-center items-center"),
          duration: 1000,
          description: <Check size={128} color="#7CFC00" />,
        });
      }
    });
  };

  const [rowData, setRowData] = useState<SessionWithRider[]>(() => {
    const initialData = filteredSessions.reduce((acc: any, session) => {
      acc[session.id] = {
        date: session.date,
        lunch_orders: session.lunch_orders,
        dinner_orders: session.dinner_orders,
        lunch_time: session.lunch_time,
        dinner_time: session.dinner_time,
        tip_lunch: session.tip_lunch,
        tip_dinner: session.tip_dinner,
        rider: session.rider,
      };
      return acc;
    }, {});
    return initialData;
  });

  const handleUpdate = (
    id: number,
    field: string,
    event?: React.KeyboardEvent<HTMLInputElement>,
    value?: any
  ) => {
    let updatedValue: any;

    if (field === "date" || field === "rider") {
      updatedValue = value;
    } else if (event?.key === "Enter") {
      updatedValue = parseFloat((event.target as HTMLInputElement).value) || 0;
    }

    if (updatedValue !== undefined) {
      setRowData((prevData) => {
        const updatedData = {
          ...prevData,
          [id]: {
            ...prevData[id],
            [field]: updatedValue,
          },
        };

        saveRowData(id, updatedData[id]);
        return updatedData;
      });
    }
  };

  const columns = getColumns(rowData, handleUpdate, riders);
  const table = getTable(
    filteredSessions,
    columns,
    columnVisibility,
    setColumnVisibility,
    columnFilters,
    setColumnFilters
  );

  return (
    <>
      <div className="flex flex-row items-center py-4 w-full gap-2">
        {/**TODO: Potrebbe diventare un select */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-[300px] justify-between",
                !rider && "text-muted-foreground"
              )}
            >
              {rider ? (
                rider.nickname ?? rider.surname
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
                        rider && rider.id === -1 ? "opacity-100" : "opacity-0"
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
                            singleRider.id === rider?.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {singleRider.name.charAt(0)} {". "}
                        {singleRider.surname}{" "}
                        {singleRider.nickname && (
                          <>
                            (<strong>{singleRider.nickname}</strong>)
                          </>
                        )}
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

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[25vw] pl-3 text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              {date ? (
                format(date, "PPP", { locale: it })
              ) : (
                <span>Filtra per data</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              locale={it}
              mode="single"
              selected={date}
              numberOfMonths={2}
              onSelect={(date) => setDate(date ?? new Date())}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="default"
          onClick={() => {
            setFilteredSession(sessions);
            setDate(undefined);
            setRider({
              id: -1,
              name: "Tutti",
              surname: "Tutti",
              nickname: "Tutti",
              is_active: false,
            });
          }}
        >
          Cancella filtri
        </Button>

        <div className="text-xs ml-auto">
          <HoverCard>
            <HoverCardTrigger>
              <Question size={32} />
            </HoverCardTrigger>
            <HoverCardContent>
              <ul>
                <li>
                  Per i campi numerici scrivi il nuovo valore e poi premi
                  "invio".
                </li>
                <li>
                  Per il ragazzo e la data, l'aggiornamento invece è automatico
                </li>
              </ul>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>

      <div className="rounded-md border max-w-full overflow-x-auto ">
        <Table>
          <TableHeader>
            {table.getRowModel().rows?.length > 0 &&
              table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nessun risultato!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Precedenti
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Prossimi
        </Button>
      </div>
    </>
  );
}
