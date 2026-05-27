import { Leaf, Users, ShieldCheck, Share2, Globe, Heart, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import Link from "next/link"

const VALUES = [
  {
    icon: Leaf,
    title: "Sustainability",
    description: "Production of goods accounts for a massive portion of global emissions. By sharing, we reduce demand for new products, prevent plastic waste, and lower our carbon footprint.",
  },
  {
    icon: Users,
    title: "True Community",
    description: "In an increasingly digital world, we bring neighbors face-to-face. Sharing creates a powerful culture of helpfulness, conversation, and stronger local support networks.",
  },
  {
    icon: ShieldCheck,
    title: "Unwavering Trust",
    description: "Safety and peace of mind are the bedrock of our platform. We verify all members and support listings with protection guarantees so sharing feels completely safe and simple.",
  },
  {
    icon: Share2,
    title: "Access Over Ownership",
    description: "Why buy a power washer you use once a year, store in a cluttered garage, and pay hundreds for? We believe access beats ownership every single day.",
  },
]

const STATS = [
  { value: "$250+", label: "Saved per family annually" },
  { value: "80%", label: "Lesser storage clutter" },
  { value: "15kg+", label: "CO2 offset per share event" },
  { value: "100%", label: "Hyperlocal trust score" },
]

export default function AboutPage() {
  return (
    <div className="container max-w-5xl py-12 md:py-20">
      {/* Intro Hero Section */}
      <div className="flex flex-col items-center text-center mb-16 md:mb-24">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-4 border border-blue-500/20">
          <Heart className="h-3.5 w-3.5" />
          <span>Made for Neighbors, by Neighbors</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading mb-6 py-2 leading-tight bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 bg-clip-text text-transparent">
          Sharing is Caring.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
          Welcome to <span className="font-semibold text-foreground">Borrowly</span>. We are a dedicated hyperlocal sharing platform built on a simple promise: <span className="font-semibold text-foreground">Borrow what you need, lend what you don&apos;t.</span>
        </p>
      </div>

      {/* Story Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20 md:mb-28">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 font-heading">
            The Clutter Conundrum
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
            Look in your garage, closet, or attic. Chances are, you own a drill, a pressure washer, a camping tent, or a set of luggage that sits completely untouched 350 days of the year.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Meanwhile, your neighbor down the street is headed to the department store to buy those exact same items—spending hundreds of dollars, cluttering their own space, and contributing to unnecessary manufacturing waste.
          </p>
        </div>
        <div className="rounded-3xl border bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 text-white relative overflow-hidden flex flex-col justify-center min-h-[300px]">
          <div className="absolute top-[10%] right-[10%] opacity-10">
            <Globe className="h-40 w-40" />
          </div>
          <span className="text-teal-400 font-bold uppercase tracking-wider text-xs block mb-2">
            The Opportunity
          </span>
          <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-4">
            A Better Way to Live
          </h3>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Borrowly connects neighbors instantly. We help you share high-quality, rarely-used goods right down your street. You save money, declutter your closets, make new friendships, and protect our environment.
          </p>
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-3xl border bg-card mb-20 md:mb-28">
        {STATS.map((stat, idx) => (
          <div key={idx} className="flex flex-col items-center text-center">
            <span className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent mb-1">
              {stat.value}
            </span>
            <span className="text-xs md:text-sm font-semibold text-muted-foreground">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Values Section */}
      <div className="mb-20">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center mb-12 font-heading">
          Our Guiding Principles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {VALUES.map((value, idx) => {
            const Icon = value.icon
            const isEven = idx % 2 === 0
            return (
              <div key={idx} className="flex gap-4 p-6 rounded-2xl border bg-card/40 hover:bg-card hover:shadow-sm transition-all duration-200">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${isEven ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 'bg-teal-500/10 text-teal-600 border-teal-500/20'} border`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 tracking-tight">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Final Action */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 text-white p-8 md:p-12 text-center shadow-xl flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Ready to build a better community?
        </h2>
        <p className="text-blue-100 max-w-xl mb-8 text-sm md:text-base leading-relaxed">
          Create your free verified account in minutes and start discovering items or helping your neighborhood today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/signup">
            <Button size="lg" className="bg-white hover:bg-slate-100 text-slate-900 font-semibold shadow-md w-full sm:w-auto">
              Get Started Free
            </Button>
          </Link>
          <Link href="/browse">
            <Button size="lg" variant="ghost" className="border border-white/30 hover:bg-white/10 text-white hover:text-white font-semibold w-full sm:w-auto gap-2 group">
              <span>Explore Items</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
