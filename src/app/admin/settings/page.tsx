"use client";

import { useState, useEffect } from "react";
import { Settings, Save, CheckCircle2, Loader2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      alert("Error saving settings");
    } finally {
      setSaving(false);
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
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-purple-400" />
          Platform Configuration
        </h1>
        <p className="text-sm text-zinc-400">
          Global storage limits, upload constraints, and domain settings.
        </p>
      </div>

      {saved && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Platform settings updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 space-y-6">
        <div className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-zinc-300 uppercase text-[11px]">Platform Name</label>
            <input
              type="text"
              value={settings.platform_name || ""}
              onChange={(e) => setSettings({ ...settings, platform_name: e.target.value })}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-zinc-300 uppercase text-[11px]">Primary Domain</label>
              <input
                type="text"
                value={settings.base_domain || ""}
                onChange={(e) => setSettings({ ...settings, base_domain: e.target.value })}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-white font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-zinc-300 uppercase text-[11px]">User Content Domain</label>
              <input
                type="text"
                value={settings.website_base_domain || ""}
                onChange={(e) => setSettings({ ...settings, website_base_domain: e.target.value })}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-zinc-300 uppercase text-[11px]">Max ZIP Size (MB)</label>
              <input
                type="number"
                value={settings.max_upload_size_mb || 50}
                onChange={(e) => setSettings({ ...settings, max_upload_size_mb: Number(e.target.value) })}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-white font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-zinc-300 uppercase text-[11px]">Max Uncompressed Size (MB)</label>
              <input
                type="number"
                value={settings.max_uncompressed_mb || 250}
                onChange={(e) => setSettings({ ...settings, max_uncompressed_mb: Number(e.target.value) })}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-white font-mono"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 text-sm text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(settings.allow_user_registration)}
                onChange={(e) => setSettings({ ...settings, allow_user_registration: e.target.checked })}
                className="rounded border-zinc-700 bg-zinc-900 text-purple-600"
              />
              <span>Allow new creators to register accounts</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-zinc-800">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2 text-xs font-semibold text-white hover:bg-purple-500 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
