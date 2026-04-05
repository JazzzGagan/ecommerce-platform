import { useEffect, useMemo, useState } from "react";
import API from "../api/api";
import DataTable from "../components/dashboard/DataTable";
import MetricCard from "../components/dashboard/MetricCard";
import SectionCard from "../components/dashboard/SectionCard";
import SimpleBarChart from "../components/dashboard/SimpleBarChart";

const formatCurrency = (value) => `NPR ${Number(value || 0).toFixed(2)}`;

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getCustomerName = (order) => {
  const fullName =
    `${order?.user?.firstName || ""} ${order?.user?.lastName || ""}`.trim() ||
    `${order?.shippingAddress?.firstName || ""} ${order?.shippingAddress?.lastName || ""}`.trim();

  return fullName || order?.user?.email || "Unknown customer";
};

const statusPillClass = (status) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "delivered" || normalized === "paid") {
    return "bg-emerald-100 text-emerald-700";
  }
  if (normalized === "shipped" || normalized === "processing") {
    return "bg-blue-100 text-blue-700";
  }
  if (normalized === "cancelled" || normalized === "failed") {
    return "bg-rose-100 text-rose-700";
  }
  return "bg-amber-100 text-amber-700";
};

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          productsResponse,
          categoriesResponse,
          usersResponse,
          ordersResponse,
        ] = await Promise.all([
          API.get("/products"),
          API.get("/categories"),
          API.get("/users"),
          API.get("/orders/admin"),
        ]);

        setProducts(productsResponse.data || []);
        setCategories(categoriesResponse.data || []);
        setUsers(usersResponse.data || []);
        setOrders(ordersResponse.data || []);
      } catch (fetchError) {
        console.error("Failed to fetch dashboard data:", fetchError);
        setError(
          fetchError?.response?.data?.message ||
            "Unable to load dashboard data. Please check backend connection and admin authorization.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const paidOrders = useMemo(
    () => orders.filter((order) => order.paymentStatus === "paid"),
    [orders],
  );

  const totalRevenue = useMemo(
    () =>
      paidOrders.reduce(
        (sum, order) => sum + Number(order.totalAmount || order.subtotal || 0),
        0,
      ),
    [paidOrders],
  );

  const recentOrders = useMemo(() => orders.slice(0, 8), [orders]);

  const topSellingProducts = useMemo(() => {
    const salesMap = new Map();

    paidOrders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const key = String(item.productId || item.name || "");
        if (!key) return;

        const current = salesMap.get(key) || {
          id: key,
          name: item.name || "Unnamed product",
          quantitySold: 0,
          totalSales: 0,
        };

        const quantity = Number(item.quantity || 0);
        const unitPrice = Number(item.price || 0);

        current.quantitySold += quantity;
        current.totalSales += quantity * unitPrice;

        salesMap.set(key, current);
      });
    });

    return Array.from(salesMap.values())
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, 5);
  }, [paidOrders]);

  const lowStockProducts = useMemo(
    () =>
      products
        .filter((product) => Number(product.quantity || 0) < 5)
        .sort((a, b) => Number(a.quantity || 0) - Number(b.quantity || 0))
        .slice(0, 10),
    [products],
  );

  const orderStatusOverview = useMemo(
    () => ({
      pending: orders.filter((order) => order.orderStatus === "pending").length,
      paid: orders.filter((order) => order.paymentStatus === "paid").length,
      shipped: orders.filter((order) => order.orderStatus === "shipped").length,
      delivered: orders.filter((order) => order.orderStatus === "delivered")
        .length,
    }),
    [orders],
  );

  const ordersPerDayChart = useMemo(() => {
    const dateMap = new Map();

    paidOrders.forEach((order) => {
      const date = new Date(order.createdAt);
      if (Number.isNaN(date.getTime())) return;

      const label = date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });

      dateMap.set(label, (dateMap.get(label) || 0) + 1);
    });

    return Array.from(dateMap.entries())
      .map(([label, value]) => ({ label, value }))
      .slice(-7);
  }, [paidOrders]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse space-y-5">
            <div className="h-12 w-72 rounded bg-gray-200" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-5">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="h-28 rounded-xl bg-gray-200" />
              ))}
            </div>
            <div className="h-80 rounded-2xl bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Dashboard Overview
            </h1>
            <p className="mt-2 text-gray-600">
              Live analytics from your products, orders, users, and categories.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Refresh
          </button>
        </div>

        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            title="Total Products"
            value={products.length}
            subtitle="Active catalog items"
            tone="blue"
          />
          <MetricCard
            title="Total Orders"
            value={orders.length}
            subtitle="All order records"
            tone="violet"
          />
          <MetricCard
            title="Total Users"
            value={users.length}
            subtitle="Registered users"
            tone="emerald"
          />
          <MetricCard
            title="Total Categories"
            value={categories.length}
            subtitle="Configured categories"
            tone="amber"
          />
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            subtitle="Paid orders only"
            tone="rose"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <SectionCard title="Recent Orders">
              <DataTable
                columns={[
                  {
                    key: "customer",
                    header: "Customer Name",
                    render: (order) => (
                      <div>
                        <p className="font-medium text-gray-900">
                          {getCustomerName(order)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.user?.email || "-"}
                        </p>
                      </div>
                    ),
                  },
                  {
                    key: "amount",
                    header: "Total Amount",
                    render: (order) => (
                      <span className="font-medium text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    ),
                    align: "right",
                  },
                  {
                    key: "status",
                    header: "Status",
                    render: (order) => (
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${statusPillClass(order.orderStatus)}`}
                        >
                          {order.orderStatus || "pending"}
                        </span>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${statusPillClass(order.paymentStatus)}`}
                        >
                          {order.paymentStatus || "pending"}
                        </span>
                      </div>
                    ),
                  },
                  {
                    key: "createdAt",
                    header: "Date",
                    render: (order) => formatDate(order.createdAt),
                  },
                ]}
                rows={recentOrders}
                emptyText="No orders found yet."
              />
            </SectionCard>

            <SectionCard title="Top Selling Products">
              <DataTable
                columns={[
                  {
                    key: "name",
                    header: "Product",
                    render: (product) => (
                      <span className="font-medium text-gray-900">
                        {product.name}
                      </span>
                    ),
                  },
                  {
                    key: "quantitySold",
                    header: "Quantity Sold",
                    align: "right",
                  },
                  {
                    key: "totalSales",
                    header: "Sales",
                    align: "right",
                    render: (product) => formatCurrency(product.totalSales),
                  },
                ]}
                rows={topSellingProducts}
                emptyText="No paid order data available to calculate top sellers."
              />
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard title="Order Status Overview">
              <div className="space-y-3">
                {[
                  {
                    label: "Pending",
                    value: orderStatusOverview.pending,
                    tone: "text-amber-700",
                  },
                  {
                    label: "Paid",
                    value: orderStatusOverview.paid,
                    tone: "text-emerald-700",
                  },
                  {
                    label: "Shipped",
                    value: orderStatusOverview.shipped,
                    tone: "text-blue-700",
                  },
                  {
                    label: "Delivered",
                    value: orderStatusOverview.delivered,
                    tone: "text-violet-700",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2"
                  >
                    <span className="text-sm font-medium text-gray-600">
                      {item.label}
                    </span>
                    <span className={`text-xl font-bold ${item.tone}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Low Stock Products">
              <DataTable
                columns={[
                  {
                    key: "name",
                    header: "Product",
                    render: (product) => (
                      <span className="font-medium text-gray-900">
                        {product.name}
                      </span>
                    ),
                  },
                  {
                    key: "quantity",
                    header: "Stock",
                    align: "right",
                    render: (product) => (
                      <span className="font-semibold text-rose-700">
                        {Number(product.quantity || 0)}
                      </span>
                    ),
                  },
                ]}
                rows={lowStockProducts}
                emptyText="No low-stock products right now."
              />
            </SectionCard>

            <SectionCard title="Orders per Day (Paid)">
              <SimpleBarChart data={ordersPerDayChart} />
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
