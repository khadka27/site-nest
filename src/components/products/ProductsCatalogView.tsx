"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Star,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  SlidersHorizontal,
  RotateCcw,
  ShieldCheck,
  Award,
  FlaskConical,
  Leaf,
  Zap,
  Moon,
  Brain,
  Layers,
  Check,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: { websites: number };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  description: string | null;
  imageUrl: string | null;
  updatedAt: string | Date;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  deployments?: {
    version: number;
    fileSize: number | null;
  }[];
}

interface ProductsCatalogViewProps {
  products: Product[];
  categories: Category[];
  initialSearch?: string;
  initialCategory?: string;
}

// Supplement details map for pricing & lab rating metrics
const PRODUCT_METRICS: Record<
  string,
  { price: string; rating: number; reviews: string; badge: string }
> = {
  "marine-collagen": {
    price: "$44.00",
    rating: 4.9,
    reviews: "1.4k Reviews",
    badge: "Longevity",
  },
  "cognitive-adaptogen": {
    price: "$48.00",
    rating: 5.0,
    reviews: "1.2k Reviews",
    badge: "Nootropic",
  },
  "magnesium-glycinate": {
    price: "$32.00",
    rating: 4.8,
    reviews: "2.1k Reviews",
    badge: "Recovery",
  },
  "wild-cordyceps": {
    price: "$38.00",
    rating: 5.0,
    reviews: "890 Reviews",
    badge: "Vitality",
  },
};

export default function ProductsCatalogView({
  products,
  categories,
  initialSearch = "",
  initialCategory = "",
}: ProductsCatalogViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [selectedSort, setSelectedSort] = useState("recommended");
  const [emailInput, setEmailInput] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Accordion state
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    status: true,
    certification: true,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Recommendations carousel ref
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
    } else {
      params.delete("search");
    }
    if (activeCategory) {
      params.set("category", activeCategory);
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleCategorySelect = (categorySlug: string) => {
    setActiveCategory(categorySlug);
    const params = new URLSearchParams(searchParams.toString());
    if (categorySlug) {
      params.set("category", categorySlug);
    } else {
      params.delete("category");
    }
    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
    }
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setActiveCategory("");
    router.push("/products");
  };

  // Category Icon Resolver
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case "vitality":
        return <Zap className="h-3.5 w-3.5 text-[#6B7280] dark:text-[#9CA3AF]" />;
      case "cognitive":
        return <Brain className="h-3.5 w-3.5 text-[#6B7280] dark:text-[#9CA3AF]" />;
      case "recovery":
        return <Moon className="h-3.5 w-3.5 text-[#6B7280] dark:text-[#9CA3AF]" />;
      case "longevity":
        return <Leaf className="h-3.5 w-3.5 text-[#6B7280] dark:text-[#9CA3AF]" />;
      default:
        return <FlaskConical className="h-3.5 w-3.5 text-[#6B7280] dark:text-[#9CA3AF]" />;
    }
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory) {
      result = result.filter((p) => p.category?.slug === activeCategory);
    }

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.subdomain.toLowerCase().includes(query) ||
          (p.description && p.description.toLowerCase().includes(query))
      );
    }

    if (selectedSort === "price-asc") {
      result.sort((a, b) => {
        const pA = parseFloat(PRODUCT_METRICS[a.slug]?.price.replace("$", "") || "0");
        const pB = parseFloat(PRODUCT_METRICS[b.slug]?.price.replace("$", "") || "0");
        return pA - pB;
      });
    } else if (selectedSort === "price-desc") {
      result.sort((a, b) => {
        const pA = parseFloat(PRODUCT_METRICS[a.slug]?.price.replace("$", "") || "0");
        const pB = parseFloat(PRODUCT_METRICS[b.slug]?.price.replace("$", "") || "0");
        return pB - pA;
      });
    } else if (selectedSort === "rating") {
      result.sort((a, b) => {
        const rA = PRODUCT_METRICS[a.slug]?.rating || 5;
        const rB = PRODUCT_METRICS[b.slug]?.rating || 5;
        return rB - rA;
      });
    }

    return result;
  }, [products, activeCategory, searchTerm, selectedSort]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setIsSubscribed(true);
      setTimeout(() => {
        setEmailInput("");
      }, 3000);
    }
  };

  return (
    <div className="space-y-12">
      {/* ========================================================= */}
      {/* HERO SECTION WITH "SHOP" DISPLAY WATERMARK & INLINE SEARCH */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-[#F9FAFB] dark:bg-[#121214] border border-[#E5E7EB] dark:border-[#27272A] shadow-sm transition-colors duration-200">
        {/* Decorative architectural background texture with giant "Shop" lettering */}
        <div className="absolute inset-0 select-none pointer-events-none overflow-hidden">
          <span className="absolute -top-10 sm:-top-16 left-1/2 -translate-x-1/2 text-[120px] sm:text-[180px] lg:text-[230px] font-black tracking-tight text-[#111827]/[0.04] dark:text-white/[0.03] uppercase font-sans">
            Shop
          </span>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F9FAFB]/60 to-[#F9FAFB] dark:via-[#121214]/60 dark:to-[#121214]" />
        </div>

        <div className="relative px-6 py-12 sm:px-10 sm:py-16 lg:px-12 flex flex-col justify-between min-h-[220px]">
          {/* Top category label & micro badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-[#18181B] text-[#4B5563] dark:text-[#9CA3AF] border border-[#E5E7EB] dark:border-[#27272A] shadow-sm">
              <Leaf className="h-3 w-3 text-[#111827] dark:text-white" />
              Artisan Botanical Nutrition
            </span>
          </div>

          {/* Headline and search bar row matching reference UI */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2">
            <div className="space-y-2 max-w-xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#111827] dark:text-[#F9FAFB]">
                Give All You Need
              </h1>
              <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                Pure clinical formulations synthesized for cellular longevity and daily vitality. Every product is hosted with full lab assay transparency on its own dedicated research microsite.
              </p>
            </div>

            {/* Floating integrated search pill */}
            <form
              onSubmit={handleSearchSubmit}
              className="w-full lg:w-[420px] shrink-0"
            >
              <div className="relative flex items-center bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] rounded-full p-1.5 pl-4 shadow-sm focus-within:border-[#111827] dark:focus-within:border-white transition-all">
                <Search className="h-4 w-4 text-[#9CA3AF] shrink-0 mr-2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search on SiteNest..."
                  className="w-full bg-transparent text-xs sm:text-sm text-[#111827] dark:text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-full bg-[#111827] hover:bg-[#1F2937] dark:bg-white dark:hover:bg-[#E5E7EB] text-white dark:text-[#111827] px-5 py-2 text-xs font-semibold transition-all shadow-sm cursor-pointer shrink-0"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2-COLUMN MAIN CONTENT: LEFT SIDEBAR + PRODUCT CATALOG GRID */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* MOBILE FILTER TOGGLE BUTTON */}
        <div className="lg:hidden flex items-center justify-between pb-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#27272A] bg-white dark:bg-[#121214] text-xs font-semibold text-[#111827] dark:text-[#F9FAFB] shadow-sm"
          >
            <SlidersHorizontal className="h-4 w-4 text-[#6B7280]" />
            <span>{sidebarOpen ? "Hide Filter Menu" : "Show Category Filters"}</span>
          </button>

          <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
            Showing <strong className="text-[#111827] dark:text-[#F9FAFB]">{filteredProducts.length}</strong> formulations
          </span>
        </div>

        {/* --------------------------------------------------------- */}
        {/* LEFT COLUMN: CATEGORY TREE & STATUS SIDEBAR               */}
        {/* --------------------------------------------------------- */}
        <aside
          className={`${
            sidebarOpen ? "block" : "hidden"
          } lg:block lg:col-span-3 space-y-6 lg:sticky lg:top-24`}
        >
          {/* Categories Card */}
          <div className="rounded-3xl border border-[#E5E7EB] dark:border-[#27272A] bg-white dark:bg-[#121214] p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold tracking-tight text-[#111827] dark:text-[#F9FAFB] uppercase">
                Category
              </h2>
              {(activeCategory || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#111827] dark:text-white hover:underline"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
              )}
            </div>

            {/* "All Product" active pill button with red count badge */}
            <div>
              <button
                onClick={() => handleCategorySelect("")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                  !activeCategory
                    ? "bg-[#F3F4F6] text-[#111827] dark:bg-[#27272A] dark:text-white"
                    : "text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F9FAFB] dark:hover:bg-[#18181B] hover:text-[#111827] dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 shrink-0 text-[#111827] dark:text-white" />
                  <span>All Formulations</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EF4444] text-white">
                    {products.length}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-40" />
                </div>
              </button>
            </div>

            {/* Hierarchical category list with tree branches */}
            <div className="space-y-1 pl-2 border-l border-[#E5E7EB] dark:border-[#27272A] ml-2">
              {categories.map((c) => {
                const isSelected = activeCategory === c.slug;
                const count = c._count?.websites ?? 0;
                return (
                  <button
                    key={c.id}
                    onClick={() => handleCategorySelect(c.slug)}
                    className={`w-full group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                      isSelected
                        ? "bg-[#F3F4F6] text-[#111827] dark:bg-[#27272A] dark:text-white font-bold"
                        : "text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white hover:bg-[#F9FAFB] dark:hover:bg-[#18181B]"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[#D1D5DB] dark:text-[#3F3F46] group-hover:text-[#111827] dark:group-hover:text-white">
                        ↳
                      </span>
                      {getCategoryIcon(c.slug)}
                      <span className="truncate">{c.name}</span>
                    </div>
                    {count > 0 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-[#F3F4F6] dark:bg-[#18181B] text-[#6B7280] dark:text-[#9CA3AF] shrink-0 border border-[#E5E7EB] dark:border-[#27272A]">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Filter Accordion: Formulation Status */}
            <div className="pt-4 border-t border-[#E5E7EB] dark:border-[#27272A] space-y-3">
              <button
                type="button"
                onClick={() => toggleAccordion("status")}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-[#F9FAFB]"
              >
                <span>Release Status</span>
                {openAccordions.status ? (
                  <ChevronDown className="h-4 w-4 text-[#9CA3AF]" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-[#9CA3AF]" />
                )}
              </button>

              {openAccordions.status && (
                <div className="space-y-2 text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                  <div className="flex items-center justify-between px-2 py-1 rounded-lg hover:bg-[#F9FAFB] dark:hover:bg-[#18181B]">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
                      Active Live Batches
                    </span>
                    <span className="font-mono text-[10px]">{products.length}</span>
                  </div>
                  <div className="flex items-center justify-between px-2 py-1 rounded-lg hover:bg-[#F9FAFB] dark:hover:bg-[#18181B]">
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#111827] dark:text-white" />
                      Chromatography Verified
                    </span>
                    <span className="font-mono text-[10px]">100%</span>
                  </div>
                  <div className="flex items-center justify-between px-2 py-1 rounded-lg hover:bg-[#F9FAFB] dark:hover:bg-[#18181B]">
                    <span className="flex items-center gap-2">
                      <Award className="h-3.5 w-3.5 text-[#111827] dark:text-white" />
                      Dedicated Subdomain Ready
                    </span>
                    <span className="font-mono text-[10px]">{products.length}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Filter Accordion: Potency & Standards */}
            <div className="pt-4 border-t border-[#E5E7EB] dark:border-[#27272A] space-y-3">
              <button
                type="button"
                onClick={() => toggleAccordion("certification")}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-[#F9FAFB]"
              >
                <span>Purity Standards</span>
                {openAccordions.certification ? (
                  <ChevronDown className="h-4 w-4 text-[#9CA3AF]" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-[#9CA3AF]" />
                )}
              </button>

              {openAccordions.certification && (
                <ul className="space-y-1.5 text-xs text-[#6B7280] dark:text-[#9CA3AF] pl-1">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#10B981]" />
                    <span>Non-GMO Project Verified</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#10B981]" />
                    <span>Heavy Metals ICP-MS Tested</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#10B981]" />
                    <span>Zero Synthetic Binders</span>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </aside>

        {/* --------------------------------------------------------- */}
        {/* RIGHT COLUMN: MAIN PRODUCT CATALOG GRID                   */}
        {/* --------------------------------------------------------- */}
        <section className="lg:col-span-9 space-y-6">
          {/* Header Bar with Sort Dropdown & Product Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#121214] border border-[#E5E7EB] dark:border-[#27272A] rounded-2xl px-5 py-3 shadow-sm">
            <div className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
              Showing <strong className="text-[#111827] dark:text-[#F9FAFB]">{filteredProducts.length}</strong> certified bioactive formulations
              {activeCategory && (
                <span> in <span className="text-[#111827] dark:text-white font-semibold">{categories.find((c) => c.slug === activeCategory)?.name || activeCategory}</span></span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#6B7280] dark:text-[#9CA3AF] shrink-0 font-medium">Sort by:</span>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="rounded-xl border border-[#E5E7EB] dark:border-[#27272A] bg-[#F9FAFB] dark:bg-[#18181B] px-3 py-1.5 text-xs text-[#111827] dark:text-[#F9FAFB] focus:border-[#111827] dark:focus:border-white focus:outline-none cursor-pointer"
              >
                <option value="recommended">Featured Formulations</option>
                <option value="rating">Highest Lab Assay Rating</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* EMPTY STATE */}
          {filteredProducts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#E5E7EB] dark:border-[#27272A] p-16 text-center space-y-4 bg-white dark:bg-[#121214]">
              <Leaf className="h-10 w-10 text-[#6B7280] mx-auto opacity-70" />
              <h3 className="text-lg font-bold text-[#111827] dark:text-[#F9FAFB]">
                No Formulations Found
              </h3>
              <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#9CA3AF] max-w-md mx-auto">
                No active botanical supplements match your search &ldquo;{searchTerm}&rdquo; or filter criteria.
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#111827] hover:bg-[#1F2937] dark:bg-white dark:hover:bg-[#E5E7EB] text-white dark:text-[#111827] px-5 py-2 text-xs font-semibold transition-all shadow-sm cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Clear All Filters
              </button>
            </div>
          ) : (
            /* PRODUCT CARDS GRID (FAITHFUL TO USER REFERENCE) */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const metrics = PRODUCT_METRICS[product.slug] || {
                  price: "$39.00",
                  rating: 5.0,
                  reviews: "1.0k Reviews",
                  badge: product.category?.name || "Formula",
                };

                return (
                  <div
                    key={product.id}
                    className="group rounded-3xl border border-[#E5E7EB] dark:border-[#27272A] bg-white dark:bg-[#121214] p-5 flex flex-col justify-between hover:border-[#D1D5DB] dark:hover:border-[#3F3F46] transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <div className="space-y-4">
                      {/* Product Image Container with soft background & floating category badge */}
                      <div className="relative aspect-square w-full rounded-2xl bg-[#F3F4F6] dark:bg-[#18181B] border border-[#E5E7EB]/70 dark:border-[#27272A] overflow-hidden flex items-center justify-center p-4">
                        {/* Top-Right Floating Category Pill */}
                        <span className="absolute top-3 right-3 z-10 text-[10px] font-semibold text-[#4B5563] dark:text-[#D4D4D8] bg-white/95 dark:bg-[#27272A]/95 px-2.5 py-1 rounded-full border border-[#E5E7EB] dark:border-[#3F3F46] shadow-sm backdrop-blur-sm">
                          {metrics.badge}
                        </span>

                        {/* Top-Left WebP Technology Badge */}
                        <span className="absolute top-3 left-3 z-10 text-[9px] font-mono font-bold text-[#6B7280] dark:text-[#9CA3AF] bg-white/80 dark:bg-[#27272A]/80 px-2 py-0.5 rounded-md border border-[#E5E7EB] dark:border-[#3F3F46]">
                          WebP
                        </span>

                        {/* Centered WebP Image */}
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-[#9CA3AF] space-y-2">
                            <Leaf className="h-12 w-12 opacity-60" />
                            <span className="text-xs font-mono">Botanical Extract</span>
                          </div>
                        )}
                      </div>

                      {/* Product Title */}
                      <div>
                        <h3 className="text-base font-bold text-[#111827] dark:text-[#F9FAFB] group-hover:text-black dark:group-hover:text-white transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </div>

                      {/* Rating & Reviews on Left + Price on Right */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                          <span className="font-bold text-[#111827] dark:text-[#F9FAFB]">
                            {metrics.rating.toFixed(1)}
                          </span>
                          <span className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                            ({metrics.reviews})
                          </span>
                        </div>

                        <div className="text-base font-black text-[#111827] dark:text-[#F9FAFB]">
                          {metrics.price}
                        </div>
                      </div>

                      {/* Dedicated Subdomain Badge */}
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#6B7280] dark:text-[#9CA3AF] bg-[#F9FAFB] dark:bg-[#18181B] px-2.5 py-1 rounded-lg border border-[#E5E7EB] dark:border-[#27272A]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                        <span className="truncate">{product.subdomain}.sitenest.com</span>
                      </div>
                    </div>

                    {/* Dual Action Buttons matching reference UI */}
                    <div className="mt-5 pt-4 border-t border-[#E5E7EB] dark:border-[#27272A] grid grid-cols-2 gap-2.5">
                      {/* Button 1: "Lab Specs" (Outline pill with high contrast) */}
                      <Link
                        href={`/products/${product.slug}`}
                        className="rounded-full border border-[#E5E7EB] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-[#111827] dark:text-[#F9FAFB] hover:bg-[#F3F4F6] dark:hover:bg-[#27272A] hover:border-[#D1D5DB] dark:hover:border-[#3F3F46] py-2.5 px-3 text-xs font-semibold text-center transition-all duration-200 shadow-sm cursor-pointer"
                      >
                        Lab Specs
                      </Link>

                      {/* Button 2: "Visit Site" (Solid dark / white pill) */}
                      <a
                        href={`/s/${product.subdomain}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-[#111827] hover:bg-[#1F2937] text-white dark:bg-white dark:text-[#111827] dark:hover:bg-[#E5E7EB] py-2.5 px-3 text-xs font-semibold text-center transition-all duration-200 shadow-sm inline-flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Visit Site</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ========================================================= */}
          {/* BOTTOM PAGINATION BAR (MATCHING REFERENCE UI)             */}
          {/* ========================================================= */}
          <div className="pt-8 pb-4 flex items-center justify-center gap-2 text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF]">
            <button
              disabled
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#E5E7EB] dark:border-[#27272A] opacity-50 cursor-not-allowed"
            >
              <ArrowLeft className="h-3 w-3" />
              Previous
            </button>
            <span className="h-8 w-8 rounded-full bg-[#111827] text-white dark:bg-white dark:text-[#111827] font-bold flex items-center justify-center shadow-sm">
              1
            </span>
            <button
              disabled
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#E5E7EB] dark:border-[#27272A] opacity-50 cursor-not-allowed"
            >
              Next
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </section>
      </div>

      {/* ========================================================= */}
      {/* SECTION: EXPLORE OUR RECOMMENDATIONS (IMAGE 2 INSPIRATION) */}
      {/* ========================================================= */}
      <section className="pt-6 border-t border-[#E5E7EB] dark:border-[#27272A] space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280] dark:text-[#9CA3AF]">
              CLINICAL SYNERGY
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827] dark:text-[#F9FAFB]">
              Explore our recommendations
            </h2>
          </div>

          {/* Slider control arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollCarousel("left")}
              aria-label="Previous recommendation"
              className="h-9 w-9 rounded-full border border-[#E5E7EB] dark:border-[#27272A] bg-white dark:bg-[#121214] flex items-center justify-center text-[#111827] dark:text-[#F9FAFB] hover:bg-[#111827] hover:text-white dark:hover:bg-white dark:hover:text-[#111827] transition-all cursor-pointer shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollCarousel("right")}
              aria-label="Next recommendation"
              className="h-9 w-9 rounded-full border border-[#E5E7EB] dark:border-[#27272A] bg-white dark:bg-[#121214] flex items-center justify-center text-[#111827] dark:text-[#F9FAFB] hover:bg-[#111827] hover:text-white dark:hover:bg-white dark:hover:text-[#111827] transition-all cursor-pointer shadow-sm"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Carousel / Recommendations Row */}
        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto pb-4 scroll-smooth no-scrollbar"
        >
          {products.map((item) => {
            const metrics = PRODUCT_METRICS[item.slug] || {
              price: "$39.00",
              rating: 5.0,
              reviews: "1.0k Reviews",
              badge: "Synergy",
            };

            return (
              <div
                key={`rec-${item.id}`}
                className="group w-72 shrink-0 rounded-3xl border border-[#E5E7EB] dark:border-[#27272A] bg-white dark:bg-[#121214] p-4 flex flex-col justify-between shadow-sm hover:border-[#D1D5DB] dark:hover:border-[#3F3F46] transition-all duration-300 hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="relative aspect-[4/3] w-full rounded-2xl bg-[#F3F4F6] dark:bg-[#18181B] border border-[#E5E7EB]/70 dark:border-[#27272A] overflow-hidden flex items-center justify-center p-3">
                    <span className="absolute top-2.5 right-2.5 text-[9px] font-semibold text-[#4B5563] dark:text-[#D4D4D8] bg-white/95 dark:bg-[#27272A]/95 px-2 py-0.5 rounded-full border border-[#E5E7EB] dark:border-[#3F3F46]">
                      {metrics.badge}
                    </span>
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB] group-hover:text-black dark:group-hover:text-white transition-colors truncate">
                    {item.name}
                  </h4>

                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 font-bold text-[#111827] dark:text-[#F9FAFB]">
                      <Star className="h-3 w-3 fill-[#F59E0B] text-[#F59E0B]" />
                      {metrics.rating.toFixed(1)}
                    </span>
                    <span className="font-extrabold text-[#111827] dark:text-[#F9FAFB]">
                      {metrics.price}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E5E7EB] dark:border-[#27272A] grid grid-cols-2 gap-2 text-[11px]">
                  {/* Button 1: "Specs" (Outline pill) */}
                  <Link
                    href={`/products/${item.slug}`}
                    className="rounded-full border border-[#E5E7EB] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-[#111827] dark:text-[#F9FAFB] hover:bg-[#F3F4F6] dark:hover:bg-[#27272A] py-2 px-2 font-semibold text-center transition-all duration-200 shadow-sm cursor-pointer"
                  >
                    Specs
                  </Link>

                  {/* Button 2: "Microsite" (Solid pill) */}
                  <a
                    href={`/s/${item.subdomain}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-[#111827] hover:bg-[#1F2937] text-white dark:bg-white dark:text-[#111827] dark:hover:bg-[#E5E7EB] py-2 px-2 font-semibold text-center transition-all duration-200 shadow-sm inline-flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Microsite</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION: SLEEK DARK NEWSLETTER BANNER (IMAGE 2 INSPIRATION) */}
      {/* ========================================================= */}
      <section className="rounded-3xl bg-[#18181B] dark:bg-[#121214] text-white p-8 sm:p-12 lg:p-14 border border-[#27272A] shadow-xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/[0.04] blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading & Email Input */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Ready to Optimize Your Vitality?
            </h2>

            {isSubscribed ? (
              <div className="inline-flex items-center gap-2 bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 px-4 py-2.5 rounded-full text-xs font-semibold">
                <Check className="h-4 w-4" />
                <span>Thank you! You are subscribed to certified batch releases.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="max-w-md">
                <div className="relative flex items-center bg-[#27272A] border border-[#3F3F46] rounded-full p-1.5 pl-4 shadow-inner focus-within:border-white">
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-white hover:bg-gray-100 text-[#111827] px-6 py-2.5 text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0"
                  >
                    Send
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Mission description */}
          <div className="lg:col-span-5 space-y-2 text-xs sm:text-sm text-gray-300 leading-relaxed lg:pl-6 lg:border-l lg:border-[#27272A]">
            <p className="font-bold text-white">
              SiteNest Botanical Nutrition & Research
            </p>
            <p>
              We engineer targeted botanical supplements with strict third-party chromatography testing, zero fillers, and an isolated research subdomain for every bioactive formulation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
