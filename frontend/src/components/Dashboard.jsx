import { useEffect, useState } from "react";
import api from "../services/api";
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";

function Dashboard() {
  const [counts, setCounts] = useState({
    total: 0,
    active: 0,
    expired: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("dashboard/");
      setCounts(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mb-4"></div>
          <p className="text-slate-300 text-xl font-medium">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="bg-red-500 bg-opacity-10 border-2 border-red-500 rounded-2xl p-8 max-w-md">
          <p className="text-red-400 text-xl font-semibold text-center">
            {error}
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Members",
      value: counts.total,
      icon: Users,
      color: "from-purple-500 to-pink-500",
      textColor: "text-purple-400",
      bgGlow: "bg-purple-500",
      iconBg: "bg-purple-500 bg-opacity-20",
    },
    {
      title: "Active Members",
      value: counts.active,
      icon: UserCheck,
      color: "from-emerald-500 to-teal-500",
      textColor: "text-emerald-400",
      bgGlow: "bg-emerald-500",
      iconBg: "bg-emerald-500 bg-opacity-20",
    },
    {
      title: "Expired Members",
      value: counts.expired,
      icon: UserX,
      color: "from-orange-500 to-red-500",
      textColor: "text-orange-400",
      bgGlow: "bg-orange-500",
      iconBg: "bg-orange-500 bg-opacity-20",
    },
  ];

  const activePercentage =
    counts.total > 0
      ? ((counts.active / counts.total) * 100).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight">
            Gym Dashboard
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            Monitor your gym's membership statistics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-slate-800 bg-opacity-50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div
                className={`absolute inset-0 ${stat.bgGlow} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
              ></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-slate-400 text-sm sm:text-base font-medium uppercase tracking-wide">
                    {stat.title}
                  </p>
                  <div className={`${stat.iconBg} p-2 sm:p-3 rounded-xl`}>
                    <stat.icon
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.textColor}`}
                    />
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <p
                    className={`text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                  >
                    {stat.value}
                  </p>

                  {stat.title === "Active Members" && (
                    <span className="text-emerald-400 text-sm sm:text-base font-semibold flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {activePercentage}%
                    </span>
                  )}
                </div>
              </div>

              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              ></div>
            </div>
          ))}
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 sm:p-8 text-white shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">
                Membership Rate
              </h3>
              <p className="text-orange-100 text-sm sm:text-base">
                {activePercentage}% of members have active subscriptions
              </p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-6 py-4">
              <p className="text-3xl sm:text-4xl font-bold">
                {activePercentage}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
