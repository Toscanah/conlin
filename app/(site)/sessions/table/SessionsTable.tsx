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
import { useCallback, useEffect, useState } from "react";
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
import { debounce } from "@mui/material";

export default function SessionsTable({
  initialSessions,
  riders,
}: {
  initialSessions: SessionWithRider[];
  riders: Rider[];
}) {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<SessionWithRider[]>(initialSessions);
  const [filteredSessions, setFilteredSession] =
    useState<SessionWithRider[]>(sessions);

  const [rowData, setRowData] = useState<SessionWithRider[]>(() => {
    const initialData = sessions.reduce((acc: any, session) => {
      acc[session.id] = { ...session };
      return acc;
    }, {});
    return initialData;
  });

  const [date, setDate] = useState<Date>();
  const [rider, setRider] = useState<Rider>({
    id: -1,
    name: "Tutti",
    surname: "Tutti",
    nickname: "Tutti",
    is_active: false,
  });

  useEffect(() => {
    let filtered = sessions;

    if (date) {
      filtered = filtered.filter(
        (session: SessionWithRider) =>
          session.date?.toDateString() === date.toDateString()
      );
    }
    if (rider && rider.id !== -1) {
      filtered = filtered.filter(
        (session: SessionWithRider) => session.rider.id === rider.id
      );
    }

    setFilteredSession(filtered);
  }, [date, rider, sessions]);

  function onDelete(id: number) {
    setSessions((prevSessions) =>
      prevSessions.filter((session) => session.id !== id)
    );
    setFilteredSession((prevFilteredSessions) =>
      prevFilteredSessions.filter((session) => session.id !== id)
    );
  }

  function onSave(id: number) {
    const updatedData = rowData[id];
    console.log(updatedData);

    fetch("/api/sessions/edit/", {
      method: "POST",
      body: JSON.stringify(updatedData),
    }).then((response) => {
      if (response.ok) {
        setSessions((prevSessions) =>
          prevSessions.map((session) =>
            session.id === id ? updatedData : session
          )
        );
        setFilteredSession((prevFilteredSessions) =>
          prevFilteredSessions.map((session) =>
            session.id === id ? updatedData : session
          )
        );

        toast({
          className: cn("w-full justify-center items-center"),
          duration: 1000,
          description: <Check size={128} color="#7CFC00" />,
        });
      }
    });
  }

  const debouncedUpdate = useCallback(
    debounce((id: number, field: string, value: any) => {
      const updatedRowData: any = { ...rowData };
      updatedRowData[id][field] = value;
      setRowData(updatedRowData);

      onSave(id);
    }, 1000),
    []
  );

  function handleInputChange(id: number, field: string, value: any) {
    debouncedUpdate(id, field, value);
  }

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const columns = getColumns(
    rowData,
    handleInputChange,
    riders,
    onDelete,
    onSave
  );
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
