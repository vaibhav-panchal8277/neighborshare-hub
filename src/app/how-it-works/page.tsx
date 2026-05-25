import { CheckCircle2, Shield, Wrench, ArrowRight, Search, Handshake, Package, ListPlus, CheckSquare, Banknote } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-50 py-16 md:py-24 border-b">
        <div className="container px-4 md:px-6 mx-auto max-w-5xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-slate-900 tracking-tight mb-6">
            How Borrowly Works
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto text-balance">
            Your trusted, hyperlocal platform for borrowing and lending rarely-used items. Save money, reduce waste, and build community connections.
          </p>
        </div>
      </section>

      {/* How it Works: Borrowers & Lenders Side-by-Side */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            
            {/* Borrowers Column */}
            <div>
              <div className="flex items-center mb-10">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4">
                  <Wrench className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold font-heading">For Borrowers</h2>
              </div>

              <div className="relative pl-8 md:pl-0">
                {/* Vertical connecting line */}
                <div className="absolute left-[39px] md:left-[47px] top-4 bottom-4 w-1 bg-slate-200 rounded-full" />
                
                <div className="flex flex-col space-y-12">
                  {/* Step 1 */}
                  <div className="relative flex items-start">
                    <div className="flex-shrink-0 relative z-10">
                      <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-white border-4 border-slate-50 flex items-center justify-center shadow-md">
                        <div className="absolute -top-1 -right-1 h-6 w-6 md:h-8 md:w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm md:text-base">1</div>
                        <Search className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                      </div>
                    </div>
                    <div className="ml-6 mt-2 md:mt-4">
                      <h3 className="text-xl font-bold mb-2">Find What You Need</h3>
                      <p className="text-slate-600">
                        Search your local neighborhood for tools, electronics, party supplies, and more.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative flex items-start">
                    <div className="flex-shrink-0 relative z-10">
                      <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-white border-4 border-slate-50 flex items-center justify-center shadow-md">
                        <div className="absolute -top-1 -right-1 h-6 w-6 md:h-8 md:w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm md:text-base">2</div>
                        <Handshake className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                      </div>
                    </div>
                    <div className="ml-6 mt-2 md:mt-4">
                      <h3 className="text-xl font-bold mb-2">Request to Borrow</h3>
                      <p className="text-slate-600">
                        Choose dates and send a request. Escrow ensures your deposit is safe.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative flex items-start">
                    <div className="flex-shrink-0 relative z-10">
                      <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-white border-4 border-slate-50 flex items-center justify-center shadow-md">
                        <div className="absolute -top-1 -right-1 h-6 w-6 md:h-8 md:w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm md:text-base">3</div>
                        <Package className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                      </div>
                    </div>
                    <div className="ml-6 mt-2 md:mt-4">
                      <h3 className="text-xl font-bold mb-2">Pick Up & Use</h3>
                      <p className="text-slate-600">
                        Meet your neighbor, use the item, and return it for a full refund.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lenders Column */}
            <div>
              <div className="flex items-center mb-10">
                <div className="h-12 w-12 rounded-full bg-trust/10 text-trust flex items-center justify-center mr-4">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold font-heading">For Lenders</h2>
              </div>

              <div className="relative pl-8 md:pl-0">
                {/* Vertical connecting line */}
                <div className="absolute left-[39px] md:left-[47px] top-4 bottom-4 w-1 bg-slate-200 rounded-full" />
                
                <div className="flex flex-col space-y-12">
                  {/* Step 1 */}
                  <div className="relative flex items-start">
                    <div className="flex-shrink-0 relative z-10">
                      <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-white border-4 border-slate-50 flex items-center justify-center shadow-md">
                        <div className="absolute -top-1 -right-1 h-6 w-6 md:h-8 md:w-8 rounded-full bg-trust text-white flex items-center justify-center font-bold text-sm md:text-base">1</div>
                        <ListPlus className="h-8 w-8 md:h-10 md:w-10 text-trust" />
                      </div>
                    </div>
                    <div className="ml-6 mt-2 md:mt-4">
                      <h3 className="text-xl font-bold mb-2">List Your Items</h3>
                      <p className="text-slate-600">
                        Snap a few photos of your idle gear, set your rules, and choose your fees.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative flex items-start">
                    <div className="flex-shrink-0 relative z-10">
                      <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-white border-4 border-slate-50 flex items-center justify-center shadow-md">
                        <div className="absolute -top-1 -right-1 h-6 w-6 md:h-8 md:w-8 rounded-full bg-trust text-white flex items-center justify-center font-bold text-sm md:text-base">2</div>
                        <CheckSquare className="h-8 w-8 md:h-10 md:w-10 text-trust" />
                      </div>
                    </div>
                    <div className="ml-6 mt-2 md:mt-4">
                      <h3 className="text-xl font-bold mb-2">Approve Requests</h3>
                      <p className="text-slate-600">
                        Review borrower profiles and approve requests you&apos;re comfortable with.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative flex items-start">
                    <div className="flex-shrink-0 relative z-10">
                      <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-white border-4 border-slate-50 flex items-center justify-center shadow-md">
                        <div className="absolute -top-1 -right-1 h-6 w-6 md:h-8 md:w-8 rounded-full bg-trust text-white flex items-center justify-center font-bold text-sm md:text-base">3</div>
                        <Banknote className="h-8 w-8 md:h-10 md:w-10 text-trust" />
                      </div>
                    </div>
                    <div className="ml-6 mt-2 md:mt-4">
                      <h3 className="text-xl font-bold mb-2">Handover & Earn</h3>
                      <p className="text-slate-600">
                        Meet up to hand over the item and help your community while earning.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-16 md:py-24 bg-slate-900 text-white">
        <div className="container px-4 md:px-6 mx-auto max-w-5xl text-center">
          <Shield className="h-16 w-16 text-trust mx-auto mb-6" />
          <h2 className="text-3xl font-bold font-heading mb-6">Trust & Safety First</h2>
          <div className="grid md:grid-cols-2 gap-8 text-left mt-12 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-xl font-bold mb-3 flex items-center text-trust">
                <CheckCircle2 className="h-5 w-5 mr-2" /> Verified Identity
              </h3>
              <p className="text-slate-300">
                Every neighbor goes through identity and address verification before they can participate. No anonymous users allowed.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-xl font-bold mb-3 flex items-center text-amber-400">
                <CheckCircle2 className="h-5 w-5 mr-2" /> Secure Escrow
              </h3>
              <p className="text-slate-300">
                Deposits are held securely by Stripe and only captured if a dispute is filed and verified. Otherwise, they are released immediately upon return.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <div className="container px-4 md:px-6 mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold font-heading mb-6">Ready to get started?</h2>
          <p className="text-lg text-slate-600 mb-8">
            Join your local community today and start sharing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/browse">
              <Button size="lg" className="w-full sm:w-auto">
                <SearchIcon className="mr-2 h-5 w-5" />
                Browse Items
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Create an Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
