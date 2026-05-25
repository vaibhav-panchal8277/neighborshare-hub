"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function resolveDispute(disputeId: string, resolution: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not logged in")

  // Verify the user is an admin
  const { data: profileData } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()
    
  const profile = profileData as { is_admin: boolean } | null
  if (!profile?.is_admin) throw new Error("Unauthorized")

  // Simulate network delay to show the loader
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Update the dispute status
  const { error: updateError } = await supabase
    .from('disputes')
    // @ts-expect-error Supabase types missing
    .update({ 
      status: 'resolved',
      resolution_notes: resolution
    })
    .eq('id', disputeId)

  if (updateError) throw new Error("Failed to resolve dispute")

  revalidatePath('/admin')
}

export async function banUser(userId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not logged in")

  // Verify the user is an admin
  const { data: profileData2 } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()
    
  const profile2 = profileData2 as { is_admin: boolean } | null
  if (!profile2?.is_admin) throw new Error("Unauthorized")

  // In a real app we'd use Supabase Admin API to ban auth user.
  // For now, let's just mark their profile as banned or set trust score to 0.
  await supabase
    .from('profiles')
    // @ts-expect-error Supabase types missing
    .update({ trust_score: 0 })
    .eq('id', userId)

  revalidatePath('/admin')
}
