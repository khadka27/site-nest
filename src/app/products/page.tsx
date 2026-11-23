import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { isAdmin } from "@/lib/permissions";
import ProductsCatalogView from "@/components/products/ProductsCatalogView";

export const metadata = {
  title: "Botanical Products & Bioactive Formulations — SiteNest Botanicals",
  description:
    "Explore our complete catalog of targeted botanical supplements, adaptogens, and bioactive longevity formulas. Each product features its own dedicated research microsite.",
};

export default async function ProductsCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  // If an authenticated admin accesses the public catalog, redirect to the Admin Portal
  const session = await getSession();
  if (session && isAdmin(session.role)) {
    redirect("/admin");
  }

  const { search, category } = await searchParams;

  const where = {
    status: "LIVE" as const,
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
        { subdomain: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(category && {
      category: { slug: category },
    }),
  };

  const [products, categories] = await Promise.all([
    prisma.website.findMany({
      where,
      include: {
        category: true,
        deployments: {
          where: { status: "LIVE" },
          orderBy: { version: "desc" },
          take: 1,
          select: {
            version: true,
            fileSize: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.category.findMany({
      include: {
        _count: {
          select: { websites: { where: { status: "LIVE" } } },
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="min-h-screen bg-[#FCF0DA] dark:bg-[#171513] text-[#4C4541] dark:text-[#FBF3E6] flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <ProductsCatalogView
          products={products}
          categories={categories}
          initialSearch={search}
          initialCategory={category}
        />
      </main>

      <Footer />
    </div>
  );
}
