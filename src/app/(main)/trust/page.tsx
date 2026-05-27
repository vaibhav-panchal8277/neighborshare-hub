import { ShieldCheck, Star, Sparkles, MessageSquare, BookOpen, AlertCircle, HeartHandshake } from "lucide-react"

import { Button } from "@/components/ui/button"
import Link from "next/link"

const TRUST_FEATURES = [
  {
    icon: ShieldCheck,
    title: "Verified Neighbors",
    description: "Every member in our community undergoes identity and address validation, ensuring that you share with genuine, real people who live in your neighborhood.",
  },
  {
    icon: Star,
    title: "Ratings & Peer Reviews",
    description: "Honest feedback after every transaction keeps our ecosystem transparent. Read reviews from other neighbors before listing or requesting any item.",
  },
  {
    icon: HeartHandshake,
    title: "Damage Protection Guarantee",
    description: "Our community protection program has you covered. In the rare event of accidental damage or loss, we step in to ensure items are repaired or replaced.",
  },
  {
    icon: MessageSquare,
    title: "Secure On-Platform Chat",
    description: "Keep your personal phone number private. Coordinate pickup times, share usage instructions, and finalize details using our fully encrypted inbox.",
  },
  {
    icon: BookOpen,
    title: "Clear Community Standards",
    description: "Our shared principles foster respect and reliability. Neighbors agree to return items clean, on time, and in the condition they received them.",
  },
  {
    icon: Sparkles,
    title: "Zero Fees for Basic Sharing",
    description: "We are built on community spirit. Peer-to-peer sharing between verified neighbors incurs zero platform transaction fees, keeping sharing accessible.",
  },
]

const FAQS = [
  {
    question: "What if my shared item gets damaged or broken?",
    answer: "Accidents happen! In the vast majority of cases, neighbors resolve small accidents amicably. For larger issues, Borrowly's Damage Protection Guarantee covers verified listings. We will help facilitate repair costs or market-value replacements up to $500.",
  },
  {
    question: "How do I verify the identity of a borrower or lender?",
    answer: "We require mandatory email, phone, and optional government ID checks during registration. When a rental is requested, you can view the member's profile summary, complete transaction history, rating score, and direct written reviews from other community members.",
  },
  {
    question: "What if a neighbor returns an item late?",
    answer: "Our sharing window is based on mutual agreements. If an unexpected delay occurs, neighbors can easily request an extension in our chat. Unreported late returns are subject to a standard community warning and small late fees to compensate the owner.",
  },
  {
    question: "How does item pickup and drop-off work safely?",
    answer: "For your comfort and safety, we recommend coordinating pickups in daylight hours at public spaces (like a local cafe, library, or grocery store parking lot) or exchanging them on porch drop-offs if you are immediate neighbors.",
  },
]

export default function TrustPage() {
  return (
    <div className="container max-w-5xl py-12 md:py-20">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-400 mb-4 border border-teal-500/20">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Your Safety is Our Priority</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-heading mb-4 py-2 leading-tight bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 bg-clip-text text-transparent">
          Trust & Safety
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          We are built on trust. Learn how we safeguard our community and keep every interaction secure, reliable, and respectful.
        </p>
      </div>

      {/* Trust Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {TRUST_FEATURES.map((feature, idx) => {
          const Icon = feature.icon
          return (
            <div key={idx} className="flex gap-4 p-5 rounded-2xl border bg-card/50 hover:bg-card hover:shadow-sm transition-all duration-200">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 tracking-tight">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Community Oath Callout */}
      <div className="rounded-3xl border bg-gradient-to-r from-teal-50/50 to-blue-50/50 dark:from-teal-950/20 dark:to-blue-950/20 p-8 md:p-12 mb-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-3">
            <HeartHandshake className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">The Neighbor Share Pledge</h2>
          </div>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            By joining Borrowly, every member pledges to treat shared items with the same care as their own, respect agreed pickup times, and return items clean and ready for the next neighbor.
          </p>
        </div>
        <Link href="/signup">
          <Button size="lg" className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold shadow-md whitespace-nowrap">
            Join the Neighborhood
          </Button>
        </Link>
      </div>

      {/* Trust FAQ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-heading text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="p-6 rounded-2xl border bg-card">
              <h3 className="text-base md:text-lg font-bold mb-2 tracking-tight flex items-start gap-2.5">
                <AlertCircle className="h-5 w-5 shrink-0 text-teal-600 dark:text-teal-400 mt-0.5" />
                <span>{faq.question}</span>
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed pl-7">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
