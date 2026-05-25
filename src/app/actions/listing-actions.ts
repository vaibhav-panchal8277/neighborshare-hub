"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createListing(formData: FormData, imageUrl: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error("You must be logged in to create a listing.")
  }

  const title = formData.get("title") as string
  const category = formData.get("category") as string
  const description = formData.get("description") as string
  const condition = formData.get("condition") as string
  const daily_fee = Number(formData.get("daily_fee")) || 0
  const deposit_amount = Number(formData.get("deposit_amount")) || 0

  // 1. Insert the listing
  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .insert({
      lender_id: user.id,
      title,
      category,
      description,
      condition,
      pricing_type: 'daily_fee',
      daily_fee,
      deposit_amount,
      status: 'active'
    } as never)
    .select()
    .single()

  const typedListing = listing as { id: string } | null

  if (listingError || !typedListing) {
    console.error("Error creating listing:", listingError)
    throw new Error("Failed to create the listing.")
  }

  // 2. Insert the uploaded photo
  if (imageUrl) {
    const { error: photoError } = await supabase
      .from('listing_photos')
      .insert({
        listing_id: typedListing.id,
        url: imageUrl,
        sort_order: 0
      } as never)

    if (photoError) {
      console.error("Error linking photo:", photoError)
      // Even if photo fails, we return the listing ID
    }
  }

  // 3. Revalidate and return the ID so the client can redirect
  revalidatePath('/browse')
  return typedListing.id
}
