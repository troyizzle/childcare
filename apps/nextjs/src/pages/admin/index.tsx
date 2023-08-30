import AdminLayout from "@/layouts/Admin";
import { getAuth } from "@clerk/nextjs/server";
import { GetServerSideProps } from "next";
import { prisma } from "@acme/db";

export default function Page() {
  return <AdminLayout title="Dashboard">Dashboard</AdminLayout>;
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

  if (!roles || !roles.find(({ role }) => role.name.toLowerCase() === 'admin')) {
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
