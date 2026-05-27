import Link from "next/link"
import Image from "next/image"
import { CONSTANTS } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-10 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center -ml-5 -mt-12">
              <Image
                src="/logo.png"
                alt={CONSTANTS.APP_NAME}
                width={1200}
                height={1000}
                className="h-32 w-auto object-contain object-left"
              />
            </Link>
            <p className="-mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Borrow what you need, lend what you don&apos;t. Build a stronger, more sustainable neighborhood.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Explore</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/browse" className="hover:text-primary">Browse All</Link></li>
              <li><Link href="/categories" className="hover:text-primary">Categories</Link></li>
              <li><Link href="/how-it-works" className="hover:text-primary">How it Works</Link></li>
              <li><Link href="/trust" className="hover:text-primary">Trust & Safety</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Company</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
              <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-8 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} {CONSTANTS.APP_NAME}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-primary">Twitter</Link>
            <Link href="#" className="hover:text-primary">Instagram</Link>
            <Link href="#" className="hover:text-primary">Facebook</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
