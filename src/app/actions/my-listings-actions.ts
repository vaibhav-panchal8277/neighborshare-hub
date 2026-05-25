"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"


export async function pauseListing(listingId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not logged in")

  const { error } = await supabase
    .from("listings")
    .update({ status: "paused" } as never)
    .eq("id", listingId)
    .eq("lender_id", user.id) // Security: only own listings

  if (error) throw new Error("Failed to pause listing")
  revalidatePath("/dashboard")
}

export async function activateListing(listingId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not logged in")

  const { error } = await supabase
    .from("listings")
    .update({ status: "active" } as never)
    .eq("id", listingId)
    .eq("lender_id", user.id)

  if (error) throw new Error("Failed to activate listing")
  revalidatePath("/dashboard")
}

export async function deleteListing(listingId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not logged in")

  // Only allow delete if no active/approved bookings
  const { data: activeBookings } = await supabase
    .from("bookings")
    .select("id")
    .eq("listing_id", listingId)
    .in("status", ["requested", "approved", "pending_pickup"])

  if (activeBookings && activeBookings.length > 0) {
    throw new Error("Cannot delete a listing with active bookings")
  }

  const { error } = await supabase
    .from("listings")
    .delete()
    .eq("id", listingId)
    .eq("lender_id", user.id)

  if (error) throw new Error("Failed to delete listing")
  revalidatePath("/dashboard")
}
