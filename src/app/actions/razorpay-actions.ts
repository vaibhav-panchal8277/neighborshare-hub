"use server"

import { createClient } from "@/lib/supabase/server"
import Razorpay from "razorpay"
import crypto from "crypto"
import { revalidatePath } from "next/cache"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
})

export async function createRazorpayOrder(bookingId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not logged in")

  const { data: booking } = await supabase
    .from('bookings')
    .select('*, listing:listings(*)')
    .eq('id', bookingId)
    .single()

  const typedBooking = booking as { id: string, borrower_id: string, total_amount: number, listing: { title: string } } | null
  if (!typedBooking) throw new Error("Booking not found")
  if (typedBooking.borrower_id !== user.id) throw new Error("Unauthorized")

  // Convert dollars to rupees roughly or just use cents logic but for INR (paise)
  // Razorpay expects amount in the smallest currency subunit (paise)
  const amountInPaise = Math.round(typedBooking.total_amount * 100)

  const options = {
    amount: amountInPaise,
    currency: "INR",
    receipt: `rcpt_${typedBooking.id.substring(0, 8)}`,
  }

  const order = await razorpay.orders.create(options)

  if (!order || !order.id) {
    throw new Error("Failed to create Razorpay order")
  }

  // Save order ID
  await supabase
    .from('bookings')
    .update({ razorpay_order_id: order.id } as never)
    .eq('id', bookingId)

  return {
    orderId: order.id,
    amount: amountInPaise,
    currency: "INR",
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
    listingTitle: typedBooking.listing.title,
    userName: user.user_metadata?.display_name || user.email,
    userEmail: user.email,
  }
}

export async function verifyRazorpayPayment(
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
  bookingId: string
) {
  const supabase = createClient()
  
  const body = razorpay_order_id + "|" + razorpay_payment_id
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(body.toString())
    .digest("hex")

  const isAuthentic = expectedSignature === razorpay_signature

  if (!isAuthentic) {
    throw new Error("Invalid signature")
  }

  // Payment is authentic, update DB
  await supabase
    .from('bookings')
    .update({ status: 'pending_pickup' } as never)
    .eq('id', bookingId)

  await supabase
    .from('payments')
    .insert({
      booking_id: bookingId,
      amount: 0, // In a real app we'd save the actual amount
      currency: 'INR',
      status: 'released',
      type: 'rental_fee'
    } as never)

  revalidatePath('/dashboard')
  return { success: true }
}
