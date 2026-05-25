"use client"

import { useState } from "react"
import { AlertTriangle, UploadCloud } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DisputeModalProps {
  bookingId: string
  trigger?: React.ReactElement
}

export function DisputeModal({ trigger }: DisputeModalProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // TODO: Connect to Supabase
    setTimeout(() => {
      setIsSubmitting(false)
      setOpen(false)
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger render={trigger} />
      ) : (
        <DialogTrigger render={<Button variant="destructive" size="sm" />}>
          Report Issue
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Open a Dispute
            </DialogTitle>
            <DialogDescription>
              We&apos;re sorry you had an issue. Please provide details so our moderation team can review and resolve this.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for dispute</Label>
              <Select required>
                <SelectTrigger id="reason">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="item_damaged">Item returned damaged</SelectItem>
                  <SelectItem value="not_as_described">Item not as described</SelectItem>
                  <SelectItem value="item_not_returned">Item not returned</SelectItem>
                  <SelectItem value="unsafe_interaction">Unsafe or inappropriate interaction</SelectItem>
                  <SelectItem value="other">Other issue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea 
                id="description" 
                placeholder="Please describe exactly what happened..." 
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Evidence Photos (Optional but recommended)</Label>
              <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
                <UploadCloud className="h-8 w-8 mb-2" />
                <p className="text-sm font-medium">Click to upload photos</p>
                <p className="text-xs">PNG, JPG up to 10MB</p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Dispute"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
