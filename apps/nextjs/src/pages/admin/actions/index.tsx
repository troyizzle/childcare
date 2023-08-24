import { columns } from "@/components/admin/actions/Columns";
import DataTable from "@/components/DataTable";
import NewActionForm from "@/components/forms/actions/New";
import { Icons } from "@/components/Icons";
import AdminLayout from "@/layouts/Admin";
import { trpc } from "@/utils/trpc";

export default function Page() {
  const actionQuery = trpc.action.all.useQuery();

  return (
    <AdminLayout title="Actions" createForm={<NewActionForm />}>
      {actionQuery.isLoading && <Icons.spinner className="animate-spin h-5 w-5 text-blue-500" />}
      {actionQuery.data && <DataTable data={actionQuery.data} columns={columns} />}
    </AdminLayout>
  )
}
