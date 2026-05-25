'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'

import { listingSchema, type ListingFormValues } from '@/lib/validators'
import { CONSTANTS } from '@/lib/constants'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, Loader2 } from 'lucide-react'

export function ListingForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<ListingFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(listingSchema) as any,
    defaultValues: {
      title: '',
      category: '',
      description: '',
      condition: 'good',
      pricing_type: 'free',
      daily_fee: 0,
      deposit_amount: 0,
      skill_share: false,
      skill_share_description: '',
      rules: [],
      location_radius: 5,
      address_hint: '',
    },
  })

  const pricingType = watch('pricing_type')
  const skillShare = watch('skill_share')

  const onSubmit = async (data: ListingFormValues) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { data: userData, error: authError } = await supabase.auth.getUser()
      if (authError || !userData?.user) {
        throw new Error('You must be logged in to create a listing')
      }

      const { data: newListing, error: insertError } = await supabase
        .from('listings')
        .insert({
          lender_id: userData.user.id,
          title: data.title,
          category: data.category,
          description: data.description,
          condition: data.condition,
          pricing_type: data.pricing_type,
          daily_fee: data.pricing_type === 'daily_fee' ? data.daily_fee : null,
          deposit_amount: ['deposit_only', 'daily_fee'].includes(data.pricing_type) ? data.deposit_amount : null,
          skill_share: data.skill_share,
          skill_share_description: data.skill_share ? data.skill_share_description : null,
          location_radius: data.location_radius,
          address_hint: data.address_hint,
          status: 'active',
          rules: data.rules,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
        .select()
        .single()

      if (insertError) {
        throw new Error(insertError.message)
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push(`/listings/${(newListing as any).id}`)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while creating your listing.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {error && (
        <div className="rounded-md bg-destructive/15 p-4 flex items-center gap-3 text-sm text-destructive">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-heading">Basic Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g. Dewalt 20V Max Cordless Drill"
                {...register('title')}
                aria-invalid={!!errors.title}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONSTANTS.SUPPORTED_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Controller
                  control={control}
                  name="condition"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Brand New</SelectItem>
                        <SelectItem value="like_new">Like New</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.condition && <p className="text-sm text-destructive">{errors.condition.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your item, what it includes, and any important details..."
                className="min-h-[120px]"
                {...register('description')}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-heading">Pricing & Terms</h3>
            
            <div className="space-y-4">
              <Label>Pricing Type</Label>
              <Controller
                control={control}
                name="pricing_type"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pricing type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free (Neighborly love)</SelectItem>
                      <SelectItem value="deposit_only">Deposit Only (Refundable)</SelectItem>
                      <SelectItem value="daily_fee">Daily Rental Fee</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {pricingType === 'daily_fee' && (
              <div className="space-y-2">
                <Label htmlFor="daily_fee">Daily Fee ($)</Label>
                <Input
                  id="daily_fee"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register('daily_fee')}
                />
                {errors.daily_fee && <p className="text-sm text-destructive">{errors.daily_fee.message}</p>}
              </div>
            )}

            {(pricingType === 'deposit_only' || pricingType === 'daily_fee') && (
              <div className="space-y-2">
                <Label htmlFor="deposit_amount">Security Deposit ($)</Label>
                <Input
                  id="deposit_amount"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register('deposit_amount')}
                />
                <p className="text-xs text-muted-foreground">
                  This amount will be held on the borrower&apos;s card and released when the item is returned safely.
                </p>
                {errors.deposit_amount && <p className="text-sm text-destructive">{errors.deposit_amount.message}</p>}
              </div>
            )}

            <div className="space-y-4 pt-4 border-t">
              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Skill Share</Label>
                  <p className="text-sm text-muted-foreground">
                    Offer to teach the borrower how to use this item.
                  </p>
                </div>
                <Controller
                  control={control}
                  name="skill_share"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              {skillShare && (
                <div className="space-y-2">
                  <Label htmlFor="skill_share_description">What will you teach?</Label>
                  <Textarea
                    id="skill_share_description"
                    placeholder="E.g., I'll show you how to properly thread the sewing machine and sew a straight stitch."
                    {...register('skill_share_description')}
                  />
                  {errors.skill_share_description && <p className="text-sm text-destructive">{errors.skill_share_description.message}</p>}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Listing...
            </>
          ) : (
            'Create Listing'
          )}
        </Button>
      </div>
    </form>
  )
}
