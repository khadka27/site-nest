import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getHomepageSections } from "@/modules/cms/cmsService";
import { prisma } from "@/lib/prisma";
import {
  UploadCloud,
  Zap,
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        {secMap.get("hero")?.enabled !== false && (
          <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-36">
            {/* Background glowing gradients */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 shadow-inner mb-8">
                <span>{hero?.badge || "🚀 Instant Static Hosting & Wildcard Subdomains"}</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
                {hero?.title || "Upload. Deploy. Go Live."}
              </h1>

              {/* Subtitle */}
              <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                {hero?.subtitle ||
                  "The modern platform to upload, manage, and host static websites through automatically generated subdomains. Blazing Nginx speed, isolated directories, and 1-click rollbacks."}
              </p>

              {/* Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href={hero?.primaryButton?.url || "/sites"}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-base font-semibold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5"
                >
                  <Globe className="h-5 w-5" />
                  {hero?.primaryButton?.text || "Explore Showcase"}
                </Link>
                <Link
                  href={hero?.secondaryButton?.url || "/login"}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-7 py-3.5 text-base font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all"
                >
                  {hero?.secondaryButton?.text || "Admin Sign In"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Highlights */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
                {(hero?.highlights || [
                  "100% Static HTML/CSS/JS",
                  "Instant Subdomain Creation",
                  "Rollback in 1-Click",
                ]).map((hl: string) => (
                  <span key={hl} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    {hl}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* STATISTICS SECTION */}
        {secMap.get("stats")?.enabled !== false && stats?.stats && (
          <section className="border-y border-zinc-800/80 bg-zinc-900/40 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.stats.map((s: any, idx: number) => (
                  <div key={idx} className="text-center space-y-1">
                    <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      {s.value}
                    </div>
                    <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                      {s.label}
                    </div>
                    <div className="text-[11px] text-zinc-500">{s.change}</div>
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
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                  {features?.tagline || "BUILT FOR DEVELOPERS & DESIGNERS"}
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  {features?.title || "Everything you need to ship static web experiences"}
                </h2>
                <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                  {features?.description ||
                    "Engineered with a clean separation of concerns: Next.js control panel, isolated multi-tenant storage, and Nginx edge serving."}
                </p>
              </div>

              <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(features?.items || []).map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-zinc-800/90 bg-zinc-900/40 p-8 hover:border-indigo-500/40 hover:bg-zinc-900/80 transition-all group"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                      {idx === 0 && <Zap className="h-6 w-6" />}
                      {idx === 1 && <ShieldCheck className="h-6 w-6" />}
                      {idx === 2 && <History className="h-6 w-6" />}
                      {idx === 3 && <FolderArchive className="h-6 w-6" />}
                      {idx === 4 && <Globe className="h-6 w-6" />}
                      {idx === 5 && <Sliders className="h-6 w-6" />}
                    </div>
                    <h3 className="mt-6 text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
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
          <section id="how-it-works" className="border-t border-zinc-800/80 bg-zinc-950/60 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                  {howItWorks?.tagline || "SIMPLE 3-STEP WORKFLOW"}
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  {howItWorks?.title || "From local build to live web in under 5 seconds"}
                </h2>
              </div>

              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                {(howItWorks?.steps || []).map((step: any, idx: number) => (
                  <div
                    key={idx}
                    className="relative rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 space-y-4"
                  >
                    <span className="font-mono text-3xl font-extrabold text-indigo-400/60">
                      {step.step}
                    </span>
                    <h3 className="text-xl font-bold text-white">{step.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* LIVE SHOWCASE */}
        {secMap.get("showcase")?.enabled !== false && (
          <section className="py-24 sm:py-32 border-t border-zinc-800/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
                    {showcase?.tagline || "LIVE ON SITENEST"}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                    {showcase?.title || "Featured Hosted Websites"}
                  </h2>
                  <p className="text-sm text-zinc-400">
                    {showcase?.description || "Explore real projects and landing pages published on SiteNest."}
                  </p>
                </div>
                <Link
                  href="/sites"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  View All Websites
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {showcaseSites.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-800 p-12 text-center text-xs text-zinc-500">
                  Websites will appear here as they are published.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {showcaseSites.map((site) => (
                    <div
                      key={site.id}
                      className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 flex flex-col justify-between hover:border-zinc-700 transition-all"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Live
                          </span>
                          {site.category && (
                            <span className="text-[11px] text-zinc-400">{site.category.name}</span>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                          {site.name}
                        </h3>

                        <p className="font-mono text-xs text-zinc-400 truncate">
                          {site.subdomain}.sitenest.com
                        </p>

                        {site.description && (
                          <p className="text-xs text-zinc-400 line-clamp-2">{site.description}</p>
                        )}
                      </div>

                      <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                        <Link
                          href={`/sites/${site.slug}`}
                          className="text-zinc-400 hover:text-white"
                        >
                          Details & Info
                        </Link>
                        <a
                          href={`/s/${site.subdomain}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold"
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
          <section id="pricing" className="py-24 sm:py-32 border-t border-zinc-800/80 bg-zinc-950/60">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                  {pricing?.tagline || "TRANSPARENT TIERS"}
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  {pricing?.title || "Choose the right plan for your fleet"}
                </h2>
              </div>

              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                {(pricing?.plans || []).map((plan: any, idx: number) => (
                  <div
                    key={idx}
                    className={`rounded-2xl border p-8 flex flex-col justify-between relative ${
                      plan.popular
                        ? "border-indigo-500 bg-indigo-950/20 shadow-xl shadow-indigo-500/10"
                        : "border-zinc-800 bg-zinc-900/40"
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-0.5 rounded-full">
                        Most Popular
                      </span>
                    )}

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                        <p className="text-xs text-zinc-400 mt-1">{plan.description}</p>
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                        <span className="text-xs text-zinc-400">/{plan.period}</span>
                      </div>

                      <ul className="space-y-2.5 pt-4 border-t border-zinc-800 text-xs text-zinc-300">
                        {plan.features?.map((f: string, fIdx: number) => (
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
                          plan.popular
                            ? "bg-indigo-600 text-white hover:bg-indigo-500"
                            : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white"
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
          <section className="py-24 sm:py-32 border-t border-zinc-800/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-center text-3xl font-bold text-white mb-16">
                {testimonials?.title || "Loved by developers, loved by designers"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 flex flex-col justify-between space-y-6"
                  >
                    <p className="text-sm text-zinc-300 italic leading-relaxed">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-xs">
                        {item.avatar}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{item.author}</h4>
                        <p className="text-xs text-zinc-500">{item.role}</p>
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
          <section className="py-24 sm:py-32 border-t border-zinc-800/80 bg-zinc-950/60">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="text-center space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                  {faq?.tagline || "HAVE QUESTIONS?"}
                </span>
                <h2 className="text-3xl font-bold text-white">
                  {faq?.title || "Frequently Asked Questions"}
                </h2>
              </div>

              <div className="space-y-4">
                {faq.items.map((item: any, idx: number) => (
                  <details
                    key={idx}
                    className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 open:bg-zinc-900/80 transition-colors"
                  >
                    <summary className="cursor-pointer text-sm font-semibold text-white flex items-center justify-between list-none">
                      <span>{item.question}</span>
                      <span className="text-indigo-400 group-open:rotate-180 transition-transform">
                        ▼
                      </span>
                    </summary>
                    <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/60 pt-3">
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
