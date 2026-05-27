import { Shield, Clock, Lock } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl py-12 md:py-20">
      {/* Page Header */}
      <div className="flex flex-col items-center text-center mb-12 md:mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-4 border border-blue-500/20">
          <Shield className="h-3.5 w-3.5" />
          <span>Your Privacy Matters</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-heading mb-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
          Privacy Policy
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
            <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Our Commitment to You</span>
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            At Borrowly (NeighborShare-Hub), we respect your privacy and are committed to protecting your personal data. This Privacy Policy describes how we collect, use, store, and share your information when you register, browse listings, or interact with other neighbors on our platform.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight border-b pb-2">1. Information We Collect</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We collect information that you directly provide when registering and using Borrowly, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
            <li><strong>Account Details:</strong> Full name, email address, password, phone number, and neighborhood zip code.</li>
            <li><strong>Profile Information:</strong> Optional display name, avatar image, short bio, and rating scores.</li>
            <li><strong>Listings & Transactions:</strong> Item descriptions, images, lending rules, booking history, and chat messages.</li>
            <li><strong>Verification Records:</strong> Necessary credentials submitted during optional identity/address verification (never stored publicly).</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight border-b pb-2">2. How We Use Your Data</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We process your information to deliver a safe, functioning sharing experience:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
            <li>To match listing requests and coordinate exchanges down your street.</li>
            <li>To facilitate secure, platform-based chat between Lenders and Borrowers.</li>
            <li>To confirm user identities and maintain trust ratings across the platform.</li>
            <li>To troubleshoot operations, resolve support tickets, and improve platform speed.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight border-b pb-2">3. Sharing Your Information</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We believe in complete transparency. We <span className="font-semibold text-foreground">never</span> sell your personal data to advertisers. Your information is shared only in the following scenarios:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
            <li><strong>With Other Neighbors:</strong> Your display name, rating, active listings, and chat communications are visible to neighbors you coordinate with. Precise locations are kept private; we only display general neighborhood zones.</li>
            <li><strong>For Legal Protection:</strong> If required by law, to enforce our Terms of Service, or to protect the safety and security of our community members.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight border-b pb-2">4. Data Retention & Deletion</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We retain your information for as long as your account is active or needed to provide you our services. If you wish to delete your account or request that we delete your stored personal data, you can do so in your Profile Settings or by reaching out to our support team at <span className="font-semibold text-foreground">support@borrowly.com</span>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight border-b pb-2">5. Security of Your Data</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We employ industry-standard electronic safety measures, including Secure Socket Layer (SSL) encryption, to protect your accounts and databases from unauthorized access, disclosure, or altering of information. While we strive to use commercially acceptable means, no method of transmission is 100% secure.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight border-b pb-2">6. Your Privacy Rights</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Depending on your local region, you have rights to access, download, correct, or restrict the processing of your personal data. You can manage these settings and details directly inside your user dashboard.
          </p>
        </section>
      </div>
    </div>
  )
}
