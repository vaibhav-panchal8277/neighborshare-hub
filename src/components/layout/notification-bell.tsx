"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getNotifications, markAsRead, markAllAsRead } from "@/app/actions/notification-actions"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function NotificationBell() {
  const [notifications, setNotifications] = useState<{ id: string, title: string, message: string, read: boolean, link_url?: string }[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const fetchNotifications = async () => {
    const data = await getNotifications()
    setNotifications(data)
  }

  useEffect(() => {
    fetchNotifications()
    // Optional: poll every minute
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id)
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="relative hidden md:flex" />}>
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        )}
        <span className="sr-only">Notifications</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <span className="font-semibold text-sm">Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto py-1 px-2 text-xs" onClick={handleMarkAllAsRead}>
              Mark all read
            </Button>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`flex flex-col gap-1 p-3 border-b last:border-0 hover:bg-muted/50 transition-colors ${!notification.read ? 'bg-muted/20' : ''}`}
                onClick={() => {
                  if (!notification.read) handleMarkAsRead(notification.id)
                }}
              >
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium">{notification.title}</span>
                  {!notification.read && <span className="h-2 w-2 mt-1.5 rounded-full bg-primary" />}
                </div>
                <span className="text-xs text-muted-foreground line-clamp-2">{notification.message}</span>
                {notification.link_url && (
                  <Link href={notification.link_url} className="text-xs text-primary mt-1 hover:underline w-fit" onClick={() => setIsOpen(false)}>
                    View details
                  </Link>
                )}
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
