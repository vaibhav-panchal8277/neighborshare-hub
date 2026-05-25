"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function submitReview(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Must be logged in.")

  const bookingId = formData.get("booking_id") as string
  const targetId = formData.get("target_id") as string
  const rating = Number(formData.get("rating"))
  const comment = formData.get("comment") as string

  // Insert the review
  const { error } = await supabase
    .from("reviews")
    .insert({
      booking_id: bookingId,
      reviewer_id: user.id,
      target_id: targetId,
      rating,
      comment,
    } as never)

  if (error) {
    console.error("Review error:", error)
    throw new Error("Failed to submit review.")
  }

  // Recalculate and update trust_score for the target user
  const { data: allReviews } = await supabase
    .from("reviews")
    .select("rating")
    .eq("target_id", targetId)

  if (allReviews && allReviews.length > 0) {
    const typedReviews = allReviews as { rating: number }[]
    const avgScore = typedReviews.reduce((sum, r) => sum + r.rating, 0) / typedReviews.length
    await supabase
      .from("profiles")
      .update({ trust_score: Math.round(avgScore * 100) / 100 } as never)
      .eq("id", targetId)
  }

  revalidatePath("/dashboard")
}
