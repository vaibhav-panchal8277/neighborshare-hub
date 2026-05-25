import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Star, Zap, Repeat } from "lucide-react"

export type TrustBadgeType = "verified" | "top_rated" | "skill_sharer" | "frequent"

interface TrustBadgeProps {
  type: TrustBadgeType
}

export function TrustBadge({ type }: TrustBadgeProps) {
  switch (type) {
    case "verified":
      return (
        <Badge variant="outline" className="bg-trust/10 text-trust hover:bg-trust/20 border-trust/20">
          <ShieldCheck className="mr-1 h-3 w-3" />
          Verified Neighbor
        </Badge>
      )
    case "top_rated":
      return (
        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20">
          <Star className="mr-1 h-3 w-3 fill-current" />
          Top Rated
        </Badge>
      )
    case "skill_sharer":
      return (
        <Badge variant="outline" className="bg-skill/10 text-skill hover:bg-skill/20 border-skill/20">
          <Zap className="mr-1 h-3 w-3" />
          Skill Sharer
        </Badge>
      )
    case "frequent":
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20">
          <Repeat className="mr-1 h-3 w-3" />
          Frequent Borrower
        </Badge>
      )
    default:
      return null
  }
}
