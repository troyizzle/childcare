import DataTable from "@/components/DataTable";
import { Icons } from "@/components/Icons";
import { columns } from "@/components/admin/students/Columns";
import NewStudentForm from "@/components/forms/students/New";
import AdminLayout from "@/layouts/Admin";
import { trpc } from "@/utils/trpc";
import { GetServerSideProps } from "next"
import { getAuth } from "@clerk/nextjs/server"

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
