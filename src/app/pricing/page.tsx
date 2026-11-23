import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Check } from "lucide-react";

export default function PricingPage() {
  const plans = [
    {
      name: "Free Starter",
      price: "$0",
      period: "forever",
      description: "For students, personal portfolios, and hobby experiments.",
      features: [
        "Up to 3 Active Websites",
        "Dedicated *.sitenest.com Subdomains",
        "100MB Total Storage",
        "1-Click Version Rollbacks",
        "Community Support",
      ],
      popular: false,
      cta: "Get Started Free",
    },
    {
      name: "Pro Creator",
      price: "$12",
      period: "per month",
      description: "Ideal for freelancers, developers, and agency showcases.",
      features: [
        "Unlimited Hosted Websites",
        "Custom Domain Mapping",
        "10GB High-Speed Storage",
        "Priority Background Worker",
        "Full Release History & Rollback",
        "Visitor Analytics",
      ],
      popular: true,
      cta: "Deploy with Pro",
    },
    {
      name: "Business Fleet",
      price: "$49",
      period: "per month",
      description: "For agencies and teams managing large client fleets.",
      features: [
        "Everything in Pro",
        "Unlimited Team Members",
        "100GB Dedicated Storage",
        "Custom SSL Certificates",
        "Audit Activity Logs & SSO",
        "24/7 Priority Support",
      ],
      popular: false,
      cta: "Contact Sales",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
            TRANSPARENT HOSTING TIERS
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Simple, predictable pricing
          </h1>
          <p className="text-base text-zinc-400">
            Deploy your static websites instantly. Scale as your portfolio and visitor traffic grows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((p, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border p-8 flex flex-col justify-between relative ${
                p.popular
                  ? "border-indigo-500 bg-indigo-950/20 shadow-xl shadow-indigo-500/10"
                  : "border-zinc-800 bg-zinc-900/40"
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-0.5 rounded-full">
                  Recommended
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{p.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1">{p.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">{p.price}</span>
                  <span className="text-xs text-zinc-400">/{p.period}</span>
                </div>

                <ul className="space-y-2.5 pt-4 border-t border-zinc-800 text-xs text-zinc-300">
                  {p.features.map((f, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <Link
                  href="/sites"
                  className={`w-full inline-flex items-center justify-center rounded-xl py-2.5 text-xs font-semibold transition-colors ${
                    p.popular
                      ? "bg-indigo-600 text-white hover:bg-indigo-500"
                      : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white"
                  }`}
                >
                  Explore Showcase
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
