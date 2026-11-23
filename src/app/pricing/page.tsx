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
      cta: "Explore Showcase",
      ctaHref: "/sites",
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
      cta: "Explore Showcase",
      ctaHref: "/sites",
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
      cta: "Contact Team",
      ctaHref: "/contact",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FCF0DA] dark:bg-[#171513] text-[#4C4541] dark:text-[#FBF3E6] flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#5A5B35] dark:text-[#AEAC78]">
            TRANSPARENT HOSTING TIERS
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#4C4541] dark:text-[#FBF3E6]">
            Simple, predictable pricing
          </h1>
          <p className="text-base text-[#7A6F68] dark:text-[#B5AAA0]">
            Deploy your static websites instantly. Scale as your portfolio and visitor traffic grows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((p, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border p-8 flex flex-col justify-between relative shadow-sm ${
                p.popular
                  ? "border-[#AEAC78] bg-[#FFF8ED] dark:bg-[#24201C] ring-2 ring-[#AEAC78]/30"
                  : "border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C]"
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#AEAC78] text-[#171513] text-[10px] uppercase font-bold tracking-wider px-3 py-0.5 rounded-full shadow-sm">
                  Recommended
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[#4C4541] dark:text-[#FBF3E6]">{p.name}</h3>
                  <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0] mt-1">{p.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[#4C4541] dark:text-[#FBF3E6]">{p.price}</span>
                  <span className="text-xs text-[#7A6F68] dark:text-[#B5AAA0]">/{p.period}</span>
                </div>

                <ul className="space-y-2.5 pt-4 border-t border-[#DECBB0] dark:border-[#3D352F] text-xs text-[#4C4541] dark:text-[#FBF3E6]">
                  {p.features.map((f, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#AEAC78] shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <Link
                  href={p.ctaHref}
                  className={`w-full inline-flex items-center justify-center rounded-xl py-2.5 text-xs font-semibold transition-all ${
                    p.popular
                      ? "bg-[#F2C46A] hover:bg-[#E5B555] text-[#2D2305] shadow-sm"
                      : "bg-[#F5E5C9] dark:bg-[#2D2823] text-[#4C4541] dark:text-[#FBF3E6] hover:bg-[#EAD6B5] dark:hover:bg-[#38312B] border border-[#DECBB0] dark:border-[#3D352F]"
                  }`}
                >
                  {p.cta}
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
