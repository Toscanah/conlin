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
import { Rider } from "@prisma/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { flexRender, VisibilityState } from "@tanstack/react-table";
import getColumns from "./getColumns";
import getTable from "./getTable";
import AddRider from "../actions/AddRider";

export default function RidersTable({
  initialRiders,
}: {
  initialRiders: Rider[];
}) {
  const [riders, setRiders] = useState<Rider[]>(initialRiders);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  function onEdit(editedRider: Rider) {
    const updatedRiders: Rider[] = riders.map((rider) => {
      if (rider.id === editedRider.id) {
        console.log(editedRider.is_active);
        return {
          ...rider,
          name: editedRider.name,
          surname: editedRider.surname,
          nickname: editedRider.nickname,
          is_active: editedRider.is_active,
        };
      }

      return rider;
    });

    setRiders(updatedRiders);
  }

  function onAddedRider(newRider: Rider) {
    setRiders((prevRiders) => [...prevRiders, newRider]);
  }

  const columns = getColumns(onEdit);
  const table = getTable(
    riders,
    columns,
    globalFilter,
    setGlobalFilter,
    columnVisibility,
    setColumnVisibility
  );

  return (
    <div>
      <div className="flex items-center py-4 w-full gap-2">
        <Input
          placeholder="Filtra"
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(String(event.target.value))}
          className="max-w-sm"
        />

        <Button
          variant="default"
          onClick={() => {
            setGlobalFilter("");
          }}
        >
          Cancella
        </Button>

        <AddRider onAddedRider={onAddedRider} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
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
    </div>
  );
}
