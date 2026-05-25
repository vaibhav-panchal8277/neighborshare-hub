"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { differenceInDays } from "date-fns"
import { DateRange } from "react-day-picker"
import { AlertTriangle, Loader2 } from "lucide-react"

import { createBookingRequest } from "@/app/actions/booking-actions"


interface AvailabilityBlock {
  start_date: string;
  end_date: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BookingWidget({ listing, availabilityBlocks = [] }: { listing: { id: string, lender_id: string, pricing_type: string, daily_fee: number, deposit_amount?: number }, availabilityBlocks?: AvailabilityBlock[] }) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const days = date?.from && date?.to ? differenceInDays(date.to, date.from) : 0
  const totalAmount = days > 0 && listing.pricing_type === 'daily_fee' 
    ? days * listing.daily_fee 
    : 0

  const handleRequest = async () => {
    if (!date?.from || !date?.to) return
    
    setIsSubmitting(true)
    setError(null)

    try {
      // Format dates exactly as expected by Postgres (YYYY-MM-DD)
      const startDateStr = date.from.toISOString().split('T')[0]
      const endDateStr = date.to.toISOString().split('T')[0]
      
      await createBookingRequest(
        listing.id,
        listing.lender_id,
        startDateStr,
        endDateStr,
        totalAmount,
        listing.deposit_amount || 0
      )
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create booking request. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-md p-2 bg-background">
        <Calendar
          mode="range"
          selected={date}
          onSelect={setDate}
          numberOfMonths={1}
          disabled={(d) => {
            // Disable past dates
            if (d < new Date(new Date().setHours(0,0,0,0))) return true;
            
            // Disable blocked dates
            for (const block of availabilityBlocks) {
              const start = new Date(block.start_date);
              start.setHours(0,0,0,0);
              const end = new Date(block.end_date);
              end.setHours(23,59,59,999);
              if (d >= start && d <= end) return true;
            }
            return false;
          }}
          className="mx-auto"
        />
      </div>

      {days > 0 && listing.pricing_type === 'daily_fee' && (
        <div className="bg-muted p-4 rounded-xl flex justify-between items-center text-sm">
          <span>${listing.daily_fee} x {days} nights</span>
          <span className="font-bold">${totalAmount.toFixed(2)}</span>
        </div>
      )}

      {error && (
        <div className="text-sm text-destructive flex items-center gap-2 p-3 bg-destructive/10 rounded-md">
          <AlertTriangle className="h-4 w-4" />
          {error}
        </div>
      )}

      <Button 
        size="lg" 
        className="w-full" 
        disabled={!date?.from || !date?.to || isSubmitting}
        onClick={handleRequest}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Requesting...
          </>
        ) : (
          "Request to Borrow"
        )}
      </Button>
      <p className="text-xs text-center text-muted-foreground">
        You won&apos;t be charged yet. The lender must approve your request.
      </p>
    </div>
  )
}
