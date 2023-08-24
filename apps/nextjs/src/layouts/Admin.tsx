import { useRouter } from "next/router"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import Navbar from "@/components/Navbar"
import { Icons } from "@/components/Icons"

function SidebarNavMenu() {
  const pathname = useRouter().pathname

  const sidebarNavItems = [
    {
      href: "/admin/actions",
      label: "Actions",
      icon: <Icons.cloudLightning className="h-5 w-5" />
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: <Icons.user className="h-5 w-5" />
    },
    {
      href: "/admin/students",
      label: "Students",
      icon: <Icons.baby className="h-5 w-5" />
    },
    {
      href: "/admin/classrooms",
      label: "Classroom",
      icon: <Icons.school className="h-5 w-5" />
    },
  ]

  return (
    <nav
      className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1"
    >
      {sidebarNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )}
        >
          {item.icon} <span className="ml-2">{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}

type AdminLayoutProps = {
  title: string;
  children: React.ReactNode;
  createForm?: React.ReactNode;
};

export default function AdminLayout({ title, children, createForm }: AdminLayoutProps) {
  return (
    <>
      <Navbar />
      <div className="space-y-6 p-10 pb-16">
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/6">
            <SidebarNavMenu />
          </aside>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">{title}</h1>
              {createForm && createForm}
            </div>
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

