import { Menu, Plus } from "lucide-react";

export default function AdminMenusPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Menu className="h-6 w-6 text-purple-400" />
          Navigation Menus
        </h1>
        <p className="text-sm text-zinc-400">
          Configure Header and Footer links for the public website.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">Header Navigation Links</h2>
          <ul className="space-y-2 text-xs text-zinc-300 divide-y divide-zinc-800">
            <li className="pt-2 flex justify-between"><span>Showcase</span> <span className="font-mono text-zinc-500">/sites</span></li>
            <li className="pt-2 flex justify-between"><span>Features</span> <span className="font-mono text-zinc-500">/#features</span></li>
            <li className="pt-2 flex justify-between"><span>How It Works</span> <span className="font-mono text-zinc-500">/#how-it-works</span></li>
            <li className="pt-2 flex justify-between"><span>Pricing</span> <span className="font-mono text-zinc-500">/pricing</span></li>
            <li className="pt-2 flex justify-between"><span>Docs / FAQ</span> <span className="font-mono text-zinc-500">/faq</span></li>
          </ul>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">Footer Legal & Resources</h2>
          <ul className="space-y-2 text-xs text-zinc-300 divide-y divide-zinc-800">
            <li className="pt-2 flex justify-between"><span>About Us</span> <span className="font-mono text-zinc-500">/about</span></li>
            <li className="pt-2 flex justify-between"><span>Terms of Service</span> <span className="font-mono text-zinc-500">/terms</span></li>
            <li className="pt-2 flex justify-between"><span>Privacy Policy</span> <span className="font-mono text-zinc-500">/privacy</span></li>
            <li className="pt-2 flex justify-between"><span>Contact</span> <span className="font-mono text-zinc-500">/contact</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
