"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createBookingRequest(
  listingId: string, 
  lenderId: string,
  startDate: string, 
  endDate: string,
  totalAmount: number,
  depositAmount: number,
  message?: string
) {
  const supabase = createClient()

  // 1. Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error("You must be logged in to request a booking.")
  }

  if (user.id === lenderId) {
    throw new Error("You cannot borrow your own item.")
  }

  // 2. Check for overlapping availability blocks
  // An overlap occurs if an existing block's start_date <= requested endDate AND end_date >= requested startDate
  const { data: overlappingBlocks, error: checkError } = await supabase
    .from('availability_blocks')
    .select('id')
    .eq('listing_id', listingId)
    .lte('start_date', endDate)
    .gte('end_date', startDate)
    
  if (checkError) {
    throw new Error("Failed to check availability.")
  }

  if (overlappingBlocks && overlappingBlocks.length > 0) {
    throw new Error("These dates are no longer available.")
  }

  // 3. Create the booking request
  const { data: booking, error: insertError } = await supabase
    .from('bookings')
    .insert({
      listing_id: listingId,
      borrower_id: user.id,
      lender_id: lenderId,
      start_date: startDate,
      end_date: endDate,
      status: 'requested',
      total_amount: totalAmount,
      deposit_held: depositAmount,
      message: message || null
    } as never)
    .select()
    .single()

  if (insertError || !booking) {
    console.error("Booking creation error:", insertError)
    throw new Error("Failed to create booking request.")
  }

  // 4. Create an availability block for these dates so others can't book it while it's pending
  // We mark it as is_blocked = false for now until approved, or we can just block it
  await supabase
    .from('availability_blocks')
    .insert({
      listing_id: listingId,
      start_date: startDate,
      end_date: endDate,
      is_blocked: true,
      booking_id: (booking as { id: string }).id,
      reason: 'pending_booking'
    } as never)

  // 5. Create a notification for the lender
  await supabase
    .from('notifications')
    .insert({
      user_id: lenderId,
      title: 'New Booking Request',
      message: `${user.email || 'Someone'} requested to borrow your item.`,
      type: 'booking_request',
      link_url: '/dashboard?tab=lending'
    } as never)

  // 6. Revalidate and redirect
  revalidatePath(`/listings/${listingId}`)
  redirect(`/dashboard?tab=borrowing`)
}
