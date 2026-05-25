import { CheckCircle2, Circle, Clock, Package, CheckSquare, AlertTriangle } from "lucide-react"
import { Database } from "@/types/database"
import { cn } from "@/lib/utils"

type BookingStatus = Database["public"]["Enums"]["booking_status"]

interface StatusTrackerProps {
  status: BookingStatus
  className?: string
}

export function StatusTracker({ status, className }: StatusTrackerProps) {
  // Define the main linear flow
  const steps = [
    { id: "requested", label: "Requested", icon: Clock },
    { id: "approved", label: "Approved", icon: CheckCircle2 },
    { id: "pending_pickup", label: "Pending Pickup", icon: Package },
    { id: "active", label: "Active", icon: CheckSquare },
    { id: "returned", label: "Returned", icon: Package },
    { id: "completed", label: "Completed", icon: CheckCircle2 },
  ]

  // Handle terminal/error states separately
  if (status === "cancelled" || status === "declined" || status === "disputed") {
    return (
      <div className={cn("flex items-center p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20", className)}>
        <AlertTriangle className="h-5 w-5 mr-3" />
        <div className="flex flex-col">
          <span className="font-semibold capitalize">Booking {status}</span>
          <span className="text-sm opacity-90">
            {status === "disputed" ? "This booking is under review by moderation." : "This booking did not proceed."}
          </span>
        </div>
      </div>
    )
  }

  const currentStepIndex = steps.findIndex(s => s.id === status)

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative flex justify-between">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -translate-y-1/2 z-0" />
        
        {/* Progress line */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-500 ease-in-out" 
          style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex
          const isCurrent = index === currentStepIndex
          
          const Icon = isCompleted ? CheckCircle2 : (isCurrent ? step.icon : Circle)
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 bg-card px-2">
              <div 
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-300",
                  isCompleted ? "border-primary bg-primary text-primary-foreground" : 
                  isCurrent ? "border-primary bg-background text-primary" : 
                  "border-muted bg-background text-muted-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4", isCompleted ? "text-primary-foreground" : "")} />
              </div>
              <span className={cn(
                "text-xs font-medium hidden sm:block absolute -bottom-6 w-max text-center transition-colors duration-300",
                isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
