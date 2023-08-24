import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/Icons";
import { Action } from "@acme/db";

export const columns: ColumnDef<Action>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Name
          <Icons.chevronUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  }
]
