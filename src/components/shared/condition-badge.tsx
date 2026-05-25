import { Badge } from "@/components/ui/badge"
import { Database } from "@/types/database"

type Condition = Database["public"]["Enums"]["listing_condition"]

interface ConditionBadgeProps {
  condition: Condition
}

export function ConditionBadge({ condition }: ConditionBadgeProps) {
  switch (condition) {
    case "new":
      return (
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20">
          New
        </Badge>
      )
    case "like_new":
      return (
        <Badge variant="outline" className="bg-sky-500/10 text-sky-600 hover:bg-sky-500/20 border-sky-500/20">
          Like New
        </Badge>
      )
    case "good":
      return (
        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20">
          Good
        </Badge>
      )
    case "fair":
      return (
        <Badge variant="outline" className="bg-slate-500/10 text-slate-600 hover:bg-slate-500/20 border-slate-500/20">
          Fair
        </Badge>
      )
    default:
      return null
  }
}
