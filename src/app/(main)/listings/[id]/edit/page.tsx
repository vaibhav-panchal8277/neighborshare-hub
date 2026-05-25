"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { updateListing } from "@/app/actions/update-listing-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

export default function EditListingPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const supabase = createClient()
  
  const [listing, setListing] = useState<{ title?: string, category?: string, condition?: string, description?: string, daily_fee?: number, deposit_amount?: number } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchListing = async () => {
      setIsLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", params.id)
        .eq("lender_id", user.id)
        .single()

      if (error || !data) {
        console.error("Error fetching listing:", error)
        setError("Failed to load listing or you don't have permission to edit it.")
      } else {
        setListing(data)
      }
      setIsLoading(false)
    }

    fetchListing()
  }, [params.id, router, supabase])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      formData.append("listingId", params.id)
      await updateListing(formData)
    } catch (err: unknown) {
      console.error(err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred.")
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-20 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="container py-20 text-center">
        <div className="bg-destructive/15 text-destructive p-4 rounded-md inline-block">
          {error || "Listing not found"}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading">Edit Listing</h1>
        <p className="text-muted-foreground mt-2">
          Update the details of your item.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={listing.title} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" defaultValue={listing.category}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tools">Tools</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Sports">Sports & Outdoors</SelectItem>
                  <SelectItem value="Kitchen">Kitchen Appliances</SelectItem>
                  <SelectItem value="Party">Party Supplies</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select name="condition" defaultValue={listing.condition}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="like_new">Like New</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              defaultValue={listing.description}
              className="h-32"
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="daily_fee">Daily Fee ($)</Label>
              <Input id="daily_fee" name="daily_fee" type="number" min="0" step="0.50" defaultValue={listing.daily_fee} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deposit_amount">Security Deposit ($)</Label>
              <Input id="deposit_amount" name="deposit_amount" type="number" min="0" step="1.00" defaultValue={listing.deposit_amount} required />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="button" variant="outline" className="w-full" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
