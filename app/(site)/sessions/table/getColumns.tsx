"use client";

import { Button } from "@/components/ui/button";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns-tz";
import { it } from "date-fns/locale";
import { SessionWithRider } from "../../types/SessionWithRider";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
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
} from "@phosphor-icons/react";
import ColumnHeader from "@/app/(site)/sessions/table/ColumnHeader";
import React from "react";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { Rider } from "@prisma/client";
import DeleteSession from "../actions/DeleteSession";
import SaveSession from "../actions/SaveSession";

export default function getColumns(
  rowData: SessionWithRider[],
  handleInputChange: (id: number, field: string, value: any) => void,
  riders: Rider[],
  onDelete: (id: number) => void,
  onSave: (id: number) => void
): ColumnDef<SessionWithRider>[] {
  return [
    {
      accessorKey: "#",
      cell: ({ row, table }) =>
        (table
          .getSortedRowModel()
          ?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) || 0) + 1,
    },
    {
      accessorKey: "date",
      header: ({ column }) => ColumnHeader(column, "*Data"),
      cell: ({ row }) => {
        const date = rowData[row.original.id]?.date;
        const formattedDate = date ? format(date, "PPP", { locale: it }) : null;

        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[250px] pl-3 text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                {formattedDate ?? <span>Filtra per data</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                numberOfMonths={2}
                locale={it}
                mode="single"
                selected={date ?? new Date()}
                onSelect={(selectedDate) => {
                  handleInputChange(
                    row.original.id,
                    "date",
                    selectedDate
                  );
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
      },
    },
    {
      accessorKey: "rider",
      header: ({ column }) => ColumnHeader(column, "Ragazzo"),
      cell: ({ row }) => {
        const rider = rowData[row.original.id]?.rider;

        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "w-[250px] justify-between",
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
                    {riders?.length ? (
                      riders.map((singleRider) => (
                        <CommandItem
                          key={singleRider.id}
                          onSelect={() => {
                            handleInputChange(
                              row.original.id,
                              "rider",
                              singleRider
                            );
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
        );
      },
    },
    {
      accessorKey: "lunch_orders",
      header: ({ column }) => ColumnHeader(column, "Consegne pranzo"),
      cell: ({ row }) => {
        const value = rowData[row.original.id]?.lunch_orders;

        return (
          <Input
            defaultValue={value || ""}
            onChange={(e) =>
              handleInputChange(
                row.original.id,
                "lunch_orders",
                parseFloat(e.target.value) || 0
              )
            }
          />
        );
      },
    },
    {
      accessorKey: "dinner_orders",
      header: ({ column }) => ColumnHeader(column, "Consegne cena"),
      cell: ({ row }) => {
        const value = rowData[row.original.id]?.dinner_orders;

        return (
          <Input
            defaultValue={value || ""}
            onChange={(e) =>
              handleInputChange(
                row.original.id,
                "dinner_orders",
                parseFloat(e.target.value) || 0
              )
            }
          />
        );
      },
    },
    {
      accessorKey: "lunch_time",
      header: ({ column }) => ColumnHeader(column, "Ore pranzo"),
      cell: ({ row }) => {
        const value = rowData[row.original.id]?.lunch_time;

        return (
          <Input
            defaultValue={value || ""}
            onChange={(e) =>
              handleInputChange(
                row.original.id,
                "lunch_time",
                parseFloat(e.target.value) || 0
              )
            }
          />
        );
      },
    },
    {
      accessorKey: "dinner_time",
      header: ({ column }) => ColumnHeader(column, "Ore cena"),
      cell: ({ row }) => {
        const value = rowData[row.original.id]?.dinner_time;

        return (
          <Input
            defaultValue={value || ""}
            onChange={(e) =>
              handleInputChange(
                row.original.id,
                "dinner_time",
                parseFloat(e.target.value) || 0
              )
            }
          />
        );
      },
    },
    {
      accessorKey: "tip_lunch",
      header: ({ column }) => ColumnHeader(column, "Mancia pranzo"),
      cell: ({ row }) => {
        const value = rowData[row.original.id]?.tip_lunch;

        return (
          <Input
            defaultValue={value || ""}
            onChange={(e) =>
              handleInputChange(
                row.original.id,
                "tip_lunch",
                parseFloat(e.target.value) || 0
              )
            }
          />
        );
      },
    },
    {
      accessorKey: "tip_dinner",
      header: ({ column }) => ColumnHeader(column, "Mancia cena"),
      cell: ({ row }) => {
        const value = rowData[row.original.id]?.tip_dinner;

        return (
          <Input
            defaultValue={value || ""}
            onChange={(e) =>
              handleInputChange(
                row.original.id,
                "tip_dinner",
                parseFloat(e.target.value) || 0
              )
            }
          />
        );
      },
    },
    {
      accessorKey: "Azioni",
      cell: ({ row }) => (
        <div className="flex gap-5">
          {/* <SaveSession session={row.original} onSave={onSave} /> */}
          <DeleteSession session={row.original} onDelete={onDelete} />
        </div>
      ),
    },
  ];
}
