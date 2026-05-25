import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export function SkeletonCard() {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative aspect-[4/3] w-full">
        <Skeleton className="h-full w-full rounded-none" />
      </div>
      <CardContent className="p-4 flex-grow flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-4 w-1/3" />
        <div className="flex items-center gap-2 mt-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 border-t mt-auto flex justify-between items-center">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-16" />
      </CardFooter>
    </Card>
  )
}
