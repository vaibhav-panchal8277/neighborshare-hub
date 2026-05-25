"use client"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, PlusCircle, Search } from "lucide-react"
import Link from "next/link"
import { CONSTANTS } from "@/lib/constants"
import { useState } from "react"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      } />
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <Link href="/" className="flex items-center mb-8" onClick={() => setOpen(false)}>
          <span className="font-heading font-bold text-xl">
            {CONSTANTS.APP_NAME}
          </span>
        </Link>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
            />
          </div>
          <nav className="flex flex-col gap-2 mt-4">
            <Link
              href="/browse"
              className="block px-2 py-1 text-lg font-medium hover:text-primary"
              onClick={() => setOpen(false)}
            >
              Browse Items
            </Link>
            <Link
              href="/how-it-works"
              className="block px-2 py-1 text-lg font-medium hover:text-primary"
              onClick={() => setOpen(false)}
            >
              How it works
            </Link>
            <Link
              href="/dashboard"
              className="block px-2 py-1 text-lg font-medium hover:text-primary"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
          </nav>
          
          <div className="mt-8">
            <Button className="w-full gap-2" onClick={() => setOpen(false)}>
              <PlusCircle className="h-4 w-4" />
              List an Item
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
