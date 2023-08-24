import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/Icons";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { UserAllResponse } from "@acme/api/src/router/user";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import EditUserForm from "@/components/forms/users/Edit";

type User = UserAllResponse[number]

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "profileImageUrl",
    header: "",
    cell: ({ cell }) => {
      return (
        <Avatar>
          <AvatarImage src={cell.getValue() as string} />
        </Avatar>
      )
    }
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          First Name
          <Icons.chevronUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Last Name
          <Icons.chevronUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    }
  },
  {
    accessorKey: "emailAddresses.0.emailAddress",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Email
          <Icons.chevronUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [editModal, setEditModal] = useState(false)
      const user = row.original

      return (
        <Dialog open={editModal} onOpenChange={setEditModal}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <Icons.horizontalThreeDots className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setEditModal(true)}>
                <Icons.edit
                  className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                  aria-hidden="true"
                />
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {editModal && <EditUserForm user={user} open={editModal} setIsOpen={setEditModal} />}
        </Dialog>
      )
    }
  }
]
