"use client";

import { useState, useEffect } from "react";
import { Tags, Plus, Trash2, Loader2 } from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  _count: { websites: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setCreating(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: description.trim() }),
      });

      if (res.ok) {
        setName("");
        setDescription("");
        await fetchCategories();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create category");
      }
    } catch {
      alert("Error creating category");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      }
    } catch {
      alert("Error deleting category");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Tags className="h-6 w-6 text-purple-400" />
          Website Categories
        </h1>
        <p className="text-sm text-zinc-400">
          Organize showcase websites into discoverable topics (e.g. Portfolio, Agency, SaaS, E-Commerce).
        </p>
      </div>

      {/* Create form */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white">Add New Category</h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              required
              placeholder="Category Name (e.g. Agency)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs text-white"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Brief description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs text-white"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={creating || !name}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Create Category
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden divide-y divide-zinc-800">
        {categories.map((cat) => (
          <div key={cat.id} className="p-4 flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-white text-sm">{cat.name}</p>
              <p className="font-mono text-zinc-500 text-[11px]">slug: {cat.slug}</p>
              {cat.description && <p className="text-zinc-400 mt-0.5">{cat.description}</p>}
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-zinc-400">
                {cat._count?.websites || 0} sites
              </span>
              <button
                type="button"
                onClick={() => handleDelete(cat.id)}
                className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                title="Delete category"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
