import Link from "next/link"
import Image from "next/image"
import { MapPin, Star } from "lucide-react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Database } from "@/types/database"
import { ConditionBadge } from "../shared/condition-badge"
import { PriceTag } from "../shared/price-tag"
import { getInitials } from "@/lib/utils"

type ListingSummary = Database["public"]["Views"]["listing_summaries"]["Row"]

interface ListingCardProps {
  listing: ListingSummary
  distanceMiles?: number
}

export function ListingCard({ listing, distanceMiles }: ListingCardProps) {
  return (
    <Link href={`/listings/${listing.id}`}>
      <Card className="overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 group">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          {listing.thumbnail_url ? (
            <Image
              src={listing.thumbnail_url}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          <div className="absolute top-2 right-2">
            <ConditionBadge condition={listing.condition} />
          </div>
        </div>
        
        <CardContent className="p-4 flex-grow flex flex-col gap-2">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-lg line-clamp-1 flex-1">{listing.title}</h3>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground gap-1">
            <MapPin className="h-3 w-3" />
            <span className="line-clamp-1">{listing.address_hint || "Location hidden"}</span>
            {distanceMiles !== undefined && (
              <>
                <span className="mx-1">•</span>
                <span>{distanceMiles.toFixed(1)}m away</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 mt-auto pt-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={listing.lender_avatar || undefined} />
              <AvatarFallback className="text-[10px]">
                {getInitials(listing.lender_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-xs">
              <span className="font-medium line-clamp-1">{listing.lender_name}</span>
              <div className="flex items-center text-amber-500">
                <Star className="h-3 w-3 fill-current mr-0.5" />
                <span>{listing.lender_trust_score.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-4 border-t bg-muted/20 mt-auto flex justify-between items-center">
          <PriceTag 
            type={listing.pricing_type} 
            dailyFee={listing.daily_fee} 
            depositAmount={listing.deposit_amount} 
          />
        </CardFooter>
      </Card>
    </Link>
  )
}
