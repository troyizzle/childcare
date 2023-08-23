import DataTable from "@/components/DataTable";
import { Icons } from "@/components/Icons";
import { columns } from "@/components/admin/classrooms/Columns";
import NewClassRoomForm from "@/components/forms/classrooms/New";
import AdminLayout from "@/layouts/Admin";
import { trpc } from "@/utils/trpc";

export default function Page() {
  const classroomQuery = trpc.classroom.all.useQuery(undefined, {
    staleTime: 1000 * 60 * 60 * 24,
  });

  return (
    <AdminLayout title="Classrooms" createForm={<NewClassRoomForm />}>
      {classroomQuery.isFetching && <Icons.spinner className="animate-spin h-5 w-5 text-blue-500" />}
      {classroomQuery.data && (
        <DataTable data={classroomQuery.data} columns={columns} />
      )}
    </AdminLayout>
  )
}
