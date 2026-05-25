export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'borrower' | 'lender' | 'admin'
          display_name: string
          avatar_url: string | null
          email: string | null
          phone: string | null
          bio: string | null
          verification_status: 'unverified' | 'pending' | 'verified' | 'rejected'
          trust_score: number
          stripe_account_id: string | null
          notification_preferences: Record<string, unknown> | null
          created_at: string
          updated_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      listings: {
        Row: {
          id: string
          lender_id: string
          title: string
          category: string
          description: string
          condition: 'new' | 'like_new' | 'good' | 'fair'
          rules: string[] | null
          pricing_type: 'free' | 'deposit_only' | 'daily_fee' | 'skill_share'
          daily_fee: number | null
          deposit_amount: number | null
          skill_share: boolean
          skill_share_description: string | null
          lat: number | null
          lng: number | null
          location_radius: number | null
          address_hint: string | null
          status: 'draft' | 'active' | 'paused' | 'archived'
          views_count: number
          created_at: string
          updated_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
    }
    Views: {
      public_profiles: {
        Row: {
          id: string
          display_name: string
          avatar_url: string | null
          role: 'borrower' | 'lender' | 'admin'
          bio: string | null
          verification_status: 'unverified' | 'pending' | 'verified' | 'rejected'
          trust_score: number
          created_at: string
        }
      }
      listing_summaries: {
        Row: {
          id: string
          title: string
          category: string
          condition: 'new' | 'like_new' | 'good' | 'fair'
          pricing_type: 'free' | 'deposit_only' | 'daily_fee' | 'skill_share'
          daily_fee: number | null
          deposit_amount: number | null
          skill_share: boolean
          address_hint: string | null
          lat: number | null
          lng: number | null
          status: 'draft' | 'active' | 'paused' | 'archived'
          views_count: number
          created_at: string
          lender_name: string
          lender_avatar: string | null
          lender_trust_score: number
          lender_verification_status: string
          thumbnail_url: string | null
        }
      }
    }
    Functions: {
      calculate_trust_score: {
        Args: { target_user_id: string }
        Returns: number
      }
      check_availability: {
        Args: { target_listing_id: string; check_start: string; check_end: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: 'borrower' | 'lender' | 'admin'
      verification_status: 'unverified' | 'pending' | 'verified' | 'rejected'
      listing_condition: 'new' | 'like_new' | 'good' | 'fair'
      pricing_type: 'free' | 'deposit_only' | 'daily_fee' | 'skill_share'
      listing_status: 'draft' | 'active' | 'paused' | 'archived'
      booking_status: 'requested' | 'approved' | 'declined' | 'pending_pickup' | 'active' | 'returned' | 'completed' | 'cancelled' | 'disputed'
    }
  }
}
