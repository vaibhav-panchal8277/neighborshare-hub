"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function updateListing(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not logged in")

  const listingId = formData.get("listingId") as string
  const title = formData.get("title") as string
  const category = formData.get("category") as string
  const description = formData.get("description") as string
  const condition = formData.get("condition") as string
  const daily_fee = Number(formData.get("daily_fee"))
  const deposit_amount = Number(formData.get("deposit_amount"))

  const { error } = await supabase
    .from("listings")
    .update({ title, category, description, condition, daily_fee, deposit_amount } as never)
    .eq("id", listingId)
    .eq("lender_id", user.id) // Security: only own listings

  if (error) {
    console.error("Update error:", error)
    throw new Error("Failed to update listing")
  }

  revalidatePath(`/listings/${listingId}`)
  redirect(`/listings/${listingId}`)
}
