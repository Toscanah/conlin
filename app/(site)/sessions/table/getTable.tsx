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
import { SessionWithRider } from "../../types/SessionWithRider";

export default function getTable(
  sessions: SessionWithRider[],
  columns: ColumnDef<SessionWithRider>[],
  globalFilter: string,
  setGlobalFilter: Dispatch<SetStateAction<string>>,
  columnVisibility: VisibilityState,
  setColumnVisibility: Dispatch<SetStateAction<VisibilityState>>
) {
  return useReactTable({
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    data: sessions,
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
