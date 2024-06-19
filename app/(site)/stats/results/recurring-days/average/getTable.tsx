import {
  ColumnDef,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";
import { StatsType } from "./../StatsType";
import { AverageType } from "./AverageType";

export default function getTable(
  averages: AverageType[],
  columns: ColumnDef<AverageType>[],
  columnVisibility: VisibilityState,
  setColumnVisibility: Dispatch<SetStateAction<VisibilityState>>
) {
  return useReactTable({
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    data: averages,
    columns: columns,
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnVisibility,
    },
  });
}
