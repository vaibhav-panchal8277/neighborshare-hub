"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { submitReview } from "@/app/actions/review-actions"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"

export function ReviewDialog({
  bookingId,
  targetId,
  targetName,
  existingReview,
}: {
  bookingId: string
  targetId: string
  targetName: string
  existingReview?: boolean
}) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [done, setDone] = useState(false)

  if (existingReview) {
    return (
      <Button size="sm" variant="secondary" disabled className="gap-1">
        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
        Reviewed
      </Button>
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (rating === 0) return
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.set("rating", String(rating))

    try {
      await submitReview(formData)
      setDone(true)
      setTimeout(() => {
        setIsOpen(false)
        router.refresh()
      }, 1000)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline" className="gap-1" />}>
        <Star className="h-3.5 w-3.5" />
        Leave Review
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Rate Your Experience</DialogTitle>
          <DialogDescription>
            How was your experience with <strong>{targetName}</strong>?
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <div className="text-5xl">🎉</div>
            <p className="font-semibold text-lg">Review submitted!</p>
            <p className="text-sm text-muted-foreground">Trust scores have been updated.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 pt-2">
            <input type="hidden" name="booking_id" value={bookingId} />
            <input type="hidden" name="target_id" value={targetId} />

            {/* Star Rating */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`h-9 w-9 transition-colors ${
                        star <= (hovered || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-muted text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-sm text-muted-foreground h-5">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent! ⭐"}
              </span>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Textarea
                name="comment"
                placeholder="Share a few words about your experience (optional)..."
                className="h-24 resize-none"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={rating === 0 || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
