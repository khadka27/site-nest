import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getHomepageSections } from "@/modules/cms/cmsService";
import { prisma } from "@/lib/prisma";
import {
  ShieldCheck,
  History,
  FolderArchive,
  Globe,
  Sliders,
  ArrowRight,
  Check,
  CheckCircle2,
  ExternalLink,
  Layers,
  Zap,
} from "lucide-react";

export default async function HomePage() {
  const [sections, showcaseSites] = await Promise.all([
    getHomepageSections(),
    prisma.website.findMany({
      where: { status: "LIVE" },
      take: 6,
      orderBy: { updatedAt: "desc" },
      include: {
        category: true,
        deployments: {
          where: { status: "LIVE" },
          orderBy: { version: "desc" },
          take: 1,
        },
      },
    }),
  ]);

  const secMap = new Map(sections.map((s) => [s.sectionKey, s]));
  const hero = secMap.get("hero")?.content as any;
  const stats = secMap.get("stats")?.content as any;
  const features = secMap.get("features")?.content as any;
  const howItWorks = secMap.get("how_it_works")?.content as any;
  const showcase = secMap.get("showcase")?.content as any;
  const pricing = secMap.get("pricing")?.content as any;
  const testimonials = secMap.get("testimonials")?.content as any;
  const faq = secMap.get("faq")?.content as any;

  return (
    <div className="min-h-screen bg-[#FCF0DA] dark:bg-[#171513] text-[#4C4541] dark:text-[#FBF3E6] flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        {secMap.get("hero")?.enabled !== false && (
          <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-36 bg-craft-grid">
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#AEAC78]/50 bg-[#FFF8ED]/90 dark:bg-[#24201C]/90 px-4 py-1.5 text-xs font-semibold text-[#5A5B35] dark:text-[#AEAC78] shadow-sm mb-8 backdrop-blur-sm">
                <Globe className="h-3.5 w-3.5 text-[#AEAC78]" />
                <span>{hero?.badge || "Instant Static Hosting & Wildcard Subdomains"}</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#4C4541] dark:text-[#FBF3E6] max-w-4xl mx-auto leading-tight">
                {hero?.title || "Upload. Deploy. Go Live."}
              </h1>

              {/* Subtitle */}
              <p className="mt-6 text-lg sm:text-xl text-[#7A6F68] dark:text-[#B5AAA0] max-w-2xl mx-auto leading-relaxed">
                {hero?.subtitle ||
                  "The modern platform to upload, manage, and host static websites through automatically generated subdomains. Blazing Nginx speed, isolated directories, and 1-click rollbacks."}
              </p>

              {/* Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href={hero?.primaryButton?.url || "/sites"}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#F2C46A] hover:bg-[#E5B555] text-[#2D2305] px-7 py-3.5 text-base font-semibold shadow-sm transition-all hover:-translate-y-0.5"
                >
                  <Globe className="h-5 w-5" />
                  {hero?.primaryButton?.text || "Explore Showcase"}
                </Link>
                <Link
                  href={hero?.secondaryButton?.url || "/login"}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] px-7 py-3.5 text-base font-semibold text-[#4C4541] dark:text-[#FBF3E6] hover:bg-[#F5E5C9] dark:hover:bg-[#2D2823] transition-all"
                >
                  {hero?.secondaryButton?.text || "Admin Sign In"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Highlights */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-[#7A6F68] dark:text-[#B5AAA0]">
                {(hero?.highlights || [
                  "100% Static HTML/CSS/JS",
                  "Instant Subdomain Creation",
                  "Rollback in 1-Click",
                ]).map((hl: string) => (
                  <span key={hl} className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-[#AEAC78]" />
                    {hl}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* STATISTICS SECTION */}
        {secMap.get("stats")?.enabled !== false && stats?.stats && (
          <section className="border-y border-[#DECBB0] dark:border-[#3D352F] bg-[#F5E5C9]/50 dark:bg-[#1E1A17]/80 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.stats.map((s: any, idx: number) => (
                  <div key={idx} className="text-center space-y-1">
                    <div className="text-3xl sm:text-4xl font-extrabold text-[#4C4541] dark:text-[#FBF3E6] tracking-tight">
                      {s.value}
                    </div>
                    <div className="text-xs font-semibold text-[#7A6F68] dark:text-[#B5AAA0] uppercase tracking-wider">
                      {s.label}
                    </div>
                    <div className="text-[11px] text-[#AEAC78] dark:text-[#AEAC78] font-medium">{s.change}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FEATURES SECTION */}
        {secMap.get("features")?.enabled !== false && (
          <section id="features" className="py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#5A5B35] dark:text-[#AEAC78]">
                  {features?.tagline || "BUILT FOR DEVELOPERS & DESIGNERS"}
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#4C4541] dark:text-[#FBF3E6]">
                  {features?.title || "Everything you need to ship static web experiences"}
                </h2>
                <p className="text-sm sm:text-base text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
                  {features?.description ||
                    "Engineered with a clean separation of concerns: Next.js control panel, isolated multi-tenant storage, and Nginx edge serving."}
                </p>
              </div>

              <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(features?.items || []).map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-8 hover:border-[#AEAC78] dark:hover:border-[#AEAC78] transition-all group shadow-sm"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5E5C9] dark:bg-[#1E1A17] text-[#5A5B35] dark:text-[#AEAC78] border border-[#DECBB0] dark:border-[#3D352F] group-hover:scale-105 transition-transform">
                      {idx === 0 && <Zap className="h-6 w-6" />}
                      {idx === 1 && <ShieldCheck className="h-6 w-6" />}
                      {idx === 2 && <History className="h-6 w-6" />}
                      {idx === 3 && <FolderArchive className="h-6 w-6" />}
                      {idx === 4 && <Globe className="h-6 w-6" />}
                      {idx === 5 && <Sliders className="h-6 w-6" />}
                    </div>
                    <h3 className="mt-6 text-lg font-semibold text-[#4C4541] dark:text-[#FBF3E6] group-hover:text-[#5A5B35] dark:group-hover:text-[#AEAC78] transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* HOW IT WORKS */}
        {secMap.get("how_it_works")?.enabled !== false && (
          <section id="how-it-works" className="border-t border-[#DECBB0] dark:border-[#3D352F] bg-[#F5E5C9]/40 dark:bg-[#1E1A17]/60 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#5A5B35] dark:text-[#AEAC78]">
                  {howItWorks?.tagline || "SIMPLE 3-STEP WORKFLOW"}
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#4C4541] dark:text-[#FBF3E6]">
                  {howItWorks?.title || "From local build to live web in under 5 seconds"}
                </h2>
              </div>

              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                {(howItWorks?.steps || []).map((step: any, idx: number) => (
                  <div
                    key={idx}
                    className="relative rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-8 space-y-4 shadow-sm"
                  >
                    <span className="font-mono text-3xl font-extrabold text-[#AEAC78]">
                      {step.step}
                    </span>
                    <h3 className="text-xl font-bold text-[#4C4541] dark:text-[#FBF3E6]">{step.title}</h3>
                    <p className="text-sm text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* LIVE SHOWCASE */}
        {secMap.get("showcase")?.enabled !== false && (
          <section className="py-24 sm:py-32 border-t border-[#DECBB0] dark:border-[#3D352F]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#5A5B35] dark:text-[#AEAC78]">
                    {showcase?.tagline || "LIVE ON SITENEST"}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#4C4541] dark:text-[#FBF3E6]">
                    {showcase?.title || "Featured Hosted Websites"}
                  </h2>
                  <p className="text-sm text-[#7A6F68] dark:text-[#B5AAA0]">
                    {showcase?.description || "Explore real projects and landing pages published on SiteNest."}
                  </p>
                </div>
                <Link
                  href="/sites"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5A5B35] dark:text-[#AEAC78] hover:underline"
                >
                  View All Websites
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {showcaseSites.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#DECBB0] dark:border-[#3D352F] p-12 text-center text-xs text-[#7A6F68] dark:text-[#B5AAA0]">
                  Websites will appear here as they are published.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {showcaseSites.map((site) => (
                    <div
                      key={site.id}
                      className="group rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-6 flex flex-col justify-between hover:border-[#AEAC78] dark:hover:border-[#AEAC78] transition-all shadow-sm"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#2D2305] dark:text-[#F2C46A] bg-[#F2C46A]/30 dark:bg-[#F2C46A]/10 px-2.5 py-0.5 rounded-full border border-[#F2C46A]/50">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#AEAC78]" />
                            Live
                          </span>
                          {site.category && (
                            <span className="text-[11px] text-[#7A6F68] dark:text-[#B5AAA0] font-medium">
                              {site.category.name}
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-[#4C4541] dark:text-[#FBF3E6] group-hover:text-[#5A5B35] dark:group-hover:text-[#AEAC78] transition-colors">
                          {site.name}
                        </h3>

                        <p className="font-mono text-xs text-[#7A6F68] dark:text-[#B5AAA0] truncate">
                          {site.subdomain}.sitenest.com
                        </p>

                        {site.description && (
                          <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0] line-clamp-2">
                            {site.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-6 pt-4 border-t border-[#DECBB0] dark:border-[#3D352F] flex items-center justify-between text-xs">
                        <Link
                          href={`/sites/${site.slug}`}
                          className="text-[#7A6F68] dark:text-[#B5AAA0] hover:text-[#4C4541] dark:hover:text-[#FBF3E6] font-medium"
                        >
                          Details & Info
                        </Link>
                        <a
                          href={`/s/${site.subdomain}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[#5A5B35] dark:text-[#AEAC78] font-semibold hover:underline"
                        >
                          Visit Site
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* PRICING SECTION */}
        {secMap.get("pricing")?.enabled !== false && (
          <section id="pricing" className="py-24 sm:py-32 border-t border-[#DECBB0] dark:border-[#3D352F] bg-[#F5E5C9]/40 dark:bg-[#1E1A17]/60">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#5A5B35] dark:text-[#AEAC78]">
                  {pricing?.tagline || "TRANSPARENT TIERS"}
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#4C4541] dark:text-[#FBF3E6]">
                  {pricing?.title || "Choose the right plan for your fleet"}
                </h2>
              </div>

              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                {(pricing?.plans || []).map((plan: any, idx: number) => (
                  <div
                    key={idx}
                    className={`rounded-2xl border p-8 flex flex-col justify-between relative shadow-sm ${
                      plan.popular
                        ? "border-[#AEAC78] bg-[#FFF8ED] dark:bg-[#24201C] ring-2 ring-[#AEAC78]/30"
                        : "border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C]"
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#AEAC78] text-[#171513] text-[10px] uppercase font-bold tracking-wider px-3 py-0.5 rounded-full shadow-sm">
                        Most Popular
                      </span>
                    )}

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-[#4C4541] dark:text-[#FBF3E6]">{plan.name}</h3>
                        <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0] mt-1">{plan.description}</p>
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-[#4C4541] dark:text-[#FBF3E6]">{plan.price}</span>
                        <span className="text-xs text-[#7A6F68] dark:text-[#B5AAA0]">/{plan.period}</span>
                      </div>

                      <ul className="space-y-2.5 pt-4 border-t border-[#DECBB0] dark:border-[#3D352F] text-xs text-[#4C4541] dark:text-[#FBF3E6]">
                        {plan.features?.map((f: string, fIdx: number) => (
                          <li key={fIdx} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-[#AEAC78] shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-8">
                      <Link
                        href="/sites"
                        className={`w-full inline-flex items-center justify-center rounded-xl py-2.5 text-xs font-semibold transition-all ${
                          plan.popular
                            ? "bg-[#F2C46A] hover:bg-[#E5B555] text-[#2D2305] shadow-sm"
                            : "bg-[#F5E5C9] dark:bg-[#2D2823] text-[#4C4541] dark:text-[#FBF3E6] hover:bg-[#EAD6B5] dark:hover:bg-[#38312B] border border-[#DECBB0] dark:border-[#3D352F]"
                        }`}
                      >
                        Explore Published Sites
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* TESTIMONIALS */}
        {secMap.get("testimonials")?.enabled !== false && testimonials?.items && (
          <section className="py-24 sm:py-32 border-t border-[#DECBB0] dark:border-[#3D352F]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-center text-3xl font-bold text-[#4C4541] dark:text-[#FBF3E6] mb-16">
                {testimonials?.title || "Loved by developers, loved by designers"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-8 flex flex-col justify-between space-y-6 shadow-sm"
                  >
                    <p className="text-sm text-[#4C4541] dark:text-[#FBF3E6] italic leading-relaxed">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#AEAC78] text-[#171513] font-bold text-xs">
                        {item.avatar}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#4C4541] dark:text-[#FBF3E6]">{item.author}</h4>
                        <p className="text-xs text-[#7A6F68] dark:text-[#B5AAA0]">{item.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ ACCORDION */}
        {secMap.get("faq")?.enabled !== false && faq?.items && (
          <section className="py-24 sm:py-32 border-t border-[#DECBB0] dark:border-[#3D352F] bg-[#F5E5C9]/40 dark:bg-[#1E1A17]/60">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="text-center space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#5A5B35] dark:text-[#AEAC78]">
                  {faq?.tagline || "HAVE QUESTIONS?"}
                </span>
                <h2 className="text-3xl font-bold text-[#4C4541] dark:text-[#FBF3E6]">
                  {faq?.title || "Frequently Asked Questions"}
                </h2>
              </div>

              <div className="space-y-4">
                {faq.items.map((item: any, idx: number) => (
                  <details
                    key={idx}
                    className="group rounded-2xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-5 transition-colors shadow-sm"
                  >
                    <summary className="cursor-pointer text-sm font-semibold text-[#4C4541] dark:text-[#FBF3E6] flex items-center justify-between list-none">
                      <span>{item.question}</span>
                      <span className="text-[#AEAC78] group-open:rotate-180 transition-transform">
                        ▼
                      </span>
                    </summary>
                    <p className="mt-3 text-xs sm:text-sm text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed border-t border-[#DECBB0] dark:border-[#3D352F] pt-3">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
