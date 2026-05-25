import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, MessageCircle, Package, PauseCircle, PlayCircle, Trash2, Pencil, PlusCircle, CreditCard, CheckCircle } from "lucide-react"
import { approveBooking, rejectBooking } from "@/app/actions/dashboard-actions"
import { RazorpayCheckoutButton } from "@/components/listings/razorpay-checkout-button"
import { pauseListing, activateListing, deleteListing } from "@/app/actions/my-listings-actions"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ChatWindow } from "@/components/messaging/chat-window"
import { ReviewDialog } from "@/components/reviews/review-dialog"

// Bound server actions that accept FormData
async function handleApprove(formData: FormData) {
  "use server"
  const bookingId = formData.get("bookingId") as string
  await approveBooking(bookingId)
}

async function handleReject(formData: FormData) {
  "use server"
  const bookingId = formData.get("bookingId") as string
  await rejectBooking(bookingId)
}

async function handlePause(formData: FormData) {
  "use server"
  await pauseListing(formData.get("listingId") as string)
}

async function handleActivate(formData: FormData) {
  "use server"
  await activateListing(formData.get("listingId") as string)
}

async function handleDelete(formData: FormData) {
  "use server"
  await deleteListing(formData.get("listingId") as string)
}

export const dynamic = 'force-dynamic'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { tab?: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const defaultTab = searchParams.tab || 'borrowing'

  // Fetch profiles for razorpay account check
  const { data: profileData } = await supabase
    .from('profiles')
    .select('razorpay_account_id')
    .eq('id', user.id)
    .single()
  const profile = profileData as { razorpay_account_id: string | null } | null

  // Fetch bookings where user is borrower
  const { data: borrowedData } = await supabase
    .from('bookings')
    .select('*, listing:listings(*)')
    .eq('borrower_id', user.id)
    .order('created_at', { ascending: false })

  // Fetch bookings where user is lender
  const { data: lentData } = await supabase
    .from('bookings')
    .select('*, listing:listings(*)')
    .eq('lender_id', user.id)
    .order('created_at', { ascending: false })

  // Collect all user IDs we need to fetch profiles for
  const userIds = new Set<string>()
  ;(borrowedData as { lender_id: string }[] | null)?.forEach(b => userIds.add(b.lender_id))
  ;(lentData as { borrower_id: string }[] | null)?.forEach(b => userIds.add(b.borrower_id))

  let profilesMap: Record<string, { id: string, display_name: string, avatar_url: string }> = {}
  if (userIds.size > 0) {
    const { data } = await supabase
      .from('public_profiles')
      .select('id, display_name, avatar_url')
      .in('id', Array.from(userIds))
      
    const profiles = data as { id: string, display_name: string, avatar_url: string }[] | null
    
    if (profiles) {
      profilesMap = profiles.reduce((acc, p) => {
        acc[p.id] = p
        return acc
      }, {} as Record<string, { id: string, display_name: string, avatar_url: string }>)
    }
  }

  // Fetch reviews this user has already written (to avoid duplicate review buttons)
  const { data: myReviews } = await supabase
    .from('reviews')
    .select('booking_id')
    .eq('reviewer_id', user.id)
  const reviewedBookingIds = new Set(((myReviews as { booking_id: string }[]) || []).map(r => r.booking_id))

  // Fetch user's own listings
  const { data: myListings } = await supabase
    .from('listings')
    .select('*, listing_photos(*), bookings(id, status)')
    .eq('lender_id', user.id)
    .order('created_at', { ascending: false })

  // Helper to format dates
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }

  // Component for Booking Card
  const BookingCard = ({ booking, isBorrower }: { booking: { id: string, lender_id: string, borrower_id: string, status: string, start_date: string, end_date: string, total_amount: number, listing: { title: string, address_hint: string } }, isBorrower: boolean }) => {
    const otherUser = profilesMap[isBorrower ? booking.lender_id : booking.borrower_id]
    const listing = booking.listing

    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-heading">{listing?.title || 'Unknown Item'}</CardTitle>
              <CardDescription className="mt-1">
                {isBorrower ? 'Borrowing from ' : 'Lending to '}
                <span className="font-semibold">{otherUser?.display_name || 'Unknown User'}</span>
              </CardDescription>
            </div>
            <Badge className={`capitalize ${
              booking.status === 'completed' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
              booking.status === 'approved' ? 'bg-blue-100 text-blue-800 border-blue-200' :
              booking.status === 'requested' ? 'bg-orange-100 text-orange-800 border-orange-200' :
              booking.status === 'pending_pickup' ? 'bg-purple-100 text-purple-800 border-purple-200' : ''
            }`}>
              {booking.status.replace(/_/g, ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(booking.start_date)} - {formatDate(booking.end_date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{listing?.address_hint || 'Local Neighborhood'}</span>
            </div>
            <div className="mt-2 font-medium text-foreground">
              Total: ${booking.total_amount}
            </div>
          </div>
        </CardContent>
        <CardFooter className="gap-3 justify-end">
            
            <Sheet>
              <SheetTrigger render={<Button variant="outline" size="sm" className="gap-2" />}>
                <MessageCircle className="h-4 w-4" />
                <span>Message</span>
              </SheetTrigger>
              <SheetContent side="right" className="w-[100vw] sm:min-w-[450px] p-0 border-none bg-background shadow-2xl">
                <div className="h-full pt-14 pb-4 px-4 bg-muted/20">
                   <ChatWindow 
                      bookingId={booking.id} 
                      currentUserId={user.id} 
                      otherUserName={otherUser?.display_name || 'User'} 
                      otherUserAvatar={otherUser?.avatar_url || ''} 
                   />
                </div>
              </SheetContent>
            </Sheet>

            {/* LENDER ACTIONS */}
            {!isBorrower && booking.status === 'requested' && (
              <div className="flex gap-2">
                <form action={handleReject}>
                  <input type="hidden" name="bookingId" value={booking.id} />
                  <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" type="submit">Reject</Button>
                </form>
                <form action={handleApprove}>
                  <input type="hidden" name="bookingId" value={booking.id} />
                  <Button size="sm" type="submit">Approve Request</Button>
                </form>
              </div>
            )}

            {/* BORROWER ACTIONS */}
            {isBorrower && booking.status === 'approved' && (
              <RazorpayCheckoutButton bookingId={booking.id} />
            )}

            {booking.status === 'pending_pickup' && (
              <Button size="sm" variant="secondary" disabled>Awaiting Pickup</Button>
            )}

            {booking.status === 'requested' && isBorrower && (
              <Button size="sm" variant="secondary" disabled>Awaiting Approval</Button>
            )}

            {/* REVIEW on completed bookings */}
            {booking.status === 'completed' && (
              <ReviewDialog
                bookingId={booking.id}
                targetId={isBorrower ? booking.lender_id : booking.borrower_id}
                targetName={otherUser?.display_name || 'User'}
                existingReview={reviewedBookingIds.has(booking.id)}
              />
            )}

        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="container py-10 max-w-5xl">
      <h1 className="text-4xl font-bold font-heading mb-8">Dashboard</h1>

      <Tabs defaultValue={defaultTab} className="w-full" key={defaultTab}>
        <TabsList className="grid w-full grid-cols-4 max-w-lg mb-8">
          <TabsTrigger value="borrowing">Borrowing</TabsTrigger>
          <TabsTrigger value="lending">Lending</TabsTrigger>
          <TabsTrigger value="my-listings">My Listings</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="borrowing" className="space-y-6">
          {borrowedData && borrowedData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(borrowedData as { id: string, lender_id: string, borrower_id: string, status: string, start_date: string, end_date: string, total_amount: number, listing: { title: string, address_hint: string } }[]).map(b => <BookingCard key={b.id} booking={b} isBorrower={true} />)}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-xl bg-muted/30">
              <p className="text-muted-foreground">You haven&apos;t requested to borrow anything yet.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="lending" className="space-y-6">
          {lentData && lentData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(lentData as { id: string, lender_id: string, borrower_id: string, status: string, start_date: string, end_date: string, total_amount: number, listing: { title: string, address_hint: string } }[]).map(b => <BookingCard key={b.id} booking={b} isBorrower={false} />)}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-xl bg-muted/30">
              <p className="text-muted-foreground">You don&apos;t have any incoming requests yet.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-listings" className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-muted-foreground text-sm">{myListings?.length || 0} listing{myListings?.length !== 1 ? 's' : ''}</p>
            <a href="/listings/new">
              <Button size="sm" className="gap-2">
                <PlusCircle className="h-4 w-4" />
                New Listing
              </Button>
            </a>
          </div>

          {myListings && myListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myListings.map((listing: { id: string, title: string, category: string, daily_fee: number, status: string, listing_photos: { url: string }[], bookings: { status: string }[] }) => {
                const photo = listing.listing_photos?.[0]?.url
                const activeBookings = listing.bookings?.filter((b: { status: string }) => ['requested','approved','pending_pickup'].includes(b.status)).length || 0
                const isActive = listing.status === 'active'

                return (
                  <Card key={listing.id}>
                    <div className="flex gap-4 p-4">
                      {/* Thumbnail */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-muted">
                        {photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={photo} alt={listing.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-sm leading-tight line-clamp-2">{listing.title}</h3>
                          <Badge className={`shrink-0 text-xs capitalize ${
                            isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {listing.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{listing.category}</p>
                        <p className="text-sm font-medium mt-1">${listing.daily_fee}/day</p>
                        {activeBookings > 0 && (
                          <p className="text-xs text-blue-600 mt-1">{activeBookings} active booking{activeBookings > 1 ? 's' : ''}</p>
                        )}
                      </div>
                    </div>

                    <CardFooter className="gap-2 justify-end border-t">
                      {/* View */}
                      <a href={`/listings/${listing.id}`}>
                        <Button size="sm" variant="ghost" className="gap-1">
                          View
                        </Button>
                      </a>

                      {/* Edit */}
                      <a href={`/listings/${listing.id}/edit`}>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                      </a>

                      {/* Pause / Activate */}
                      {isActive ? (
                        <form action={handlePause}>
                          <input type="hidden" name="listingId" value={listing.id} />
                          <Button size="sm" variant="outline" type="submit" className="gap-1 text-orange-600 border-orange-200 hover:bg-orange-50">
                            <PauseCircle className="h-3.5 w-3.5" />
                            Pause
                          </Button>
                        </form>
                      ) : (
                        <form action={handleActivate}>
                          <input type="hidden" name="listingId" value={listing.id} />
                          <Button size="sm" variant="outline" type="submit" className="gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                            <PlayCircle className="h-3.5 w-3.5" />
                            Activate
                          </Button>
                        </form>
                      )}

                      {/* Delete — only if no active bookings */}
                      {activeBookings === 0 && (
                        <form action={handleDelete}>
                          <input type="hidden" name="listingId" value={listing.id} />
                          <Button size="sm" variant="ghost" type="submit" className="gap-1 text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </form>
                      )}
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16 border rounded-xl bg-muted/30">
              <Package className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="font-medium">No listings yet</p>
              <p className="text-muted-foreground text-sm mt-1">Share something with your neighbors!</p>
              <a href="/listings/new" className="mt-4 inline-block">
                <Button size="sm" className="gap-2 mt-3">
                  <PlusCircle className="h-4 w-4" />
                  Create Your First Listing
                </Button>
              </a>
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Receive Payouts (Razorpay)</CardTitle>
              <CardDescription>Connect your bank account via Razorpay Route to receive payouts when people borrow your items.</CardDescription>
            </CardHeader>
            <CardContent>
              {profile?.razorpay_account_id ? (
                <div className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-md border border-green-200">
                  <CheckCircle className="h-5 w-5" />
                  <span>Your Razorpay account is connected and ready to receive payouts!</span>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-amber-50 text-amber-700 rounded-md border border-amber-200">
                  <CreditCard className="h-5 w-5" />
                  <span>Razorpay Vendor Onboarding will be available in the next release! All payouts are currently processed manually.</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}
