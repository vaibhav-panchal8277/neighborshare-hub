"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingStarsProps {
  rating: number
  maxRating?: number
  readonly?: boolean
  onChange?: (rating: number) => void
  size?: "sm" | "md" | "lg"
}

export function RatingStars({ 
  rating, 
  maxRating = 5, 
  readonly = false, 
  onChange,
  size = "md" 
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0)
  
  const currentRating = hoverRating || rating

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  }

  return (
    <div 
      className={cn("flex items-center", readonly ? "cursor-default" : "cursor-pointer")}
      onMouseLeave={() => !readonly && setHoverRating(0)}
    >
      {Array.from({ length: maxRating }).map((_, i) => {
        const value = i + 1
        const isFilled = value <= currentRating
        const isHalf = !isFilled && value - 0.5 <= currentRating

        return (
          <div
            key={i}
            className={cn(
              "relative transition-transform duration-150", 
              !readonly && "hover:scale-110"
            )}
            onMouseEnter={() => !readonly && setHoverRating(value)}
            onClick={() => !readonly && onChange?.(value)}
          >
            {isHalf ? (
              <div className="relative">
                <Star className={cn(sizeClasses[size], "text-muted-foreground stroke-1")} />
                <div className="absolute inset-0 overflow-hidden w-[50%]">
                  <Star className={cn(sizeClasses[size], "fill-amber-500 text-amber-500")} />
                </div>
              </div>
            ) : (
              <Star 
                className={cn(
                  sizeClasses[size],
                  isFilled ? "fill-amber-500 text-amber-500" : "text-muted-foreground stroke-1",
                  !readonly && "hover:fill-amber-400 hover:text-amber-400"
                )} 
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
