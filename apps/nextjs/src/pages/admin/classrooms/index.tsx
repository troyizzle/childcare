import DataTable from "@/components/DataTable";
import { Icons } from "@/components/Icons";
import { columns } from "@/components/admin/classrooms/Columns";
import NewClassRoomForm from "@/components/forms/classrooms/New";
import AdminLayout from "@/layouts/Admin";
import { trpc } from "@/utils/trpc";
import { getAuth } from "@clerk/nextjs/server";
import { GetServerSideProps } from "next";

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

export const getServerSideProps: GetServerSideProps<{ userId: string }> = async (context) => {
  const { userId } = getAuth(context.req);

  if (!userId) {
    return {
      redirect: {
        destination: '/sign-in?forwardTo=/admin/students',
        permanent: false,
      },
    }
  }

  const roles = await prisma?.userRole.findMany({
    where: { userId: userId },
    select: {
      role: true
    }
  })

  if (!roles || !roles.find(role => role.role.name.toLowerCase() === 'admin')) {
    return {
      redirect: {
        destination: '/?errorMessage=You are not an admin',
        permanent: false,
      },
    }
  }

  return {
    props: {
      userId
    }
  }
}
