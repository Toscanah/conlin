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
import { StatsType } from "../../types/StatsType";

export default function getTable(
  stats: StatsType[],
  columns: ColumnDef<StatsType>[],
  globalFilter: string,
  setGlobalFilter: Dispatch<SetStateAction<string>>,
  columnVisibility: VisibilityState,
  setColumnVisibility: Dispatch<SetStateAction<VisibilityState>>
) {
  return useReactTable({
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    data: stats,
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
        pageSize: 10,
      },
    },
  });
}
