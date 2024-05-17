import { Rider } from "@prisma/client";
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

export default function getTable(
  riders: Rider[],
  columns: ColumnDef<Rider>[],
  globalFilter: string,
  setGlobalFilter: Dispatch<SetStateAction<string>>,
  columnVisibility: VisibilityState,
  setColumnVisibility: Dispatch<SetStateAction<VisibilityState>>
) {
  return useReactTable({
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    data: riders,
    columns: columns,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    autoResetPageIndex: false,
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnVisibility,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  });
}
