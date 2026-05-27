import Link from "next/link"
import { Hammer, Laptop, Bike, ChefHat, Sparkles, HelpCircle, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

const CATEGORIES = [
  {
    id: "tools",
    name: "Tools & Equipment",
    description: "Drills, lawnmowers, ladders, and other home improvement tools.",
    icon: Hammer,
    bgLight: "bg-blue-500/10",
    textLight: "text-blue-600 dark:text-blue-400",
    examples: ["Power Drill", "Extension Ladder", "Pressure Washer", "Leaf Blower"],
  },
  {
    id: "electronics",
    name: "Electronics",
    description: "Projectors, cameras, audio gear, and rarely used tech accessories.",
    icon: Laptop,
    bgLight: "bg-teal-500/10",
    textLight: "text-teal-600 dark:text-teal-400",
    examples: ["4K Projector", "DSLR Camera", "PA Speakers", "VR Headset"],
  },
  {
    id: "sports",
    name: "Sports & Outdoors",
    description: "Camping gear, bicycles, kayaks, and seasonal sporting equipment.",
    icon: Bike,
    bgLight: "bg-blue-500/10",
    textLight: "text-blue-600 dark:text-blue-400",
    examples: ["4-Person Tent", "Mountain Bike", "Paddleboard", "Tennis Rackets"],
  },
  {
    id: "kitchen",
    name: "Kitchen & Dining",
    description: "Stand mixers, pressure cookers, dehydrators, and event diningware.",
    icon: ChefHat,
    bgLight: "bg-teal-500/10",
    textLight: "text-teal-600 dark:text-teal-400",
    examples: ["KitchenAid Mixer", "Air Fryer", "Chocolate Fountain", "Ice Maker"],
  },
  {
    id: "party",
    name: "Party & Events",
    description: "Popcorn machines, folding tables, canopies, and event decorations.",
    icon: Sparkles,
    bgLight: "bg-blue-500/10",
    textLight: "text-blue-600 dark:text-blue-400",
    examples: ["10x10 Canopy", "Foldable Table Set", "Smoke Machine", "Karaoke Mic"],
  },
  {
    id: "other",
    name: "Other Items",
    description: "Board games, textbook guides, luggage, and miscellaneous tools.",
    icon: HelpCircle,
    bgLight: "bg-teal-500/10",
    textLight: "text-teal-600 dark:text-teal-400",
    examples: ["Luggage Set", "Board Game Bundle", "Car Roof Rack", "Sewing Machine"],
  },
]

export default function CategoriesPage() {
  return (
    <div className="container max-w-6xl py-12 md:py-20">
      <div className="flex flex-col items-center text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-heading mb-4 py-2 leading-tight bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 bg-clip-text text-transparent">
          Explore by Category
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Find exactly what you need right in your local neighborhood. Borrowing helps you save money, declutter your space, and reduce carbon footprint.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {CATEGORIES.map((category) => {
          const Icon = category.icon
          return (
            <div
              key={category.id}
              className="group relative flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:hover:border-foreground/20"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${category.bgLight} ${category.textLight}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">{category.name}</h2>
                </div>
                
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  {category.description}
                </p>

                <div className="mb-6">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                    Popular Items
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {category.examples.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <Link href={`/browse?category=${category.id}`} className="mt-auto pt-4 block">
                <Button className="w-full justify-between hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-colors" variant="outline">
                  <span>Browse items</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          )
        })}
      </div>

      <div className="mt-16 md:mt-24 rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 text-white p-8 md:p-12 shadow-xl relative overflow-hidden flex flex-col items-center text-center">
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        <h2 className="text-2xl md:text-3xl font-bold mb-4 relative z-10">
          Have items lying around gathering dust?
        </h2>
        <p className="text-slate-300 max-w-xl mb-8 relative z-10 text-sm md:text-base leading-relaxed">
          List them today and start helping your neighbors. Turn your idle tools, camping gear, and appliances into community goodwill.
        </p>
        <Link href="/listings/new" className="relative z-10">
          <Button size="lg" className="bg-white hover:bg-slate-100 text-slate-900 font-semibold shadow-md">
            List an Item Now
          </Button>
        </Link>
      </div>
    </div>
  )
}
