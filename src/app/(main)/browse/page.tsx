import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { ListingCard } from '@/components/listings/listing-card'
import { SkeletonCard } from '@/components/shared/skeleton-card'
import { EmptyState } from '@/components/shared/empty-state'
import { AlertCircle, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function ListingsGrid({ category, query: searchQuery }: { category?: string, query?: string }) {
  const supabase = createClient()
  
  let query = supabase
    .from('listing_summaries')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (category && category !== 'all') {
    query = query.ilike('category', category)
  }

  if (searchQuery) {
    query = query.ilike('title', `%${searchQuery}%`)
  }

  const { data: listings, error } = await query

  if (error) {
    return (
      <EmptyState
        title="Failed to load listings"
        description="There was an error connecting to the database. Please try again later."
        icon={AlertCircle}
      />
    )
  }

  if (!listings || listings.length === 0) {
    return (
      <EmptyState
        title="No listings found"
        description={
          category && category !== 'all'
            ? `We couldn't find any active listings in the ${category} category.`
            : "There are no active listings available right now."
        }
        icon={Search}
        action={
          <Link href="/listings/new">
            <Button>Be the first to list an item</Button>
          </Link>
        }
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {(listings as any[]).map((listing: any) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}

export default function BrowsePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const category = typeof searchParams.category === 'string' ? searchParams.category : 'all'
  const q = typeof searchParams.q === 'string' ? searchParams.q : ''

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading">
            Browse Items
          </h1>
          <p className="text-muted-foreground mt-2">
            Discover tools, equipment, and gear available in your neighborhood.
          </p>
        </div>
        
        {/* Search Bar */}
        <form className="flex w-full md:max-w-sm items-center gap-2" action="/browse" method="GET">
          {category !== 'all' && <input type="hidden" name="category" value={category} />}
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              name="q" 
              placeholder="Search items..." 
              className="pl-9 w-full"
              defaultValue={q}
            />
          </div>
          <Button type="submit" size="sm" variant="secondary">Search</Button>
        </form>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {['all', 'tools', 'electronics', 'sports', 'kitchen', 'party', 'other'].map((cat) => (
          <a
            key={cat}
            href={`/browse?category=${cat}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
            className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
              category === cat
                ? 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80'
                : 'text-foreground hover:bg-muted'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </a>
        ))}
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        }
      >
        <ListingsGrid category={category} query={q} />
      </Suspense>
    </div>
  )
}
