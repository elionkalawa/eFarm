import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import {
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const user = await getUser();

  // Fetch some stats
  const { count: productsCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  const { count: ordersCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(5);

  // Fetch active users (users who logged in today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { data: activeUsersData } = await supabase
    .from("login_history")
    .select("user_id")
    .gte("login_at", today.toISOString());
  
  // Get unique active users count
  const uniqueActiveUsers = new Set(
    activeUsersData?.map((login) => login.user_id) || []
  ).size;

  // Fetch new users from the past week
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const { count: newUsersThisWeek } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .gte("created_at", weekAgo.toISOString());

  return (
    <div className="space-y-8">
      <div className="bg-gray-100/90 py-3 px-3 rounded-2xl">
        <h1 className="text-3xl font-semibold text-black mb-2">
          Welcome back, {user?.full_name ?? user?.email ?? "Admin"} <span role="img" aria-label="waving hand">👋</span>
        </h1>
        <p className="text-black/60 text-sm">This is what is happening in your store today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={productsCount || 0}
          icon={<Package className="text-blue-600" />}
          trend="+2 this week"
        />
        <StatCard
          title="Total Orders"
          value={ordersCount || 0}
          icon={<ShoppingBag className="text-green-600" />}
          trend="+12% from last month"
        />
        <StatCard
          title="Active Users (Today)"
          value={uniqueActiveUsers}
          icon={<Users className="text-purple-600" />}
          trend={`+${newUsersThisWeek || 0} new users this week`}
        />
        <StatCard
          title="Revenue (Estimated)"
          value="KES 450k"
          icon={<TrendingUp className="text-orange-600" />}
          trend="+8% growth"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders Table Snippet */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <button className="text-sm text-indigo-600 font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentOrders?.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400">
                    ID
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {order.profiles?.full_name || "Unknown"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">
                    KES {order.total_price}
                  </div>
                  <div className="text-xs uppercase font-bold text-yellow-600">
                    {order.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health / Notifications */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            System Notifications
          </h2>
          <div className="space-y-4">
            <NotificationItem
              icon={<AlertCircle className="text-red-500" />}
              message="3 products are out of stock."
              time="2h ago"
            />
            <NotificationItem
              icon={<ShoppingBag className="text-blue-500" />}
              message="New order #A123 received."
              time="4h ago"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  trend,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
          {icon}
        </div>
        <div className="text-sm text-gray-500 font-medium">{title}</div>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-xs text-green-600 font-medium">{trend}</div>
    </div>
  );
}

function NotificationItem({
  icon,
  message,
  time,
}: {
  icon: React.ReactNode;
  message: string;
  time: string;
}) {
  return (
    <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 italic">
      <div className="shrink-0">{icon}</div>
      <div className="flex-1">
        <div className="text-sm text-gray-700">{message}</div>
        <div className="text-xs text-gray-400 mt-1">{time}</div>
      </div>
    </div>
  );
}
