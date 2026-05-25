import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TrustBadge } from '@/components/shared/trust-badge'
import { ListingCard } from '@/components/listings/listing-card'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Star } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // 1. Fetch the user's public profile
  const { data, error } = await supabase
    .from('public_profiles')
    .select('*')
    .eq('id', params.id)
    .single()

  const profile = data as { id: string, display_name: string, avatar_url: string, created_at: string, bio: string, verification_status: string, trust_score: number } | null

  if (error || !profile) {
    notFound()
  }


  // Wait, let's query the actual listings table and join with public_profiles instead to be accurate, 
  // or better yet, since listing_summaries is a view we can just fetch from it where lender_name matches,
  // but let's do a direct query on listings for accuracy.
  const { data: userListings } = await supabase
    .from('listings')
    .select('*, photos:listing_photos(url)')
    .eq('lender_id', profile.id)
    .eq('status', 'active')

  // 3. Fetch Reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, reviewer:profiles!reviewer_id(id, display_name, avatar_url)')
    .eq('target_id', profile.id)
    .order('created_at', { ascending: false })

  return (
    <div className="container py-10 max-w-5xl">
      <div className="bg-card border rounded-xl p-8 mb-10 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-sm">
        <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
          <AvatarImage src={profile.avatar_url || ''} />
          <AvatarFallback className="text-4xl">{profile.display_name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <h1 className="text-3xl font-bold font-heading">{profile.display_name}</h1>
            <p className="text-muted-foreground mt-1">
              Member since {new Date(profile.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            {profile.verification_status === 'verified' && <TrustBadge type="verified" />}
            {(profile.trust_score ?? 0) >= 80 && <TrustBadge type="top_rated" />}
          </div>
          
          {profile.bio && (
            <p className="max-w-2xl text-muted-foreground mt-4">
              {profile.bio}
            </p>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold font-heading mb-6 mt-12">Listings by {profile.display_name.split(' ')[0]}</h2>
      
      {userListings && userListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(userListings as { id: string, title: string, category: string, condition: string, daily_fee: number, status: string, photos?: { url: string }[] }[]).map((listing) => {
             // Map to the shape expected by ListingCard
             const summary = {
               ...listing,
               lender_name: profile.display_name,
               lender_avatar: profile.avatar_url,
               lender_verification_status: profile.verification_status,
               lender_trust_score: profile.trust_score,
               thumbnail_url: listing.photos?.[0]?.url || null
             }
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
             return <ListingCard key={summary.id} listing={summary as any} />
          })}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-xl bg-muted/30">
          <p className="text-muted-foreground">No active listings available.</p>
        </div>
      )}

      {/* Reviews Section */}
      <h2 className="text-2xl font-bold font-heading mb-6 mt-12 flex items-center gap-2">
        <Star className="h-6 w-6" /> Reviews ({reviews?.length || 0})
      </h2>

      {reviews && reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review: { id: string, reviewer_id: string, rating: number, comment: string, created_at: string, reviewer: { display_name: string, avatar_url: string } }) => (
            <Card key={review.id}>
              <CardHeader className="p-4 pb-2 flex flex-row items-center gap-3 space-y-0">
                <Link href={`/profiles/${review.reviewer_id}`}>
                  <Avatar className="w-10 h-10 hover:ring-2 ring-primary transition-all">
                    <AvatarImage src={review.reviewer.avatar_url || ''} />
                    <AvatarFallback>{review.reviewer.display_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link href={`/profiles/${review.reviewer_id}`} className="font-medium text-sm hover:underline">
                    {review.reviewer.display_name}
                  </Link>
                  <div className="flex items-center mt-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-3 w-3 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted-foreground'}`} 
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <p className="text-sm text-foreground/90">
                  {review.comment || <span className="italic text-muted-foreground">No comment provided.</span>}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(review.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-xl bg-muted/30">
          <Star className="h-10 w-10 mx-auto text-muted-foreground mb-3 opacity-50" />
          <p className="font-medium text-muted-foreground">No reviews yet.</p>
        </div>
      )}
    </div>
  )
}
