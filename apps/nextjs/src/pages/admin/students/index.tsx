import DataTable from "@/components/DataTable";
import { Icons } from "@/components/Icons";
import { columns } from "@/components/admin/students/Columns";
import NewStudentForm from "@/components/forms/students/New";
import AdminLayout from "@/layouts/Admin";
import { trpc } from "@/utils/trpc";

export default function Page() {
  const studentQuery = trpc.student.all.useQuery(undefined, {
    staleTime: 1000 * 60 * 60 * 24,
  });

  return (
    <AdminLayout title="Students" createForm={<NewStudentForm />}>
      {studentQuery.isFetching && <Icons.spinner className="animate-spin h-5 w-5 text-blue-500" />}
      {studentQuery.data && (
        <DataTable data={studentQuery.data} columns={columns} />
      )}
    </AdminLayout>
  )
}
