import Link from "next/link"
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
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <MobileNav />
          <Link href="/" className="hidden md:flex items-center space-x-2">
            <span className="font-heading font-bold sm:inline-block">
              {CONSTANTS.APP_NAME}
            </span>
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

        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full max-w-sm hidden md:flex items-center relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search tools, gear, etc..."
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
            />
          </div>

          <nav className="flex items-center space-x-2">
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
                  <Button size="sm" className="gap-1">
                    <PlusCircle className="h-4 w-4" />
                    List an Item
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger render={
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
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
