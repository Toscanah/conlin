import {
  ColumnDef,
  ColumnFiltersState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";
import { SessionWithRider } from "../../types/SessionWithRider";

export default function getTable(
  sessions: SessionWithRider[],
  columns: ColumnDef<SessionWithRider>[],
  columnVisibility: VisibilityState,
  setColumnVisibility: Dispatch<SetStateAction<VisibilityState>>,
  columnFilters: ColumnFiltersState,
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>
) {
  return useReactTable({
    onColumnVisibilityChange: setColumnVisibility,
    data: sessions,
    columns: columns,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    autoResetPageIndex: false,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnVisibility,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 6,
      },
    },
  });
}
