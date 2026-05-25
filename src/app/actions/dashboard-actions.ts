"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function approveBooking(bookingId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not logged in")

  // Verify the user is the lender of this booking
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('lender_id, borrower_id, listing:listings(title)')
    .eq('id', bookingId)
    .single()

  const typedBooking = booking as { lender_id: string, borrower_id: string, listing: { title: string } } | null
  if (fetchError || !typedBooking) throw new Error("Booking not found")
  if (typedBooking.lender_id !== user.id) throw new Error("Unauthorized")

  const { error: updateError } = await supabase
    .from('bookings')
    .update({ status: 'approved' } as never)
    .eq('id', bookingId)

  if (updateError) throw new Error("Failed to approve booking")

  // Notify borrower
  await supabase
    .from('notifications')
    .insert({
      user_id: typedBooking.borrower_id,
      title: 'Booking Approved',
      message: `Your request to borrow ${typedBooking.listing?.title || 'an item'} was approved!`,
      type: 'booking_approved',
      link_url: '/dashboard?tab=borrowing'
    } as never)

  revalidatePath('/dashboard')
}

export async function rejectBooking(bookingId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not logged in")

  // Verify the user is the lender of this booking
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('lender_id, borrower_id, listing:listings(title)')
    .eq('id', bookingId)
    .single()

  const typedBooking2 = booking as { lender_id: string, borrower_id: string, listing: { title: string } } | null
  if (fetchError || !typedBooking2) throw new Error("Booking not found")
  if (typedBooking2.lender_id !== user.id) throw new Error("Unauthorized")

  // Update booking status to rejected
  const { error: updateError } = await supabase
    .from('bookings')
    .update({ status: 'rejected' } as never)
    .eq('id', bookingId)

  if (updateError) throw new Error("Failed to reject booking")

  // Delete the availability block
  await supabase
    .from('availability_blocks')
    .delete()
    .eq('booking_id', bookingId)

  // Notify borrower
  await supabase
    .from('notifications')
    .insert({
      user_id: typedBooking2.borrower_id,
      title: 'Booking Declined',
      message: `Your request to borrow ${typedBooking2.listing?.title || 'an item'} was declined.`,
      type: 'booking_rejected',
      link_url: '/dashboard?tab=borrowing'
    } as never)

  revalidatePath('/dashboard')
}

export async function mockCheckout(bookingId: string, amount: number) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not logged in")

  // Verify the user is the borrower
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('borrower_id, total_amount')
    .eq('id', bookingId)
    .single()

  const typedBooking3 = booking as { borrower_id: string, total_amount: number } | null
  if (fetchError || !typedBooking3) throw new Error("Booking not found")
  if (typedBooking3.borrower_id !== user.id) throw new Error("Unauthorized")

  // Mock payment success
  const { error: paymentError } = await supabase
    .from('payments')
    .insert({
      booking_id: bookingId,
      amount: amount,
      currency: 'usd',
      status: 'released',
      type: 'rental_fee'
    } as never)

  if (paymentError) throw new Error("Failed to record payment")

  const { error: updateError } = await supabase
    .from('bookings')
    .update({ status: 'pending_pickup' } as never)
    .eq('id', bookingId)

  if (updateError) throw new Error("Failed to update booking status")

  revalidatePath('/dashboard')
}
