import { redirect } from "next/navigation";

export default async function SitesRedirect({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const { search, category } = await searchParams;
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (category) params.set("category", category);
  const query = params.toString();
  redirect(`/products${query ? `?${query}` : ""}`);
}