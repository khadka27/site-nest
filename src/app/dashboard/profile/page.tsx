import { getCurrentUser } from "@/lib/auth";
import { User, Calendar, Shield, Mail } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">User Profile</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Your personal information and account status on SiteNest.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white shadow-lg shadow-indigo-600/30">
            {user.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{user.name}</h2>
            <p className="text-xs text-zinc-400">{user.email}</p>
            <span className="mt-2 inline-block text-[10px] font-mono uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">
              {user.role}
            </span>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-6 space-y-4 text-xs">
          <div className="flex items-center justify-between text-zinc-300">
            <span className="flex items-center gap-2 text-zinc-400">
              <Mail className="h-4 w-4" />
              Email
            </span>
            <span className="font-mono">{user.email}</span>
          </div>
          <div className="flex items-center justify-between text-zinc-300">
            <span className="flex items-center gap-2 text-zinc-400">
              <Calendar className="h-4 w-4" />
              Member Since
            </span>
            <span className="font-mono">{formatDate(user.createdAt)}</span>
          </div>
          <div className="flex items-center justify-between text-zinc-300">
            <span className="flex items-center gap-2 text-zinc-400">
              <Shield className="h-4 w-4" />
              Access Level
            </span>
            <span className="font-semibold text-white">{user.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
