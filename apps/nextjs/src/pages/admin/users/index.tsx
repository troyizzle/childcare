import { columns } from "@/components/admin/users/Columns";
import DataTable from "@/components/DataTable";
import { Icons } from "@/components/Icons";
import AdminLayout from "@/layouts/Admin";
import { trpc } from "@/utils/trpc";
import { getAuth } from "@clerk/nextjs/server";
import { GetServerSideProps } from "next";
import { prisma } from "@acme/db";

export default function Page() {
  const userQuery = trpc.user.all.useQuery();

  return (
    <AdminLayout title="Users">
      {userQuery.isLoading && <Icons.spinner className="animate-spin h-4 w-4 text-blue-500" />}
      {userQuery.data && <DataTable data={userQuery.data} columns={columns} />}
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

  const roles = await prisma.userRole.findMany({
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
