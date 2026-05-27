import { Scale, Clock, ShieldAlert } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="container max-w-4xl py-12 md:py-20">
      {/* Page Header */}
      <div className="flex flex-col items-center text-center mb-12 md:mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-4 border border-indigo-500/20">
          <Scale className="h-3.5 w-3.5" />
          <span>Legally Binding Agreement</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-heading mb-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
          Terms of Service
        </h1>
        <p className="text-sm text-muted-foreground flex items-center gap-1.5 justify-center">
          <Clock className="h-4 w-4" />
          <span>Last Updated: May 27, 2026</span>
        </p>
      </div>

      {/* Document Content */}
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <div className="rounded-2xl border p-6 bg-muted/20">
          <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>Welcome to Borrowly!</span>
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Please read these Terms of Service (&quot;Terms&quot;) carefully before using the Borrowly (NeighborShare-Hub) platform. By accessing or using our website, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, you must not use our services.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight border-b pb-2">1. Account Registration & Verification</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            To unlock borrowing and listing features, you must register for an account and undergo standard verification. You agree to provide accurate, current, and complete information. You are solely responsible for protecting your account credentials and represent that you are at least 18 years of age.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight border-b pb-2">2. Listing and Lending Items</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            As a Lender, you represent that you own or have all necessary rights to list and share the items on the platform. All listings must be described accurately. You agree not to list items that are defective, dangerous, recalled, or prohibited by our guidelines (e.g., weapons, hazardous chemicals, or highly regulated equipment).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight border-b pb-2">3. Borrowing & Returning Conditions</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            As a Borrower, you agree to treat the borrowed item with the utmost care and responsibility. You are required to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
            <li>Return the item strictly on or before the agreed date and time.</li>
            <li>Ensure the item is returned clean, dry, and in the same working condition as received.</li>
            <li>Report any damage or operational issues to the lender immediately via secure chat.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight border-b pb-2">4. Liability & Damage Protection Program</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            While Borrowly provides a Damage Protection Guarantee to cover verified listings against accidental losses, users acknowledge that peer-to-peer sharing carries inherent risks. To the maximum extent permitted by law, Borrowly is not liable for direct, indirect, or incidental damages resulting from the use or malfunction of shared items.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight border-b pb-2">5. Prohibited Conduct</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Users agree not to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
            <li>Harass, abuse, or threaten other neighbors.</li>
            <li>Use the platform for commercial rental services without prior approval.</li>
            <li>Provide false location coordinates or misleading verification information.</li>
            <li>Share illegal, copyrighted, or prohibited goods.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight border-b pb-2">6. Changes to Terms</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We reserve the right to modify these Terms at any time. When we make updates, we will revise the &quot;Last Updated&quot; date at the top of this page. Your continued use of the platform after updates have been published constitutes your agreement to the new Terms.
          </p>
        </section>
      </div>
    </div>
  )
}
