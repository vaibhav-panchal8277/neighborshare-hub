"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Loader2 } from "lucide-react"

interface Message {
  id: string
  booking_id: string
  sender_id: string
  content: string
  created_at: string
}

export function ChatWindow({
  bookingId,
  currentUserId,
  otherUserName,
  otherUserAvatar
}: {
  bookingId: string
  currentUserId: string
  otherUserName: string
  otherUserAvatar: string
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("booking_id", bookingId)
        .order("created_at", { ascending: true })

      if (!error && data) {
        setMessages(data)
      }
      setIsLoading(false)
    }

    fetchMessages()

    // Subscribe to real-time changes
    const channel = supabase
      .channel(`chat_${bookingId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `booking_id=eq.${bookingId}`
        },
        (payload) => {
          const newMsg = payload.new as Message
          setMessages((prev) => {
            // Prevent duplicates if we already inserted it optimistically
            if (prev.find((m) => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [bookingId, supabase])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return

    const content = newMessage.trim()
    setNewMessage("")
    setIsSending(true)

    // Optmistic UI update
    const optimisticMsg: Message = {
      id: `temp_${Date.now()}`,
      booking_id: bookingId,
      sender_id: currentUserId,
      content,
      created_at: new Date().toISOString()
    }
    setMessages((prev) => [...prev, optimisticMsg])

    const { error } = await supabase.from("messages").insert({
      booking_id: bookingId,
      sender_id: currentUserId,
      content: content
    } as never)

    if (error) {
      console.error("Failed to send message:", error)
      // Revert optimistic update on failure
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id))
    }
    
    setIsSending(false)
  }

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex flex-col h-[80vh] max-h-[600px] border rounded-lg bg-card overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b bg-muted/30 flex items-center gap-3">
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={otherUserAvatar} />
          <AvatarFallback>{otherUserName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold leading-none">{otherUserName}</h3>
          <p className="text-xs text-muted-foreground mt-1">Live Chat</p>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-muted-foreground flex-col">
            <p>No messages yet.</p>
            <p className="text-xs mt-1">Send a message to start coordinating!</p>
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {messages.map((msg) => {
              const isMe = msg.sender_id === currentUserId
              return (
                <div key={msg.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isMe && (
                    <Avatar className="h-8 w-8 mt-auto shrink-0">
                      <AvatarImage src={otherUserAvatar} />
                      <AvatarFallback>{otherUserName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                    <div 
                      className={`px-4 py-2 rounded-2xl ${
                        isMe 
                          ? 'bg-primary text-primary-foreground rounded-br-sm' 
                          : 'bg-muted text-foreground rounded-bl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1 px-1">
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                </div>
              )
            })}
            <div ref={scrollRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="p-3 border-t bg-background">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex h-10 w-full rounded-full border border-input bg-transparent px-4 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSending}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="rounded-full shrink-0"
            disabled={!newMessage.trim() || isSending}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
