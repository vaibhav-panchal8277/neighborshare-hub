'use client'

import { useState } from 'react'
import { updateProfile } from '@/app/actions/dashboard-actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2, User, Phone, AlignLeft } from 'lucide-react'
import { toast } from 'sonner'

interface ProfileSettingsFormProps {
  initialProfile: {
    display_name: string
    email: string | null
    phone: string | null
    bio: string | null
  }
}

export function ProfileSettingsForm({ initialProfile }: ProfileSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [displayName, setDisplayName] = useState(initialProfile.display_name || '')
  const [phone, setPhone] = useState(initialProfile.phone || '')
  const [bio, setBio] = useState(initialProfile.bio || '')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!displayName.trim()) {
      toast.error('Username/Display name cannot be empty')
      return
    }

    setIsLoading(true)

    const formData = new FormData()
    formData.append('display_name', displayName)
    formData.append('phone', phone)
    formData.append('bio', bio)

    try {
      const result = await updateProfile(formData)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Profile updated successfully!')
      }
    } catch {
      toast.error('Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border shadow-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold font-heading">Profile Settings</CardTitle>
        <CardDescription>
          Update your public profile details. Other neighbors will see this when you share items.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={initialProfile.email || ''}
              disabled
              className="bg-muted/40 cursor-not-allowed opacity-90"
            />
            <p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_name" className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Username / Display Name
            </Label>
            <Input
              id="display_name"
              type="text"
              placeholder="e.g. Jane Doe"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="e.g. +1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium flex items-center gap-2">
              <AlignLeft className="h-4 w-4 text-muted-foreground" />
              Bio
            </Label>
            <Textarea
              id="bio"
              placeholder="Tell your neighbors a bit about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="resize-none w-full"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto px-6">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
