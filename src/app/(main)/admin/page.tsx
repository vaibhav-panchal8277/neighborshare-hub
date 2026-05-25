import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, ShieldCheck, RefreshCcw } from 'lucide-react'
import { resolveDispute } from '@/app/actions/admin-actions'
import { SubmitButton } from '@/components/ui/submit-button'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check if admin
  const { data } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()
    
  const profile = data as { is_admin: boolean } | null;

  if (!profile?.is_admin) {
    redirect('/dashboard') // kick non-admins out
  }

  // Fetch disputes
  const { data: disputes } = await supabase
    .from('disputes')
    .select('*, booking:bookings(*, listing:listings(title))')
    .order('created_at', { ascending: false })

  return (
    <div className="container py-10 max-w-6xl">
      <div className="flex items-center gap-3 mb-8">
        <ShieldCheck className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold font-heading">Admin Control Center</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Open Disputes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{disputes?.filter((d: { status: string }) => d.status === 'open').length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold font-heading mb-4 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-500" /> 
        Active Disputes
      </h2>
      
      <div className="space-y-4">
        {disputes && disputes.length > 0 ? (
          disputes.map((dispute: { id: string, status: string, reporter_id: string, reason: string, booking: { listing: { title: string } } }) => (
            <Card key={dispute.id} className={dispute.status === 'resolved' ? 'opacity-60' : ''}>
              <CardContent className="p-6 flex flex-col md:flex-row justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant={dispute.status === 'open' ? 'destructive' : 'secondary'}>
                      {dispute.status.toUpperCase()}
                    </Badge>
                    <span className="font-semibold">{dispute.booking?.listing?.title || 'Unknown Item'}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    <strong>Reported by:</strong> User ID: {dispute.reporter_id}
                  </p>
                  <p className="text-sm font-medium p-3 bg-muted/50 rounded-md mt-2 border">
                    &quot;{dispute.reason}&quot;
                  </p>
                </div>
                
                {dispute.status === 'open' && (
                  <div className="flex flex-col gap-2 min-w-[200px]">
                    <form action={async () => {
                      "use server"
                      await resolveDispute(dispute.id, 'refund_issued')
                    }}>
                      <SubmitButton size="sm" className="w-full" variant="outline" icon={RefreshCcw}>
                        Issue Refund
                      </SubmitButton>
                    </form>
                    
                    <form action={async () => {
                      "use server"
                      await resolveDispute(dispute.id, 'dismissed')
                    }}>
                      <SubmitButton size="sm" className="w-full" variant="outline">
                        Dismiss Dispute
                      </SubmitButton>
                    </form>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 border rounded-xl bg-muted/30">
            <p className="text-muted-foreground">No disputes found. The neighborhood is peaceful.</p>
          </div>
        )}
      </div>
    </div>
  )
}
