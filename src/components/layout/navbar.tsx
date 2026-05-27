import Link from "next/link"
import Image from "next/image"
import { Search, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MobileNav } from "./mobile-nav"
import { NotificationBell } from "./notification-bell"
import { CONSTANTS } from "@/lib/constants"
import { createClient } from "@/lib/supabase/server"
import { signout } from "@/app/(auth)/actions"
export async function Navbar() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let profile: any = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  const initial = profile?.display_name ? profile.display_name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-6 md:gap-10">
          <MobileNav />
          <Link href="/" className="flex items-center -ml-4 -mr-4 sm:-ml-6 sm:-mr-6">
            <Image
              src="/logo.png"
              alt={CONSTANTS.APP_NAME}
              width={2400}
              height={2000}
              className="h-24 sm:h-32 md:h-40 w-auto object-contain -translate-y-0.5 md:-translate-y-1"
              priority
            />
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/browse"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Browse
            </Link>
            <Link
              href="/how-it-works"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              How it works
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="w-full max-w-xs hidden md:flex items-center relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search tools, gear, etc..."
              className="flex h-9 w-full rounded-full border border-input/50 bg-muted/40 hover:bg-muted/60 hover:border-input px-3 py-1 text-sm transition-all placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:bg-background pl-9 shadow-sm"
            />
          </div>

          <nav className="flex items-center gap-3">
            {!user ? (
              <>
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign up</Button>
                </Link>
              </>
            ) : (
              <>
                <NotificationBell />
                <Link href="/listings/new" className="hidden md:flex">
                  <Button className="gap-1.5 shadow-sm h-9">
                    <PlusCircle className="h-4 w-4" />
                    List an Item
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger render={
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full flex items-center justify-center p-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url || ""} alt="@user" />
                        <AvatarFallback>{initial}</AvatarFallback>
                      </Avatar>
                    </Button>
                  } />
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{profile?.display_name || 'Neighbor'}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem render={<Link href="/dashboard">Dashboard</Link>} />
                      <DropdownMenuItem render={<Link href="/dashboard?tab=borrowing">My Bookings</Link>} />
                      <DropdownMenuItem render={<Link href="/dashboard?tab=lending">My Listings</Link>} />
                      <DropdownMenuItem render={<Link href="/dashboard?tab=settings">Settings</Link>} />
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <form action={signout}>
                      <DropdownMenuItem render={<button type="submit" className="w-full text-left cursor-pointer">Log out</button>} />
                    </form>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
