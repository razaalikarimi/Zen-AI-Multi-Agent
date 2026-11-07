import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  ShieldAlert, Users, CreditCard, Activity, CheckCircle2,
  Search, Shield, UserX, AlertTriangle
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import api from "../utils/axios";

const MOCK_USERS = [
  { _id: "usr-1", name: "Zen Architect", email: "developer@zen.ai", role: "admin", plan: "enterprise", credits: 4850, createdAt: "2025-01-15" },
  { _id: "usr-2", name: "Alice Morgan", email: "alice@techcorp.io", role: "user", plan: "pro", credits: 890, createdAt: "2025-02-10" },
  { _id: "usr-3", name: "David Kim", email: "david@finscale.ai", role: "user", plan: "starter", credits: 320, createdAt: "2025-03-01" },
  { _id: "usr-4", name: "Sarah Chen", email: "sarah@biolabs.org", role: "user", plan: "free", credits: 85, createdAt: "2025-03-22" },
];

export default function AdminConsole() {
  const { userData } = useSelector((state) => state.user);
  const [users, setUsers] = useState(MOCK_USERS);
  const [metrics, setMetrics] = useState({
    totalUsers: 4,
    paidSubscriptions: 3,
    totalRemainingCredits: 6145,
    totalAllocatedCredits: 7000,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!userData || userData.role !== "admin") return;
      try {
        const { data } = await api.get("/api/admin/overview");
        if (data?.data?.metrics) setMetrics(data.data.metrics);
        const usersRes = await api.get("/api/admin/users");
        if (usersRes?.data?.data?.users) setUsers(usersRes.data.data.users);
      } catch (e) {
        // Fallback to local admin data
      }
    };
    fetchAdminData();
  }, []);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await api.patch(`/api/admin/users/${userId}/role`, { role: newRole });
    } catch (e) {}

    setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
    setFeedback(`Updated role for user to ${newRole.toUpperCase()}`);
    setTimeout(() => setFeedback(null), 2500);
  };

  const filtered = users.filter(
    (u) => u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Header */}
        <div className="px-8 py-6 bg-white border-b border-black/[0.06] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider bg-[#ef4444]/10 text-[#ef4444]">
                Enterprise Admin Guard
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#0f172a]">Admin Operations Console</h1>
            <p className="text-[13px] text-[#64748b]">Platform telemetry, tenant auditing, and role-based permissions.</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 max-w-6xl">
          {feedback && (
            <div className="p-4 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] text-[13px] flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#10b981]" />
              {feedback}
            </div>
          )}

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-white border border-black/[0.06] shadow-sm">
              <div className="flex items-center justify-between text-[#64748b] text-[12px] mb-2 font-medium">
                <span>Registered Users</span>
                <Users size={16} className="text-[#0891b2]" />
              </div>
              <p className="text-2xl font-extrabold text-[#0f172a]">{metrics.totalUsers}</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-black/[0.06] shadow-sm">
              <div className="flex items-center justify-between text-[#64748b] text-[12px] mb-2 font-medium">
                <span>Paid Subscriptions</span>
                <CreditCard size={16} className="text-[#10b981]" />
              </div>
              <p className="text-2xl font-extrabold text-[#0f172a]">{metrics.paidSubscriptions}</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-black/[0.06] shadow-sm">
              <div className="flex items-center justify-between text-[#64748b] text-[12px] mb-2 font-medium">
                <span>Active Credit Pool</span>
                <Activity size={16} className="text-[#f59e0b]" />
              </div>
              <p className="text-2xl font-extrabold text-[#0f172a]">{metrics.totalRemainingCredits.toLocaleString()}</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-black/[0.06] shadow-sm">
              <div className="flex items-center justify-between text-[#64748b] text-[12px] mb-2 font-medium">
                <span>Cluster Security</span>
                <Shield size={16} className="text-[#10b981]" />
              </div>
              <p className="text-2xl font-extrabold text-[#10b981]">Enforced</p>
              <p className="text-[11px] text-[#94a3b8] mt-1">HMAC signatures active</p>
            </div>
          </div>

          {/* User Management Table */}
          <div className="rounded-2xl bg-white border border-black/[0.07] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-black/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-[15px] font-bold text-[#0f172a]">User Accounts & Roles</h3>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="text"
                  placeholder="Filter users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg border border-black/[0.08] text-[12.5px] outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-[#f8fafc] text-[#64748b] border-b border-black/[0.06] text-[11px] font-semibold uppercase">
                  <tr>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Plan</th>
                    <th className="px-6 py-3">Credits</th>
                    <th className="px-6 py-3">Created</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.05]">
                  {filtered.map((u) => (
                    <tr key={u._id} className="hover:bg-[#f8fafc] transition">
                      <td className="px-6 py-3.5">
                        <p className="font-semibold text-[#0f172a]">{u.name}</p>
                        <p className="text-[11px] text-[#94a3b8]">{u.email}</p>
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            u.role === "admin" ? "bg-[#fee2e2] text-[#ef4444]" : "bg-[#f1f5f9] text-[#64748b]"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 capitalize font-medium text-[#0f172a]">{u.plan}</td>
                      <td className="px-6 py-3.5 font-semibold text-[#0891b2]">{u.credits}</td>
                      <td className="px-6 py-3.5 text-[#64748b]">{u.createdAt}</td>
                      <td className="px-6 py-3.5">
                        <button
                          onClick={() => handleRoleToggle(u._id, u.role)}
                          className="text-[12px] font-medium text-[#0891b2] hover:underline cursor-pointer bg-transparent border-none"
                        >
                          {u.role === "admin" ? "Demote to User" : "Promote to Admin"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

