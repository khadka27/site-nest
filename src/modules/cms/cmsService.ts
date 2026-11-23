import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export interface CMSSectionData {
  sectionKey: string;
  title: string;
  order: number;
  enabled: boolean;
  content: any;
}

export const DEFAULT_HOMEPAGE_SECTIONS: CMSSectionData[] = [
  {
    sectionKey: "navbar",
    title: "Header Navigation",
    order: 0,
    enabled: true,
    content: {
      brandName: "SiteNest",
      logoText: "SiteNest",
      tagline: "Static Website Hosting",
      links: [
        { label: "Showcase", href: "/sites" },
        { label: "Features", href: "#features" },
        { label: "How It Works", href: "#how-it-works" },
        { label: "Pricing", href: "/pricing" },
        { label: "Docs / FAQ", href: "/faq" },
      ],
      ctaText: "Upload & Deploy",
      ctaHref: "/dashboard/sites/new",
    },
  },
  {
    sectionKey: "hero",
    title: "Hero Banner",
    order: 1,
    enabled: true,
    content: {
      badge: "🚀 Instant Static Hosting & Wildcard Subdomains",
      title: "Upload. Deploy. Go Live.",
      subtitle:
        "The modern hosting platform for static websites. Admin-curated deployments with automated subdomains, isolated directories, and zero-downtime rollbacks for public viewing.",
      primaryButton: {
        text: "Explore Showcase",
        url: "/sites",
      },
      secondaryButton: {
        text: "Admin Sign In",
        url: "/login",
      },
      highlights: [
        "100% Static HTML/CSS/JS",
        "Direct Public Access (No Login Required)",
        "Instant Wildcard Subdomains",
      ],
    },
  },
  {
    sectionKey: "stats",
    title: "Platform Statistics",
    order: 2,
    enabled: true,
    content: {
      stats: [
        { label: "Websites Hosted", value: "1,200+", change: "+24% this month" },
        { label: "Global Deployments", value: "48,000+", change: "Average 1.8s build" },
        { label: "Uptime SLA", value: "99.99%", change: "Nginx powered" },
        { label: "Subdomains Active", value: "850+", change: "Zero DNS lag" },
      ],
    },
  },
  {
    sectionKey: "features",
    title: "Core Platform Features",
    order: 3,
    enabled: true,
    content: {
      tagline: "BUILT FOR DEVELOPERS & DESIGNERS",
      title: "Everything you need to ship static web experiences",
      description:
        "Engineered with a clean separation of concerns: Next.js control panel, isolated multi-tenant storage, and Nginx edge serving.",
      items: [
        {
          icon: "Zap",
          title: "Instant Subdomains",
          description: "Every website gets its own dedicated subdomain (*.sitenest.com) automatically provisioned on upload.",
        },
        {
          icon: "ShieldCheck",
          title: "Isolated Storage",
          description: "Strict per-site directory sandboxing with automated ZIP path traversal defense and executable blocking.",
        },
        {
          icon: "History",
          title: "1-Click Rollback",
          description: "Every deployment creates an immutable version. Roll back instantly without re-uploading files.",
        },
        {
          icon: "FolderArchive",
          title: "Drag & Drop ZIP",
          description: "Upload standard static folders or nested archives. SiteNest automatically resolves and publishes your root.",
        },
        {
          icon: "Globe",
          title: "Production Nginx Speed",
          description: "Visitor traffic is served directly by Nginx at kernel speed, completely bypassing application runtime overhead.",
        },
        {
          icon: "Sliders",
          title: "Visual Admin & CMS",
          description: "Empower your team with a complete section-based CMS, audit logging, user role management, and analytics.",
        },
      ],
    },
  },
  {
    sectionKey: "how_it_works",
    title: "How It Works",
    order: 4,
    enabled: true,
    content: {
      tagline: "SIMPLE 3-STEP WORKFLOW",
      title: "From local build to live web in under 5 seconds",
      steps: [
        {
          step: "01",
          title: "Zip Your Project",
          description: "Export your static build from Astro, Next SSG, Vite, or hand-coded HTML/CSS into a ZIP archive.",
        },
        {
          step: "02",
          title: "Drop & Select Subdomain",
          description: "Choose your unique subdomain (e.g. portfolio.sitenest.com) and upload. Our engine validates structure instantly.",
        },
        {
          step: "03",
          title: "Published & Monitored",
          description: "Your release goes live immediately. Track logs, monitor traffic, and manage future versions with ease.",
        },
      ],
    },
  },
  {
    sectionKey: "showcase",
    title: "Featured Websites",
    order: 5,
    enabled: true,
    content: {
      tagline: "LIVE ON SITENEST",
      title: "Explore websites built and hosted on our platform",
      description: "Discover portfolios, agency landing pages, docs, and creative experiments running on SiteNest.",
      ctaText: "View All Published Sites",
      ctaUrl: "/sites",
    },
  },
  {
    sectionKey: "pricing",
    title: "Simple & Transparent Pricing",
    order: 6,
    enabled: true,
    content: {
      tagline: "PLANS FOR EVERY CREATOR",
      title: "Choose the perfect plan for your websites",
      plans: [
        {
          name: "Free Starter",
          price: "$0",
          period: "forever",
          description: "Ideal for personal portfolios and experimental projects.",
          features: [
            "Up to 3 Active Websites",
            "Automatic *.sitenest Subdomains",
            "100MB Total Storage",
            "1-Click Version Rollbacks",
            "Community Support",
          ],
          cta: "Start Free",
          popular: false,
        },
        {
          name: "Pro Creator",
          price: "$12",
          period: "per month",
          description: "Perfect for freelancers, developers, and agency showcases.",
          features: [
            "Unlimited Hosted Websites",
            "Custom Domain Support",
            "10GB High-Speed Storage",
            "Priority Deployment Worker",
            "Full Version History & Rollbacks",
            "Analytics & Visitor Metrics",
          ],
          cta: "Upgrade to Pro",
          popular: true,
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
            "Audit Logs & SSO Integration",
            "24/7 Dedicated Support",
          ],
          cta: "Contact Sales",
          popular: false,
        },
      ],
    },
  },
  {
    sectionKey: "testimonials",
    title: "What Creators Are Saying",
    order: 7,
    enabled: true,
    content: {
      title: "Loved by developers, loved by designers",
      items: [
        {
          quote: "SiteNest eliminated all the pain of setting up AWS S3, CloudFront, and Route 53 just to show client mockups. Drag, drop, live in 2 seconds.",
          author: "Elena Rostova",
          role: "Design Lead, Studio Vertex",
          avatar: "ER",
        },
        {
          quote: "The isolated deployment directories and rollback feature saved us multiple times during product launches. It's solid as a rock.",
          author: "Marcus Chen",
          role: "Full-Stack Engineer",
          avatar: "MC",
        },
        {
          quote: "Nginx serving static files directly while Next.js handles the control panel is the most sensible hosting architecture I have seen.",
          author: "Sarah Jenkins",
          role: "DevOps Consultant",
          avatar: "SJ",
        },
      ],
    },
  },
  {
    sectionKey: "faq",
    title: "Frequently Asked Questions",
    order: 8,
    enabled: true,
    content: {
      tagline: "HAVE QUESTIONS?",
      title: "Everything you need to know about SiteNest",
      items: [
        {
          question: "What types of websites can I host on SiteNest?",
          answer: "SiteNest supports any static website: pure HTML, CSS, JavaScript, static exports from Next.js, Vite, React, Vue, Svelte, Hugo, Astro, images, fonts, and PDFs. It does not execute server-side code like PHP or Node.js scripts.",
        },
        {
          question: "How do subdomains work?",
          answer: "When you upload your ZIP file, you choose a subdomain like 'myportfolio'. Once deployed, your site is instantly accessible at 'myportfolio.sitenest.com' (or through local preview).",
        },
        {
          question: "How does the rollback system work?",
          answer: "Every time you upload a new ZIP to an existing site, a new immutable version is stored (v1, v2, v3...). If something goes wrong with v2, you can click 'Rollback' in the dashboard to restore v1 immediately.",
        },
        {
          question: "Is there a file size limit?",
          answer: "The standard ZIP upload limit is 50MB, expanding up to 250MB uncompressed static assets. Custom enterprise plans support larger payloads.",
        },
        {
          question: "Can I connect my own custom domain?",
          answer: "Yes, custom domains are fully supported via CNAME or A record pointing to our wildcard edge proxy.",
        },
      ],
    },
  },
  {
    sectionKey: "footer",
    title: "Footer Section",
    order: 9,
    enabled: true,
    content: {
      brandName: "SiteNest",
      description: "Upload. Deploy. Go Live. The modern static website hosting platform powered by Next.js, PostgreSQL, and Nginx.",
      copyright: "© 2026 SiteNest Platform Inc. All rights reserved.",
      social: [
        { label: "GitHub", href: "https://github.com" },
        { label: "Twitter", href: "https://twitter.com" },
        { label: "Discord", href: "https://discord.com" },
      ],
      links: [
        { label: "Showcase Directory", href: "/sites" },
        { label: "Pricing", href: "/pricing" },
        { label: "About Us", href: "/about" },
        { label: "FAQ", href: "/faq" },
        { label: "Contact", href: "/contact" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ],
    },
  },
];

export async function getHomepageSections() {
  const sections = await prisma.homepageSection.findMany({
    orderBy: { order: "asc" },
  });

  if (sections.length === 0) {
    // Seed default sections
    await seedDefaultHomepageSections();
    return await prisma.homepageSection.findMany({
      orderBy: { order: "asc" },
    });
  }

  return sections;
}

export async function seedDefaultHomepageSections() {
  for (const item of DEFAULT_HOMEPAGE_SECTIONS) {
    await prisma.homepageSection.upsert({
      where: { sectionKey: item.sectionKey },
      update: {},
      create: {
        sectionKey: item.sectionKey,
        title: item.title,
        order: item.order,
        enabled: item.enabled,
        content: item.content,
      },
    });
  }
}

export async function updateHomepageSection(
  sectionKey: string,
  data: {
    title?: string;
    enabled?: boolean;
    order?: number;
    content?: any;
  }
) {
  return await prisma.homepageSection.update({
    where: { sectionKey },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.enabled !== undefined && { enabled: data.enabled }),
      ...(data.order !== undefined && { order: data.order }),
      ...(data.content !== undefined && { content: data.content }),
    },
  });
}

export async function resetHomepageToDefaults() {
  for (const item of DEFAULT_HOMEPAGE_SECTIONS) {
    await prisma.homepageSection.upsert({
      where: { sectionKey: item.sectionKey },
      update: {
        title: item.title,
        order: item.order,
        enabled: item.enabled,
        content: item.content,
      },
      create: {
        sectionKey: item.sectionKey,
        title: item.title,
        order: item.order,
        enabled: item.enabled,
        content: item.content,
      },
    });
  }
}
