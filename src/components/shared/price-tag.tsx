import { Database } from "@/types/database"
import { formatCurrency } from "@/lib/utils"

type PricingType = Database["public"]["Enums"]["pricing_type"]

interface PriceTagProps {
  type: PricingType
  dailyFee?: number | null
  depositAmount?: number | null
  className?: string
}

export function PriceTag({ type, dailyFee, depositAmount, className = "" }: PriceTagProps) {
  if (type === "free") {
    return (
      <div className={`font-semibold text-emerald-600 ${className}`}>
        Free to Borrow
      </div>
    )
  }

  if (type === "skill_share") {
    return (
      <div className={`font-semibold text-skill ${className}`}>
        Skill Share
      </div>
    )
  }

  if (type === "deposit_only" && depositAmount) {
    return (
      <div className={`font-semibold text-foreground ${className}`}>
        Free <span className="text-sm font-normal text-muted-foreground">({formatCurrency(depositAmount)} deposit)</span>
      </div>
    )
  }

  if (type === "daily_fee" && dailyFee) {
    return (
      <div className={`font-semibold text-foreground ${className}`}>
        {formatCurrency(dailyFee)}<span className="text-sm font-normal text-muted-foreground">/day</span>
      </div>
    )
  }

  return null
}
