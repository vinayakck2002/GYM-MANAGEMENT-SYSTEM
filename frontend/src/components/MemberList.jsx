import { useEffect, useState } from "react";
import api from "../services/api";
import {
  Users,
  Edit2,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function MemberList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMembers = async (q = search, status = filter, pageNo = page) => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("members/search/", {
        params: {
          q,
          status,
          page: pageNo,
          page_size: 8,
        },
      });

      setMembers(res.data.results);
      setPage(res.data.current_page);
      setTotalPages(res.data.total_pages);
    } catch {
      setError("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers("", "all", 1);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMembers(search, filter, 1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search, filter]);

  const deleteMember = async (id) => {
    if (!window.confirm("Delete this member?")) return;
    await api.delete(`delete/${id}/`);
    fetchMembers(search, filter, page);
  };

  const editMember = async (m) => {
    const name = prompt("Enter new name", m.name);
    const phone = prompt("Enter new phone", m.phone);
    if (!name || !phone) return;

    await api.put(`edit/${m.id}/`, { name, phone });
    fetchMembers(search, filter, page);
  };

  if (loading)
    return <p className="text-center text-slate-400 mt-10">Loading…</p>;

  if (error)
    return <p className="text-center text-red-400 mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-orange-600 rounded-xl">
            <Users className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Members</h1>
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or phone"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 text-white focus:outline-none"
            />
          </div>

          {/* FILTER BUTTONS (RESTORED) */}
          <div className="flex gap-2">
            {["all", "active", "expired"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition
                  ${
                    filter === f
                      ? "bg-orange-600 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE (TABLET + DESKTOP) */}
        <div className="hidden sm:block bg-slate-800/60 rounded-xl border border-slate-700">
          <table className="w-full text-sm text-slate-200">
            <thead className="bg-slate-800 text-slate-400">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Expiry</th>
                <th className="px-4 py-3">Late</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-t border-slate-700">
                  <td className="px-4 py-3 font-semibold">{m.name}</td>
                  <td className="px-4 py-3">{m.phone}</td>
                  <td className="px-4 py-3 text-center">{m.plan}</td>
                  <td className="px-4 py-3 text-center">{m.expiry_date}</td>
                  <td className="px-4 py-3 text-center">{m.late_days}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 bg-blue-600 rounded">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 bg-red-600 rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="sm:hidden space-y-4 mt-4">
          {members.map((m) => (
            <div
              key={m.id}
              className="bg-slate-800 border border-slate-700 rounded-xl p-4"
            >
              <div className="flex justify-between">
                <h3 className="text-white font-bold">{m.name}</h3>
                <span className="text-orange-400">
                  {m.late_days}d
                </span>
              </div>

              <p className="text-slate-400 text-sm">{m.phone}</p>
              <p className="text-slate-400 text-sm">
                Plan: {m.plan} | Exp: {m.expiry_date}
              </p>

              <div className="flex gap-3 mt-3">
                <button className="flex-1 py-2 bg-blue-600 rounded-lg">
                  Edit
                </button>
                <button className="flex-1 py-2 bg-red-600 rounded-lg">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-6">
            <button
              disabled={page === 1}
              onClick={() => fetchMembers(search, filter, page - 1)}
              className="p-2 bg-slate-800 rounded disabled:opacity-40"
            >
              <ChevronLeft />
            </button>

            <span className="text-slate-300">
              {page} / {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => fetchMembers(search, filter, page + 1)}
              className="p-2 bg-slate-800 rounded disabled:opacity-40"
            >
              <ChevronRight />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default MemberList;
