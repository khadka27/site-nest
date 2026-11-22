import { getCurrentUser } from "@/lib/auth";
import { Settings, Shield, Bell, Key } from "lucide-react";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Account Settings</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Manage your account preferences, security credentials, and deployment notifications.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <Key className="h-4 w-4 text-indigo-400" />
          Security Credentials
        </h2>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Email Address</label>
            <input
              type="text"
              disabled
              value={user.email}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-3.5 py-2 text-sm text-zinc-400 cursor-not-allowed"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Change Password</label>
            <input
              type="password"
              placeholder="Enter new password (minimum 6 characters)"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <Bell className="h-4 w-4 text-indigo-400" />
          Deployment Notifications
        </h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3 text-sm text-zinc-300">
            <input type="checkbox" defaultChecked className="rounded border-zinc-700 bg-zinc-900 text-indigo-600" />
            <span>Notify me via email when my deployment succeeds</span>
          </label>
          <label className="flex items-center gap-3 text-sm text-zinc-300">
            <input type="checkbox" defaultChecked className="rounded border-zinc-700 bg-zinc-900 text-indigo-600" />
            <span>Notify me if a deployment fails or encounters validation errors</span>
          </label>
        </div>
      </div>
    </div>
  );
}
