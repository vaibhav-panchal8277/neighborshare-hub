import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - /api/auth/callback (Supabase auth callback — MUST be excluded)
     * - /api/webhooks/* (Stripe webhooks — no auth needed)
     * - Public assets (images, SVGs)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth/callback|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
