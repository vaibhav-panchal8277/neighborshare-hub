import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PackageSearch } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[60vh] py-20 text-center">
      <div className="bg-muted p-6 rounded-full mb-6">
        <PackageSearch className="h-16 w-16 text-muted-foreground" />
      </div>
      
      <h1 className="text-4xl font-bold font-heading mb-4">Item Not Found</h1>
      <p className="text-muted-foreground text-lg mb-8 max-w-md">
        We couldn&apos;t find the page or item you were looking for. It might have been removed, rented out, or the link is broken.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/browse">
          <Button size="lg" className="w-full sm:w-auto">
            Browse Available Items
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
