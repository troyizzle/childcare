import { columns } from "@/components/admin/actions/Columns";
import DataTable from "@/components/DataTable";
import NewActionForm from "@/components/forms/actions/New";
import { Icons } from "@/components/Icons";
import AdminLayout from "@/layouts/Admin";
import { trpc } from "@/utils/trpc";
import { getAuth } from "@clerk/nextjs/server";
import { GetServerSideProps } from "next";

export default function Page() {
  const actionQuery = trpc.action.all.useQuery();

  return (
    <AdminLayout title="Actions" createForm={<NewActionForm />}>
      {actionQuery.isLoading && <Icons.spinner className="animate-spin h-5 w-5 text-blue-500" />}
      {actionQuery.data && <DataTable data={actionQuery.data} columns={columns} />}
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
