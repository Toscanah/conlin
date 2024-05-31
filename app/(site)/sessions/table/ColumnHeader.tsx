import { Button } from "@/components/ui/button";
import { ArrowsDownUp } from "@phosphor-icons/react";

export default function ColumnHeader(column: any, fieldName: string) {
  return (
    <Button
      variant="ghost"
      className=""
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {fieldName}
      <ArrowsDownUp className="ml-2 h-4 w-4" />
    </Button>
  );
}
