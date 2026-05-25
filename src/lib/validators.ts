import { z } from "zod"
import { CONSTANTS } from "./constants"

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
})

export const signupSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
})

export const listingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  category: z.string().refine((val) => CONSTANTS.SUPPORTED_CATEGORIES.includes(val), {
    message: "Invalid category",
  }),
  description: z.string().min(20, "Description must be at least 20 characters").max(2000),
  condition: z.enum(["new", "like_new", "good", "fair"]),
  pricing_type: z.enum(["free", "deposit_only", "daily_fee", "skill_share"]),
  daily_fee: z.coerce.number().min(0).optional(),
  deposit_amount: z.coerce.number().min(0).optional(),
  skill_share: z.boolean().default(false),
  skill_share_description: z.string().max(500).optional(),
  rules: z.array(z.string()).optional(),
  location_radius: z.coerce.number().min(1).max(50).default(5),
  address_hint: z.string().min(3).max(100).optional(),
})

export type ListingFormValues = z.infer<typeof listingSchema>

export const bookingRequestSchema = z.object({
  start_date: z.date(),
  end_date: z.date(),
  purpose: z.string().min(10, "Please briefly explain what you need this for").max(500),
  experience_level: z.enum(["beginner", "intermediate", "expert"]).optional(),
  message: z.string().max(1000).optional(),
})

export type BookingRequestFormValues = z.infer<typeof bookingRequestSchema>
