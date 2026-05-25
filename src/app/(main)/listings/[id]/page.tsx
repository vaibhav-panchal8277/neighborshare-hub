import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ConditionBadge } from '@/components/shared/condition-badge'
import { TrustBadge } from '@/components/shared/trust-badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MapPin, Calendar, Info, AlertTriangle } from 'lucide-react'
import { BookingWidget } from '@/components/listings/booking-widget'

export const dynamic = 'force-dynamic'

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Fetch the listing details
  const { data: listingData, error: listingError } = await supabase
    .from('listings')
    .select('*')
    .eq('id', params.id)
    .single()

  if (listingError || !listingData) {
    notFound()
  }

  // Fetch photos
  const { data: photosData } = await supabase
    .from('listing_photos')
    .select('*')
    .eq('listing_id', params.id)
    .order('sort_order', { ascending: true })
  
  const photos = (photosData as { url: string }[]) || []

  // Fetch the lender details from the public_profiles view (safe for all users to read)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listing = listingData as any
  const { data: lenderData } = await supabase
    .from('public_profiles')
    .select('id, display_name, avatar_url, trust_score, verification_status')
    .eq('id', listing.lender_id)
    .single()

  // Fetch availability blocks to prevent double-booking
  const { data: availabilityBlocksData } = await supabase
    .from('availability_blocks')
    .select('start_date, end_date')
    .eq('listing_id', params.id)
    .gte('end_date', new Date().toISOString().split('T')[0]) // only future or current blocks
  
  const availabilityBlocks = availabilityBlocksData || []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lender = (lenderData as any) || {
    id: listing.lender_id,
    display_name: 'Unknown User',
    avatar_url: null,
    trust_score: 0,
    verification_status: 'unverified'
  }

  return (
    <div className="container py-10 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="capitalize">
                {listing.category}
              </Badge>
              <ConditionBadge condition={listing.condition} />
              {listing.skill_share && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                  Skill Share Available
                </Badge>
              )}
            </div>
            <h1 className="text-4xl font-bold font-heading mb-2">{listing.title}</h1>
            <div className="flex items-center text-muted-foreground gap-4 text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{listing.address_hint || 'Local Neighborhood'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Listed on {new Date(listing.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="aspect-video w-full bg-muted rounded-xl flex items-center justify-center border overflow-hidden relative">
             {photos.length > 0 ? (
               <Image 
                 src={photos[0].url} 
                 alt={listing.title} 
                 fill 
                 className="object-cover" 
                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                 priority
               />
             ) : (
               <div className="text-muted-foreground flex flex-col items-center">
                 <Info className="h-10 w-10 mb-2 opacity-50" />
                 <p>No images available</p>
               </div>
             )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 font-heading">Description</h2>
            <div className="prose dark:prose-invert max-w-none text-muted-foreground">
              {listing.description.split('\n').map((paragraph: string, idx: number) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>

          {listing.rules && listing.rules.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 font-heading">Rules & Requirements</h2>
              <ul className="space-y-2">
                {listing.rules.map((rule: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {listing.skill_share && listing.skill_share_description && (
            <div className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-xl border border-purple-100 dark:border-purple-900/20">
              <h2 className="text-xl font-semibold mb-2 font-heading text-purple-900 dark:text-purple-300">
                Skill Share Offered
              </h2>
              <p className="text-purple-800 dark:text-purple-400">
                {listing.skill_share_description}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar / Actions */}
        <div className="space-y-6">
          <div className="border rounded-xl p-6 sticky top-24 bg-card shadow-sm">
            <div className="mb-6">
              {listing.pricing_type === 'free' && (
                <div className="text-3xl font-bold">Free</div>
              )}
              {listing.pricing_type === 'daily_fee' && (
                <div className="text-3xl font-bold">${listing.daily_fee}<span className="text-sm font-normal text-muted-foreground"> / day</span></div>
              )}
              {listing.pricing_type === 'deposit_only' && (
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">Refundable Deposit</div>
              )}
              
              {listing.deposit_amount && listing.deposit_amount > 0 && (
                <div className="text-sm text-muted-foreground mt-2">
                  Requires a ${listing.deposit_amount} security deposit
                </div>
              )}
            </div>

            <BookingWidget listing={listing} availabilityBlocks={availabilityBlocks} />

            <hr className="my-6" />

            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Lender</h3>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border">
                  <AvatarImage src={lender.avatar_url || ''} />
                  <AvatarFallback>{lender.display_name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium truncate max-w-[200px]">{lender.display_name}</div>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {lender.verification_status === 'verified' && <TrustBadge type="verified" />}
                    {(lender.trust_score ?? 0) >= 80 && <TrustBadge type="top_rated" />}
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <Link href={`/profiles/${lender.id}`} className="block">
                  <Button variant="outline" className="w-full">View Profile</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
