"use client";

import { useState, useEffect } from "react";
import { Users, Shield, ShieldAlert, Check, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import CustomSelect from "@/components/ui/CustomSelect";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "USER";
  createdAt: string;
  _count: { websites: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChangeRole = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole as any } : u))
        );
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update user role");
      }
    } catch {
      alert("Error updating role");
    } finally {
      setUpdatingId(null);
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Users className="h-6 w-6 text-purple-400" />
          User Accounts & Access Roles
        </h1>
        <p className="text-sm text-zinc-400">
          Manage creator privileges: grant or revoke Admin and Super Admin rights.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 uppercase text-[10px] tracking-wider font-semibold">
            <tr>
              <th className="px-5 py-3.5">Name</th>
              <th className="px-5 py-3.5">Email</th>
              <th className="px-5 py-3.5">Websites</th>
              <th className="px-5 py-3.5">Joined</th>
              <th className="px-5 py-3.5">Current Role</th>
              <th className="px-5 py-3.5 text-right">Change Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-zinc-900/30 transition-colors">
                <td className="px-5 py-4 font-semibold text-white">{u.name}</td>
                <td className="px-5 py-4 font-mono text-zinc-300">{u.email}</td>
                <td className="px-5 py-4 font-mono">{u._count?.websites || 0} sites</td>
                <td className="px-5 py-4 text-zinc-500">{formatDate(u.createdAt)}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      u.role === "SUPER_ADMIN"
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : u.role === "ADMIN"
                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="w-36 ml-auto">
                    <CustomSelect
                      disabled={updatingId === u.id}
                      value={u.role}
                      onChange={(newRole) => handleChangeRole(u.id, newRole)}
                      placeholder=""
                      options={[
                        { value: "USER", label: "USER" },
                        { value: "ADMIN", label: "ADMIN" },
                        { value: "SUPER_ADMIN", label: "SUPER_ADMIN" },
                      ]}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
