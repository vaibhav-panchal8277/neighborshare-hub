import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Calendar, MessageSquare, Star, Settings, ShieldAlert } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isAdmin?: boolean
}

export function Sidebar({ className, isAdmin, ...props }: SidebarProps) {
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      title: "Overview",
      icon: LayoutDashboard,
    },
    {
      href: "/bookings",
      title: "My Bookings",
      icon: Calendar,
    },
    {
      href: "/listings",
      title: "My Listings",
      icon: Package,
    },
    {
      href: "/messages",
      title: "Messages",
      icon: MessageSquare,
    },
    {
      href: "/reviews",
      title: "Reviews",
      icon: Star,
    },
    {
      href: "/settings",
      title: "Settings",
      icon: Settings,
    },
  ]

  const adminRoutes = [
    {
      href: "/admin",
      title: "Admin Panel",
      icon: ShieldAlert,
    }
  ]

  return (
    <div className={cn("pb-12", className)} {...props}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Dashboard
          </h2>
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  buttonVariants({ variant: pathname === route.href ? "secondary" : "ghost" }),
                  "w-full justify-start gap-2"
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.title}
              </Link>
            ))}
            
            {isAdmin && (
              <>
                <div className="my-4 border-t" />
                {adminRoutes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      buttonVariants({ variant: pathname?.startsWith(route.href) ? "secondary" : "ghost" }),
                      "w-full justify-start gap-2 text-destructive hover:text-destructive"
                    )}
                  >
                    <route.icon className="h-4 w-4" />
                    {route.title}
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
