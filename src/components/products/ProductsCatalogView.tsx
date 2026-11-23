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
  Send,
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
        return <Zap className="h-3.5 w-3.5 text-[#AEAC78]" />;
      case "cognitive":
        return <Brain className="h-3.5 w-3.5 text-[#AEAC78]" />;
      case "recovery":
        return <Moon className="h-3.5 w-3.5 text-[#AEAC78]" />;
      case "longevity":
        return <Leaf className="h-3.5 w-3.5 text-[#AEAC78]" />;
      default:
        return <FlaskConical className="h-3.5 w-3.5 text-[#AEAC78]" />;
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
      <section className="relative overflow-hidden rounded-3xl bg-[#FFF8ED] dark:bg-[#1E1A17] border border-[#DECBB0] dark:border-[#3D352F] shadow-sm transition-colors duration-200">
        {/* Decorative architectural background texture with giant "Shop" lettering */}
        <div className="absolute inset-0 select-none pointer-events-none overflow-hidden">
          <span className="absolute -top-10 sm:-top-16 left-1/2 -translate-x-1/2 text-[120px] sm:text-[180px] lg:text-[230px] font-black tracking-tight text-[#4C4541]/[0.04] dark:text-[#FBF3E6]/[0.03] uppercase font-sans">
            Shop
          </span>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFF8ED]/50 to-[#FFF8ED] dark:via-[#1E1A17]/60 dark:to-[#1E1A17]" />
        </div>

        <div className="relative px-6 py-12 sm:px-10 sm:py-16 lg:px-12 flex flex-col justify-between min-h-[220px]">
          {/* Top category label & micro badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#AEAC78]/15 text-[#5A5B35] dark:text-[#AEAC78] border border-[#AEAC78]/30">
              <Leaf className="h-3 w-3 text-[#AEAC78]" />
              Artisan Botanical Nutrition
            </span>
          </div>

          {/* Headline and search bar row matching reference UI */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2">
            <div className="space-y-2 max-w-xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#4C4541] dark:text-[#FBF3E6]">
                Give All You Need
              </h1>
              <p className="text-xs sm:text-sm text-[#7A6F68] dark:text-[#B5AAA0] leading-relaxed">
                Pure clinical formulations synthesized for cellular longevity and daily vitality. Every product is hosted with full lab assay transparency on its own dedicated research microsite.
              </p>
            </div>

            {/* Floating integrated search pill */}
            <form
              onSubmit={handleSearchSubmit}
              className="w-full lg:w-[420px] shrink-0"
            >
              <div className="relative flex items-center bg-[#FCF0DA]/80 dark:bg-[#171513] border border-[#DECBB0] dark:border-[#3D352F] rounded-full p-1.5 pl-4 shadow-sm focus-within:border-[#AEAC78] focus-within:ring-2 focus-within:ring-[#AEAC78]/20 transition-all">
                <Search className="h-4 w-4 text-[#7A6F68] dark:text-[#B5AAA0] shrink-0 mr-2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search on SiteNest..."
                  className="w-full bg-transparent text-xs sm:text-sm text-[#4C4541] dark:text-[#FBF3E6] placeholder-[#7A6F68]/70 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-full bg-[#171513] hover:bg-[#2D2823] dark:bg-[#F2C46A] dark:hover:bg-[#E5B555] text-[#FCF0DA] dark:text-[#171513] px-5 py-2 text-xs font-semibold transition-all shadow-sm cursor-pointer shrink-0"
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#1E1A17] text-xs font-semibold text-[#4C4541] dark:text-[#FBF3E6] shadow-sm"
          >
            <SlidersHorizontal className="h-4 w-4 text-[#AEAC78]" />
            <span>{sidebarOpen ? "Hide Filter Menu" : "Show Category Filters"}</span>
          </button>

          <span className="text-xs text-[#7A6F68] dark:text-[#B5AAA0]">
            Showing <strong className="text-[#4C4541] dark:text-[#FBF3E6]">{filteredProducts.length}</strong> formulations
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
          <div className="rounded-3xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#1E1A17] p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold tracking-tight text-[#4C4541] dark:text-[#FBF3E6] uppercase">
                Category
              </h2>
              {(activeCategory || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#AEAC78] hover:underline"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
              )}
            </div>

            {/* "All Product" active pill button with count badge */}
            <div>
              <button
                onClick={() => handleCategorySelect("")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                  !activeCategory
                    ? "bg-[#171513] text-[#FCF0DA] dark:bg-[#F2C46A] dark:text-[#171513] shadow-sm"
                    : "bg-[#FCF0DA]/60 dark:bg-[#171513] text-[#7A6F68] dark:text-[#B5AAA0] hover:bg-[#F5E5C9] dark:hover:bg-[#24201C]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 shrink-0 text-[#AEAC78]" />
                  <span>All Formulations</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      !activeCategory
                        ? "bg-[#F2C46A] text-[#171513] dark:bg-[#171513] dark:text-[#F2C46A]"
                        : "bg-[#DECBB0] dark:bg-[#3D352F] text-[#4C4541] dark:text-[#FBF3E6]"
                    }`}
                  >
                    {products.length}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                </div>
              </button>
            </div>

            {/* Hierarchical category list with tree branches */}
            <div className="space-y-1 pl-2 border-l border-[#DECBB0]/70 dark:border-[#3D352F]/70 ml-2">
              {categories.map((c) => {
                const isSelected = activeCategory === c.slug;
                const count = c._count?.websites ?? 0;
                return (
                  <button
                    key={c.id}
                    onClick={() => handleCategorySelect(c.slug)}
                    className={`w-full group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                      isSelected
                        ? "bg-[#AEAC78]/20 text-[#5A5B35] dark:text-[#AEAC78] font-bold"
                        : "text-[#7A6F68] dark:text-[#B5AAA0] hover:text-[#4C4541] dark:hover:text-[#FBF3E6] hover:bg-[#FCF0DA]/50 dark:hover:bg-[#171513]"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[#DECBB0] dark:text-[#3D352F] group-hover:text-[#AEAC78]">
                        ↳
                      </span>
                      {getCategoryIcon(c.slug)}
                      <span className="truncate">{c.name}</span>
                    </div>
                    {count > 0 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-[#FCF0DA] dark:bg-[#171513] text-[#7A6F68] dark:text-[#B5AAA0] shrink-0 border border-[#DECBB0]/50 dark:border-[#3D352F]/50">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Filter Accordion: Formulation Status */}
            <div className="pt-4 border-t border-[#DECBB0] dark:border-[#3D352F] space-y-3">
              <button
                type="button"
                onClick={() => toggleAccordion("status")}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#4C4541] dark:text-[#FBF3E6]"
              >
                <span>Release Status</span>
                {openAccordions.status ? (
                  <ChevronDown className="h-4 w-4 text-[#7A6F68]" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-[#7A6F68]" />
                )}
              </button>

              {openAccordions.status && (
                <div className="space-y-2 text-xs text-[#7A6F68] dark:text-[#B5AAA0]">
                  <div className="flex items-center justify-between px-2 py-1 rounded-lg hover:bg-[#FCF0DA]/50 dark:hover:bg-[#171513]">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#AEAC78] animate-pulse" />
                      Active Live Batches
                    </span>
                    <span className="font-mono text-[10px]">{products.length}</span>
                  </div>
                  <div className="flex items-center justify-between px-2 py-1 rounded-lg hover:bg-[#FCF0DA]/50 dark:hover:bg-[#171513]">
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#AEAC78]" />
                      Chromatography Verified
                    </span>
                    <span className="font-mono text-[10px]">100%</span>
                  </div>
                  <div className="flex items-center justify-between px-2 py-1 rounded-lg hover:bg-[#FCF0DA]/50 dark:hover:bg-[#171513]">
                    <span className="flex items-center gap-2">
                      <Award className="h-3.5 w-3.5 text-[#AEAC78]" />
                      Dedicated Subdomain Ready
                    </span>
                    <span className="font-mono text-[10px]">{products.length}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Filter Accordion: Potency & Standards */}
            <div className="pt-4 border-t border-[#DECBB0] dark:border-[#3D352F] space-y-3">
              <button
                type="button"
                onClick={() => toggleAccordion("certification")}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#4C4541] dark:text-[#FBF3E6]"
              >
                <span>Purity Standards</span>
                {openAccordions.certification ? (
                  <ChevronDown className="h-4 w-4 text-[#7A6F68]" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-[#7A6F68]" />
                )}
              </button>

              {openAccordions.certification && (
                <ul className="space-y-1.5 text-xs text-[#7A6F68] dark:text-[#B5AAA0] pl-1">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#AEAC78]" />
                    <span>Non-GMO Project Verified</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#AEAC78]" />
                    <span>Heavy Metals ICP-MS Tested</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#AEAC78]" />
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFF8ED] dark:bg-[#1E1A17] border border-[#DECBB0] dark:border-[#3D352F] rounded-2xl px-5 py-3 shadow-sm">
            <div className="text-xs text-[#7A6F68] dark:text-[#B5AAA0]">
              Showing <strong className="text-[#4C4541] dark:text-[#FBF3E6]">{filteredProducts.length}</strong> certified bioactive formulations
              {activeCategory && (
                <span> in <span className="text-[#5A5B35] dark:text-[#AEAC78] font-semibold">{categories.find((c) => c.slug === activeCategory)?.name || activeCategory}</span></span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#7A6F68] dark:text-[#B5AAA0] shrink-0 font-medium">Sort by:</span>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FCF0DA]/60 dark:bg-[#171513] px-3 py-1.5 text-xs text-[#4C4541] dark:text-[#FBF3E6] focus:border-[#AEAC78] focus:outline-none cursor-pointer"
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
            <div className="rounded-3xl border border-dashed border-[#DECBB0] dark:border-[#3D352F] p-16 text-center space-y-4 bg-[#FFF8ED] dark:bg-[#1E1A17]">
              <Leaf className="h-10 w-10 text-[#AEAC78] mx-auto opacity-70" />
              <h3 className="text-lg font-bold text-[#4C4541] dark:text-[#FBF3E6]">
                No Formulations Found
              </h3>
              <p className="text-xs sm:text-sm text-[#7A6F68] dark:text-[#B5AAA0] max-w-md mx-auto">
                No active botanical supplements match your search &ldquo;{searchTerm}&rdquo; or filter criteria.
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#F2C46A] hover:bg-[#E5B555] px-5 py-2 text-xs font-semibold text-[#2D2305] transition-all shadow-sm cursor-pointer"
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
                    className="group rounded-3xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#1E1A17] p-5 flex flex-col justify-between hover:border-[#AEAC78] dark:hover:border-[#AEAC78] transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <div className="space-y-4">
                      {/* Product Image Container with soft background & floating category badge */}
                      <div className="relative aspect-square w-full rounded-2xl bg-[#FCF0DA]/60 dark:bg-[#171513] border border-[#DECBB0]/70 dark:border-[#3D352F]/70 overflow-hidden flex items-center justify-center p-4">
                        {/* Top-Right Floating Category Pill */}
                        <span className="absolute top-3 right-3 z-10 text-[10px] font-semibold text-[#4C4541] dark:text-[#FBF3E6] bg-white/90 dark:bg-[#201C19]/90 px-2.5 py-1 rounded-full border border-[#DECBB0] dark:border-[#3D352F] shadow-sm backdrop-blur-sm">
                          {metrics.badge}
                        </span>

                        {/* Top-Left WebP Technology Badge */}
                        <span className="absolute top-3 left-3 z-10 text-[9px] font-mono font-bold text-[#5A5B35] dark:text-[#AEAC78] bg-[#AEAC78]/15 px-2 py-0.5 rounded-md border border-[#AEAC78]/30">
                          WebP
                        </span>

                        {/* Centered WebP Image */}
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-contain group-hover:scale-108 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-[#AEAC78] space-y-2">
                            <Leaf className="h-12 w-12 opacity-60" />
                            <span className="text-xs font-mono">Botanical Extract</span>
                          </div>
                        )}
                      </div>

                      {/* Product Title */}
                      <div>
                        <h3 className="text-base font-bold text-[#4C4541] dark:text-[#FBF3E6] group-hover:text-[#5A5B35] dark:group-hover:text-[#AEAC78] transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </div>

                      {/* Rating & Reviews on Left + Price on Right */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Star className="h-3.5 w-3.5 fill-[#F2C46A] text-[#F2C46A]" />
                          <span className="font-bold text-[#4C4541] dark:text-[#FBF3E6]">
                            {metrics.rating.toFixed(1)}
                          </span>
                          <span className="text-[11px] text-[#7A6F68] dark:text-[#B5AAA0]">
                            ({metrics.reviews})
                          </span>
                        </div>

                        <div className="text-base font-black text-[#4C4541] dark:text-[#FBF3E6]">
                          {metrics.price}
                        </div>
                      </div>

                      {/* Dedicated Subdomain Badge */}
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#5A5B35] dark:text-[#AEAC78] bg-[#FCF0DA]/80 dark:bg-[#171513] px-2.5 py-1 rounded-lg border border-[#DECBB0] dark:border-[#3D352F]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#AEAC78]" />
                        <span className="truncate">{product.subdomain}.sitenest.com</span>
                      </div>
                    </div>

                    {/* Dual Action Buttons matching reference UI */}
                    <div className="mt-5 pt-4 border-t border-[#DECBB0] dark:border-[#3D352F] grid grid-cols-2 gap-2.5">
                      {/* Button 1: "Lab Specs" (Outline pill with high-contrast hover) */}
                      <Link
                        href={`/products/${product.slug}`}
                        className="rounded-full border border-[#DECBB0] dark:border-[#3D352F] bg-white dark:bg-[#201C19] text-[#4C4541] dark:text-[#FBF3E6] hover:bg-[#171513] hover:text-[#FCF0DA] hover:border-[#171513] dark:hover:bg-[#F2C46A] dark:hover:text-[#171513] dark:hover:border-[#F2C46A] py-2.5 px-3 text-xs font-semibold text-center transition-all duration-200 shadow-sm cursor-pointer"
                      >
                        Lab Specs
                      </Link>

                      {/* Button 2: "Visit Microsite" (Solid dark / amber pill with active hover) */}
                      <a
                        href={`/s/${product.subdomain}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-[#171513] dark:border-[#F2C46A] bg-[#171513] dark:bg-[#F2C46A] text-[#FCF0DA] dark:text-[#171513] hover:bg-[#2D2823] hover:border-[#2D2823] hover:text-white dark:hover:bg-[#E5B555] dark:hover:border-[#E5B555] dark:hover:text-black py-2.5 px-3 text-xs font-semibold text-center transition-all duration-200 shadow-sm inline-flex items-center justify-center gap-1 cursor-pointer"
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
          <div className="pt-8 pb-4 flex items-center justify-center gap-2 text-xs font-medium text-[#7A6F68] dark:text-[#B5AAA0]">
            <button
              disabled
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#DECBB0] dark:border-[#3D352F] opacity-50 cursor-not-allowed"
            >
              <ArrowLeft className="h-3 w-3" />
              Previous
            </button>
            <span className="h-8 w-8 rounded-full bg-[#171513] text-[#FCF0DA] dark:bg-[#F2C46A] dark:text-[#171513] font-bold flex items-center justify-center shadow-sm">
              1
            </span>
            <button
              disabled
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#DECBB0] dark:border-[#3D352F] opacity-50 cursor-not-allowed"
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
      <section className="pt-6 border-t border-[#DECBB0] dark:border-[#3D352F] space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#5A5B35] dark:text-[#AEAC78]">
              CLINICAL SYNERGY
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#4C4541] dark:text-[#FBF3E6]">
              Explore our recommendations
            </h2>
          </div>

          {/* Slider control arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollCarousel("left")}
              aria-label="Previous recommendation"
              className="h-9 w-9 rounded-full border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#1E1A17] flex items-center justify-center text-[#4C4541] dark:text-[#FBF3E6] hover:bg-[#171513] hover:text-[#FCF0DA] hover:border-[#171513] dark:hover:bg-[#F2C46A] dark:hover:text-[#171513] dark:hover:border-[#F2C46A] transition-all cursor-pointer shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollCarousel("right")}
              aria-label="Next recommendation"
              className="h-9 w-9 rounded-full border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#1E1A17] flex items-center justify-center text-[#4C4541] dark:text-[#FBF3E6] hover:bg-[#171513] hover:text-[#FCF0DA] hover:border-[#171513] dark:hover:bg-[#F2C46A] dark:hover:text-[#171513] dark:hover:border-[#F2C46A] transition-all cursor-pointer shadow-sm"
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
                className="group w-72 shrink-0 rounded-3xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#1E1A17] p-4 flex flex-col justify-between shadow-sm hover:border-[#AEAC78] dark:hover:border-[#AEAC78] transition-all duration-300 hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="relative aspect-[4/3] w-full rounded-2xl bg-[#FCF0DA]/60 dark:bg-[#171513] border border-[#DECBB0]/70 dark:border-[#3D352F]/70 overflow-hidden flex items-center justify-center p-3">
                    <span className="absolute top-2.5 right-2.5 text-[9px] font-semibold text-[#4C4541] dark:text-[#FBF3E6] bg-white/90 dark:bg-[#201C19]/90 px-2 py-0.5 rounded-full border border-[#DECBB0] dark:border-[#3D352F]">
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

                  <h4 className="text-sm font-bold text-[#4C4541] dark:text-[#FBF3E6] group-hover:text-[#5A5B35] dark:group-hover:text-[#AEAC78] transition-colors truncate">
                    {item.name}
                  </h4>

                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 font-bold text-[#4C4541] dark:text-[#FBF3E6]">
                      <Star className="h-3 w-3 fill-[#F2C46A] text-[#F2C46A]" />
                      {metrics.rating.toFixed(1)}
                    </span>
                    <span className="font-extrabold text-[#4C4541] dark:text-[#FBF3E6]">
                      {metrics.price}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#DECBB0] dark:border-[#3D352F] grid grid-cols-2 gap-2 text-[11px]">
                  {/* Button 1: "Specs" (Outline pill with high-contrast hover) */}
                  <Link
                    href={`/products/${item.slug}`}
                    className="rounded-full border border-[#DECBB0] dark:border-[#3D352F] bg-white dark:bg-[#201C19] text-[#4C4541] dark:text-[#FBF3E6] hover:bg-[#171513] hover:text-[#FCF0DA] hover:border-[#171513] dark:hover:bg-[#F2C46A] dark:hover:text-[#171513] dark:hover:border-[#F2C46A] py-2 px-2 font-semibold text-center transition-all duration-200 shadow-sm cursor-pointer"
                  >
                    Specs
                  </Link>

                  {/* Button 2: "Microsite" (Solid pill with active hover) */}
                  <a
                    href={`/s/${item.subdomain}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-[#171513] dark:border-[#F2C46A] bg-[#171513] dark:bg-[#F2C46A] text-[#FCF0DA] dark:text-[#171513] hover:bg-[#2D2823] hover:border-[#2D2823] hover:text-white dark:hover:bg-[#E5B555] dark:hover:border-[#E5B555] dark:hover:text-black py-2 px-2 font-semibold text-center transition-all duration-200 shadow-sm inline-flex items-center justify-center gap-1 cursor-pointer"
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
      <section className="rounded-3xl bg-[#171513] dark:bg-[#1E1A17] text-[#FCF0DA] dark:text-[#FBF3E6] p-8 sm:p-12 lg:p-14 border border-[#3D352F] shadow-lg relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#AEAC78]/10 blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading & Email Input */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#FCF0DA] leading-tight">
              Ready to Optimize Your Vitality?
            </h2>

            {isSubscribed ? (
              <div className="inline-flex items-center gap-2 bg-[#AEAC78]/20 text-[#AEAC78] border border-[#AEAC78]/40 px-4 py-2.5 rounded-full text-xs font-semibold">
                <Check className="h-4 w-4" />
                <span>Thank you! You are subscribed to certified batch releases.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="max-w-md">
                <div className="relative flex items-center bg-[#25221F] border border-[#3D352F] rounded-full p-1.5 pl-4 shadow-inner focus-within:border-[#AEAC78]">
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full bg-transparent text-xs sm:text-sm text-[#FCF0DA] placeholder-[#7A6F68] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-[#F2C46A] hover:bg-[#E5B555] text-[#171513] px-6 py-2.5 text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0"
                  >
                    Send
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Mission description */}
          <div className="lg:col-span-5 space-y-2 text-xs sm:text-sm text-[#B5AAA0] leading-relaxed lg:pl-6 lg:border-l lg:border-[#3D352F]">
            <p className="font-bold text-[#FCF0DA]">
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
