-- ============================================================
-- NeighborShare Hub — Migration 00001: Create Enum Types
-- ============================================================
-- All custom PostgreSQL enum types used across the schema.
-- Run this FIRST before creating any tables.
-- ============================================================

-- ─── User & Verification ───────────────────────────────────
CREATE TYPE user_role AS ENUM ('borrower', 'lender', 'admin');
CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');

-- ─── Listings ──────────────────────────────────────────────
CREATE TYPE listing_condition AS ENUM ('new', 'like_new', 'good', 'fair');
CREATE TYPE pricing_type AS ENUM ('free', 'deposit_only', 'daily_fee', 'skill_share');
CREATE TYPE listing_status AS ENUM ('draft', 'active', 'paused', 'archived');

-- ─── Bookings ──────────────────────────────────────────────
CREATE TYPE booking_status AS ENUM (
  'requested',
  'approved',
  'declined',
  'pending_pickup',
  'active',
  'returned',
  'completed',
  'cancelled',
  'disputed'
);
CREATE TYPE photo_type AS ENUM ('check_in', 'check_out');

-- ─── Payments ──────────────────────────────────────────────
CREATE TYPE payment_status AS ENUM ('pending', 'held', 'released', 'refunded', 'failed');
CREATE TYPE payment_type AS ENUM ('deposit', 'rental_fee', 'insurance_fee', 'refund', 'payout');

-- ─── Disputes ──────────────────────────────────────────────
CREATE TYPE dispute_status AS ENUM ('open', 'under_review', 'resolved', 'escalated');
