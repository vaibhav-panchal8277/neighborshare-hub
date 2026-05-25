"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function SubmitButton({ 
  children, 
  icon: Icon,
  ...props 
}: React.ComponentProps<typeof Button> & { icon?: React.ElementType }) {
  const { pending } = useFormStatus()
  
  return (
    <Button disabled={pending || props.disabled} {...props}>
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : Icon ? (
        <Icon className="mr-2 h-4 w-4" />
      ) : null}
      {children}
    </Button>
  )
}
