import Image from "next/image"
import { Search, MapPin, Hammer, Wrench, Scissors, Camera, Music, Book, Bike, Coffee } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 lg:py-48 bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Animated Background Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <Hammer className="absolute top-[10%] left-[5%] h-12 w-12 animate-pulse text-white/40" style={{ animationDuration: '4s' }} />
          <Wrench className="absolute top-[20%] right-[10%] h-16 w-16 animate-bounce text-white/30" style={{ animationDuration: '6s' }} />
          <Scissors className="absolute bottom-[15%] left-[15%] h-10 w-10 animate-pulse text-white/50" style={{ animationDuration: '5s' }} />
          <Camera className="absolute top-[40%] left-[8%] h-14 w-14 animate-bounce text-white/20" style={{ animationDuration: '7s' }} />
          <Music className="absolute bottom-[20%] right-[15%] h-12 w-12 animate-pulse text-white/40" style={{ animationDuration: '3.5s' }} />
          <Book className="absolute top-[15%] left-[40%] h-16 w-16 animate-bounce text-white/20" style={{ animationDuration: '8s' }} />
          <Bike className="absolute top-[30%] right-[30%] h-20 w-20 animate-pulse text-white/10" style={{ animationDuration: '5.5s' }} />
          <Coffee className="absolute bottom-[10%] right-[40%] h-10 w-10 animate-bounce text-white/40" style={{ animationDuration: '4.5s' }} />
        </div>

        <div className="container relative z-10 flex flex-col items-center text-center">
          <div className="mb-8">
            <Image
              src="/logo-icon.png"
              alt="Borrowly"
              width={100}
              height={100}
              className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-2xl"
              priority
            />
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold max-w-4xl tracking-tight text-balance">
            Borrow what you need, lend what you don&apos;t.
          </h1>
          <p className="mt-6 text-xl text-slate-300 max-w-2xl text-balance">
            Join your trusted hyperlocal community to share expensive, rarely-used items. Save money and build trust.
          </p>
          
          <div className="mt-10 w-full max-w-2xl bg-white rounded-lg p-2 flex flex-col sm:flex-row shadow-xl">
            <div className="flex flex-1 items-center px-4 py-2 border-b sm:border-b-0 sm:border-r border-slate-200">
              <Search className="h-5 w-5 text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="What do you need? (e.g. power drill)" 
                className="w-full bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400"
              />
            </div>
            <div className="flex flex-1 items-center px-4 py-2">
              <MapPin className="h-5 w-5 text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="Neighborhood or Zip" 
                className="w-full bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400"
              />
            </div>
            <Button size="lg" className="mt-2 sm:mt-0 sm:ml-2 w-full sm:w-auto h-12 text-base">
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center p-6">
              <div className="h-16 w-16 bg-trust/10 text-trust rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 font-heading">Verified Neighbors</h3>
              <p className="text-slate-600">Every member passes identity and address verification before they can borrow or lend.</p>
            </div>
            <div className="flex flex-col items-center p-6">
              <div className="h-16 w-16 bg-amber-500/10 text-amber-600 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 font-heading">Secure Escrow</h3>
              <p className="text-slate-600">Deposits are held safely in escrow and automatically returned when the item comes back.</p>
            </div>
            <div className="flex flex-col items-center p-6">
              <div className="h-16 w-16 bg-skill/10 text-skill rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 font-heading">Skill Sharing</h3>
              <p className="text-slate-600">Borrowers can opt to learn how to use the item from the lender, fostering community connection.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
