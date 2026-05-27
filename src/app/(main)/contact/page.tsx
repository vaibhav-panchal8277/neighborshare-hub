"use client"

import { useState } from "react"
import { Mail, MessageSquare, Clock, MapPin, CheckCircle2, Send, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "support",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: "", email: "", subject: "support", message: "" })
  }

  return (
    <div className="container max-w-5xl py-12 md:py-20">
      <div className="flex flex-col items-center text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-heading mb-4 py-2 leading-tight bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 bg-clip-text text-transparent">
          Contact Us
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Have questions, suggestions, or need assistance? We are here to support your community sharing journey.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        {/* Contact info column */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-4 font-heading">
              Get in Touch
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
              Our support team is dedicated to fostering a friendly and safe environment. Drop us a line and we will get back to you as quickly as possible.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4 items-start p-4 rounded-xl border bg-card/40">
              <Mail className="h-5 w-5 text-primary mt-1 shrink-0 bg-blue-500/10 p-1 rounded-md" />
              <div>
                <h3 className="font-semibold text-sm">General & Support Email</h3>
                <p className="text-sm text-muted-foreground mt-0.5">support@borrowly.com</p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 rounded-xl border bg-card/40">
              <Clock className="h-5 w-5 text-teal-600 mt-1 shrink-0 bg-teal-500/10 p-1 rounded-md" />
              <div>
                <h3 className="font-semibold text-sm">Expected Response Time</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Under 24 hours (Monday to Friday)</p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 rounded-xl border bg-card/40">
              <MapPin className="h-5 w-5 text-primary mt-1 shrink-0 bg-blue-500/10 p-1 rounded-md" />
              <div>
                <h3 className="font-semibold text-sm">Headquarters</h3>
                <p className="text-sm text-muted-foreground mt-0.5">San Francisco, CA 94103</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border bg-secondary/30">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h3 className="font-bold">Looking for FAQs?</h3>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-4">
              We have covered item protection, verification procedures, and late returns directly on our safety page.
            </p>
            <Link href="/trust">
              <Button size="sm" variant="link" className="p-0 h-auto font-semibold gap-1 group text-primary">
                <span>Go to Safety & trust</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border bg-card p-6 md:p-8 shadow-sm">
            {isSubmitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-2 border border-emerald-500/20">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Message Sent Successfully!</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out to us. We have received your inquiry and our support team will respond to you within 24 hours.
                </p>
                <Button variant="outline" className="mt-6" onClick={() => setIsSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-semibold">
                      Your Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-semibold">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-semibold">
                    Inquiry Subject
                  </label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="support">General Support</option>
                    <option value="feedback">Feedback & Ideas</option>
                    <option value="partnership">Partnership inquiries</option>
                    <option value="safety">Trust & Safety Concern</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-semibold">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    placeholder="Describe how we can help you..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                <Button type="submit" className="w-full gap-2 shadow-sm font-semibold" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
