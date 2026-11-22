import { Globe, Network, ShieldCheck, CheckCircle2, Copy } from "lucide-react";

export default function AdminDomainsPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Network className="h-6 w-6 text-purple-400" />
          Wildcard Subdomains & DNS Infrastructure
        </h1>
        <p className="text-sm text-zinc-400">
          How automatic subdomains (*.sitenest.com) route traffic directly to your VPS.
        </p>
      </div>

      {/* DNS Setup Guide Card */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 text-emerald-400">
          <ShieldCheck className="h-6 w-6" />
          <h2 className="text-base font-semibold text-white">Recommended Wildcard DNS Records</h2>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          Configure these DNS records in Cloudflare or your DNS registrar pointing to your server IP address. Any subdomain will automatically hit your VPS Nginx server.
        </p>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 overflow-hidden font-mono text-xs">
          <div className="grid grid-cols-3 bg-zinc-900 px-4 py-2.5 text-zinc-400 font-bold uppercase text-[10px]">
            <span>Type</span>
            <span>Host / Name</span>
            <span>Target / Value</span>
          </div>
          <div className="divide-y divide-zinc-800/80">
            <div className="grid grid-cols-3 px-4 py-3 text-zinc-300">
              <span className="text-indigo-400 font-bold">A</span>
              <span>@</span>
              <span className="text-emerald-400">YOUR_SERVER_IP</span>
            </div>
            <div className="grid grid-cols-3 px-4 py-3 text-zinc-300">
              <span className="text-purple-400 font-bold">A</span>
              <span>* (Wildcard)</span>
              <span className="text-emerald-400">YOUR_SERVER_IP</span>
            </div>
            <div className="grid grid-cols-3 px-4 py-3 text-zinc-300">
              <span className="text-cyan-400 font-bold">CNAME</span>
              <span>www</span>
              <span>sitenest.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Architecture summary */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4 text-xs">
        <h3 className="text-sm font-semibold text-white">Wildcard SSL Certificate Integration</h3>
        <p className="text-zinc-400 leading-relaxed">
          For production wildcard certificates (*.sitenest.com), use Let's Encrypt / Certbot with Cloudflare DNS challenge:
        </p>
        <pre className="rounded-xl bg-black/60 p-4 font-mono text-[11px] text-zinc-300 overflow-x-auto">
          certbot certonly --dns-cloudflare --dns-cloudflare-credentials /root/.secrets/cloudflare.ini -d sitenest.com -d &apos;*.sitenest.com&apos;
        </pre>
      </div>
    </div>
  );
}
