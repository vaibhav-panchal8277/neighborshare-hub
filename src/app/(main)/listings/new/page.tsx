"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { createListing } from "@/app/actions/listing-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, UploadCloud } from "lucide-react"

export default function NewListingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      let uploadedImageUrl = ""

      // 1. Upload image to Supabase Storage if a file was selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('listing_images')
          .upload(filePath, imageFile)

        if (uploadError) {
          console.error("Storage upload error:", uploadError)
          throw new Error("Failed to upload image. Please try again.")
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('listing_images')
          .getPublicUrl(filePath)
          
        uploadedImageUrl = publicUrlData.publicUrl
      }

      // 2. Call Server Action to create database records
      const newListingId = await createListing(formData, uploadedImageUrl)

      // 3. Redirect to the new listing page
      router.push(`/listings/${newListingId}`)
      
    } catch (err: unknown) {
      console.error(err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-10 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading">List an Item</h1>
        <p className="text-muted-foreground mt-2">
          Turn your idle tools and gear into cash by lending them to neighbors.
        </p>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Photo Upload Section */}
        <div className="space-y-4">
          <Label>Listing Photo</Label>
          <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors overflow-hidden relative">
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
                  <UploadCloud className="w-10 h-10 mb-3" />
                  <p className="mb-2 text-sm"><span className="font-semibold">Click to upload</span></p>
                  <p className="text-xs">PNG, JPG or WEBP (MAX. 5MB)</p>
                </div>
              )}
              <input id="dropzone-file" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="e.g. Makita 18V Cordless Drill" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" defaultValue="Tools">
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
              <Select name="condition" defaultValue="good">
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
              placeholder="Describe the item, what's included, and any rules for using it..." 
              className="h-32"
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="daily_fee">Daily Fee ($)</Label>
              <Input id="daily_fee" name="daily_fee" type="number" min="0" step="0.50" placeholder="15.00" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deposit_amount">Security Deposit ($)</Label>
              <Input id="deposit_amount" name="deposit_amount" type="number" min="0" step="1.00" placeholder="50.00" required />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Publishing...
            </>
          ) : (
            "Publish Listing"
          )}
        </Button>
      </form>
    </div>
  )
}
