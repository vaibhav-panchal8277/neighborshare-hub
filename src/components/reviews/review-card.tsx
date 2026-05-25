import { formatDistanceToNow } from "date-fns"
import { ShieldCheck } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { RatingStars } from "./rating-stars"
import { getInitials } from "@/lib/utils"

interface ReviewCardProps {
  review: {
    id: string
    rating: number
    comment: string | null
    tags: string[] | null
    created_at: string
    reviewer_name: string
    reviewer_avatar: string | null
    reviewer_verified: boolean
  }
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-muted">
              <AvatarImage src={review.reviewer_avatar || undefined} />
              <AvatarFallback>{getInitials(review.reviewer_name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold">{review.reviewer_name}</span>
                {review.reviewer_verified && (
                  <ShieldCheck className="h-3.5 w-3.5 text-trust" />
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
              </span>
            </div>
          </div>
          <RatingStars rating={review.rating} readonly size="sm" />
        </div>
        
        {review.comment && (
          <p className="text-sm text-foreground/90 leading-relaxed mb-4">
            &quot;{review.comment}&quot;
          </p>
        )}
        
        {review.tags && review.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto">
            {review.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
