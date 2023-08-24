import { columns } from "@/components/admin/users/Columns";
import DataTable from "@/components/DataTable";
import { Icons } from "@/components/Icons";
import AdminLayout from "@/layouts/Admin";
import { trpc } from "@/utils/trpc";

export default function Page() {
  const userQuery = trpc.user.all.useQuery();

  return (
    <AdminLayout title="Users">
      {userQuery.isLoading && <Icons.spinner className="animate-spin h-4 w-4 text-blue-500" />}
      {userQuery.data && <DataTable data={userQuery.data} columns={columns} />}
    </AdminLayout>
  )
}
