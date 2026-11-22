"use client";

import { useState, useEffect } from "react";
import {
  Sliders,
  Save,
  RotateCcw,
  Eye,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  ToggleLeft,
  ToggleRight,
  Loader2,
  ExternalLink,
} from "lucide-react";

interface CMSSection {
  id: string;
  sectionKey: string;
  title: string;
  order: number;
  enabled: boolean;
  content: any;
}

export default function AdminHomepageCMSPage() {
  const [sections, setSections] = useState<CMSSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchSections = async () => {
    try {
      const res = await fetch("/api/cms/homepage");
      const data = await res.json();
      if (data.sections) {
        setSections(data.sections);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleToggleEnabled = async (section: CMSSection) => {
    const newEnabled = !section.enabled;
    setSections((prev) =>
      prev.map((s) => (s.sectionKey === section.sectionKey ? { ...s, enabled: newEnabled } : s))
    );

    await fetch("/api/cms/homepage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sectionKey: section.sectionKey,
        enabled: newEnabled,
      }),
    });
  };

  const handleContentChange = (sectionKey: string, keyPath: string[], value: any) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.sectionKey !== sectionKey) return s;
        const newContent = { ...s.content };
        if (keyPath.length === 1) {
          newContent[keyPath[0]] = value;
        } else if (keyPath.length === 2) {
          newContent[keyPath[0]] = { ...newContent[keyPath[0]], [keyPath[1]]: value };
        }
        return { ...s, content: newContent };
      })
    );
  };

  const handleSaveSection = async (section: CMSSection) => {
    setSavingKey(section.sectionKey);
    setSuccessMsg(null);
    try {
      const res = await fetch("/api/cms/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionKey: section.sectionKey,
          title: section.title,
          enabled: section.enabled,
          order: section.order,
          content: section.content,
        }),
      });

      if (res.ok) {
        setSuccessMsg(`Section "${section.title}" saved successfully!`);
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch {
      alert("Failed to save section");
    } finally {
      setSavingKey(null);
    }
  };

  const handleResetDefaults = async () => {
    if (!confirm("Reset all homepage sections to factory default content?")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/cms/homepage/reset", { method: "POST" });
      const data = await res.json();
      if (data.sections) {
        setSections(data.sections);
        setSuccessMsg("Homepage sections reset to factory defaults!");
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch {
      alert("Reset failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Sliders className="h-6 w-6 text-purple-400" />
            Homepage Section CMS
          </h1>
          <p className="text-sm text-zinc-400">
            Edit landing page text, headings, buttons, and section visibility without touching source code.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <Eye className="h-3.5 w-3.5 text-purple-400" />
            Preview Live Home
            <ExternalLink className="h-3 w-3" />
          </a>
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-xs font-medium text-zinc-400 hover:text-red-400 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Defaults
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Sections List */}
      <div className="space-y-6">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`rounded-2xl border transition-all ${
              section.enabled
                ? "border-zinc-800 bg-zinc-900/40"
                : "border-zinc-900 bg-zinc-950/40 opacity-60"
            }`}
          >
            {/* Section Card Top Bar */}
            <div className="px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-purple-400 uppercase">
                  #{section.order + 1}
                </span>
                <h3 className="font-semibold text-white text-sm">{section.title}</h3>
                <span className="font-mono text-[10px] text-zinc-500">
                  [{section.sectionKey}]
                </span>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleToggleEnabled(section)}
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                    section.enabled
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-zinc-800 text-zinc-500 border border-zinc-700"
                  }`}
                >
                  {section.enabled ? "Enabled" : "Disabled"}
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveSection(section)}
                  disabled={savingKey === section.sectionKey}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-500 transition-colors shadow-sm disabled:opacity-50"
                >
                  {savingKey === section.sectionKey ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Save className="h-3 w-3" />
                  )}
                  Save
                </button>
              </div>
            </div>

            {/* Section Specific Editable Fields */}
            <div className="p-6 space-y-4 text-xs">
              {section.sectionKey === "hero" && (
                <>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-400 uppercase">Badge Label</label>
                    <input
                      type="text"
                      value={section.content?.badge || ""}
                      onChange={(e) => handleContentChange("hero", ["badge"], e.target.value)}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-400 uppercase">Headline Title</label>
                    <input
                      type="text"
                      value={section.content?.title || ""}
                      onChange={(e) => handleContentChange("hero", ["title"], e.target.value)}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-white font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-400 uppercase">Subtitle Description</label>
                    <textarea
                      rows={2}
                      value={section.content?.subtitle || ""}
                      onChange={(e) => handleContentChange("hero", ["subtitle"], e.target.value)}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-zinc-400 uppercase">Primary CTA Text</label>
                      <input
                        type="text"
                        value={section.content?.primaryButton?.text || ""}
                        onChange={(e) => handleContentChange("hero", ["primaryButton", "text"], e.target.value)}
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-zinc-400 uppercase">Secondary CTA Text</label>
                      <input
                        type="text"
                        value={section.content?.secondaryButton?.text || ""}
                        onChange={(e) => handleContentChange("hero", ["secondaryButton", "text"], e.target.value)}
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                </>
              )}

              {section.sectionKey === "features" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-zinc-400 uppercase">Tagline</label>
                      <input
                        type="text"
                        value={section.content?.tagline || ""}
                        onChange={(e) => handleContentChange("features", ["tagline"], e.target.value)}
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-zinc-400 uppercase">Features Title</label>
                      <input
                        type="text"
                        value={section.content?.title || ""}
                        onChange={(e) => handleContentChange("features", ["title"], e.target.value)}
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-white font-semibold"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-400 uppercase">Description</label>
                    <textarea
                      rows={2}
                      value={section.content?.description || ""}
                      onChange={(e) => handleContentChange("features", ["description"], e.target.value)}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
                    />
                  </div>
                </>
              )}

              {section.sectionKey === "how_it_works" && (
                <>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-400 uppercase">Workflow Title</label>
                    <input
                      type="text"
                      value={section.content?.title || ""}
                      onChange={(e) => handleContentChange("how_it_works", ["title"], e.target.value)}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
                    />
                  </div>
                </>
              )}

              {section.sectionKey === "pricing" && (
                <>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-400 uppercase">Pricing Section Title</label>
                    <input
                      type="text"
                      value={section.content?.title || ""}
                      onChange={(e) => handleContentChange("pricing", ["title"], e.target.value)}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
                    />
                  </div>
                </>
              )}

              {section.sectionKey === "faq" && (
                <>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-400 uppercase">FAQ Section Title</label>
                    <input
                      type="text"
                      value={section.content?.title || ""}
                      onChange={(e) => handleContentChange("faq", ["title"], e.target.value)}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
                    />
                  </div>
                </>
              )}

              {section.sectionKey === "footer" && (
                <>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-400 uppercase">Copyright Notice</label>
                    <input
                      type="text"
                      value={section.content?.copyright || ""}
                      onChange={(e) => handleContentChange("footer", ["copyright"], e.target.value)}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
                    />
                  </div>
                </>
              )}

              {/* JSON preview / advanced editor */}
              <details className="mt-4 text-[11px] text-zinc-500">
                <summary className="cursor-pointer hover:text-zinc-300">
                  Advanced Content JSON Inspector
                </summary>
                <pre className="mt-2 rounded-xl bg-black/60 p-3 font-mono text-[10px] text-purple-300 overflow-x-auto">
                  {JSON.stringify(section.content, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
