import { useCallback, useEffect, useMemo, useState } from "react";
import API from "../api/api";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUS_BADGE = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
};

const ORDER_STATUS_BADGE = {
  pending: "bg-gray-100 text-gray-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-indigo-100 text-indigo-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const formatCurrency = (value) => `NPR ${Number(value || 0).toFixed(2)}`;

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

const printInvoice = (order) => {
  if (!order) return;

  const invoiceWindow = window.open("", "_blank", "width=900,height=700");
  if (!invoiceWindow) {
    alert("Unable to open print window. Please allow popups and try again.");
    return;
  }

  const rows = (order.items || [])
    .map(
      (item) => `
        <tr>
          <td>${item.name || "-"}</td>
          <td>${item.quantity || 0}</td>
          <td>NPR ${Number(item.price || 0).toFixed(2)}</td>
          <td>NPR ${(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)}</td>
        </tr>
      `,
    )
    .join("");

  invoiceWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>Invoice #${String(order._id || "").slice(-8)}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
          h1 { margin: 0 0 4px; }
          .muted { color: #6b7280; margin-bottom: 20px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
          .card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
          th { background: #f9fafb; }
          .total { margin-top: 14px; text-align: right; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Invoice #${String(order._id || "").slice(-8)}</h1>
        <p class="muted">Created: ${formatDate(order.createdAt)}</p>

        <div class="grid">
          <div class="card">
            <h3>Customer</h3>
            <p>${order.user?.name || "-"}</p>
            <p>${order.user?.email || "-"}</p>
            <p>${order.shippingAddress?.phone || "-"}</p>
          </div>
          <div class="card">
            <h3>Payment</h3>
            <p>Method: ${(order.paymentMethod || "-").toUpperCase()}</p>
            <p>Status: ${order.paymentStatus || "-"}</p>
            <p>Reference: ${order.paymentReference || "-"}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>

        <p class="total">Grand Total: NPR ${Number(order.totalAmount || 0).toFixed(2)}</p>
      </body>
    </html>
  `);

  invoiceWindow.document.close();
  invoiceWindow.focus();
  invoiceWindow.print();
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("");
  const [savingOrderId, setSavingOrderId] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (query.trim()) params.q = query.trim();
      if (paymentMethodFilter) params.paymentMethod = paymentMethodFilter;
      if (paymentStatusFilter) params.paymentStatus = paymentStatusFilter;
      if (orderStatusFilter) params.orderStatus = orderStatusFilter;

      const response = await API.get("/orders/admin", { params });
      setOrders(response.data || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      const message =
        error?.response?.data?.message ||
        (error?.message === "Network Error"
          ? "Cannot reach backend API. Ensure backend is running and CORS allows Admin origin."
          : "Failed to fetch orders. Please try again.");
      alert(message);
    } finally {
      setLoading(false);
    }
  }, [query, paymentMethodFilter, paymentStatusFilter, orderStatusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, nextStatus) => {
    if (!orderId || !nextStatus) return;

    try {
      setSavingOrderId(orderId);
      await API.patch(`/orders/admin/${orderId}/status`, {
        orderStatus: nextStatus,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, orderStatus: nextStatus } : order,
        ),
      );
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to update order status.");
    } finally {
      setSavingOrderId("");
    }
  };

  const summary = useMemo(() => {
    return orders.reduce(
      (acc, order) => {
        acc.total += 1;
        if (order.paymentMethod === "esewa") acc.esewa += 1;
        if (order.paymentMethod === "khalti") acc.khalti += 1;
        if (order.paymentStatus === "paid") acc.paid += 1;
        if (order.orderStatus === "processing") acc.processing += 1;
        return acc;
      },
      { total: 0, esewa: 0, khalti: 0, paid: 0, processing: 0 },
    );
  }, [orders]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Order Management
          </h1>
          <p className="mt-2 text-gray-600">
            Track paid transactions from eSewa and Khalti, then move orders
            through fulfillment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="bg-white rounded-xl border p-4">
            <p className="text-xs text-gray-500 uppercase">Total</p>
            <p className="text-2xl font-semibold text-gray-900">
              {summary.total}
            </p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-xs text-gray-500 uppercase">Paid</p>
            <p className="text-2xl font-semibold text-green-700">
              {summary.paid}
            </p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-xs text-gray-500 uppercase">eSewa</p>
            <p className="text-2xl font-semibold text-emerald-700">
              {summary.esewa}
            </p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-xs text-gray-500 uppercase">Khalti</p>
            <p className="text-2xl font-semibold text-violet-700">
              {summary.khalti}
            </p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-xs text-gray-500 uppercase">Processing</p>
            <p className="text-2xl font-semibold text-indigo-700">
              {summary.processing}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by payment reference or transaction uuid"
              className="border rounded-lg px-3 py-2 text-sm"
            />

            <select
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Payment Methods</option>
              <option value="esewa">eSewa</option>
              <option value="khalti">Khalti</option>
              <option value="fonepay">Fonepay</option>
              <option value="cod">COD</option>
            </select>

            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Payment Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Order Status</option>
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={fetchOrders}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
            >
              Apply Filters
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPaymentStatusFilter("paid")}
              className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-1.5 rounded-md"
            >
              Only Paid Orders
            </button>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setPaymentMethodFilter("");
                setPaymentStatusFilter("");
                setOrderStatusFilter("");
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-medium px-3 py-1.5 rounded-md"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="text-left px-4 py-3">Order</th>
                  <th className="text-left px-4 py-3">Customer</th>
                  <th className="text-left px-4 py-3">Method</th>
                  <th className="text-left px-4 py-3">Payment</th>
                  <th className="text-left px-4 py-3">Amount</th>
                  <th className="text-left px-4 py-3">Order Status</th>
                  <th className="text-left px-4 py-3">Details</th>
                  <th className="text-left px-4 py-3">Update</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      Loading orders...
                    </td>
                  </tr>
                )}

                {!loading && orders.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No orders found.
                    </td>
                  </tr>
                )}

                {!loading &&
                  orders.map((order) => (
                    <tr key={order._id} className="border-t">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">
                          #{order._id.slice(-8)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">
                          {order.user?.name || "-"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.user?.email || "-"}
                        </p>
                      </td>
                      <td className="px-4 py-3 uppercase font-medium">
                        {order.paymentMethod}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            PAYMENT_STATUS_BADGE[order.paymentStatus] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            ORDER_STATUS_BADGE[order.orderStatus] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-semibold"
                        >
                          View
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.orderStatus}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          disabled={savingOrderId === order._id}
                          className="border rounded-lg px-2 py-1.5 text-xs disabled:opacity-60"
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl max-h-[85vh] overflow-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  Order Details #{selectedOrder._id.slice(-8)}
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => printInvoice(selectedOrder)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md"
                  >
                    Print Invoice
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-gray-800"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="rounded-xl border p-4">
                    <p className="text-gray-500">Payment Method</p>
                    <p className="font-semibold uppercase mt-1">
                      {selectedOrder.paymentMethod}
                    </p>
                    <p className="text-gray-500 mt-3">Payment Status</p>
                    <p className="font-semibold mt-1">
                      {selectedOrder.paymentStatus}
                    </p>
                    <p className="text-gray-500 mt-3">Payment Reference</p>
                    <p className="font-mono text-xs mt-1 break-all">
                      {selectedOrder.paymentReference || "-"}
                    </p>
                  </div>

                  <div className="rounded-xl border p-4">
                    <p className="text-gray-500">Order Status</p>
                    <p className="font-semibold mt-1">
                      {selectedOrder.orderStatus}
                    </p>
                    <p className="text-gray-500 mt-3">Order Amount</p>
                    <p className="font-semibold mt-1">
                      {formatCurrency(selectedOrder.totalAmount)}
                    </p>
                    <p className="text-gray-500 mt-3">Created At</p>
                    <p className="mt-1">
                      {formatDate(selectedOrder.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="rounded-xl border p-4">
                    <p className="font-semibold text-gray-900 mb-2">
                      Shipping Address
                    </p>
                    <p>
                      {selectedOrder.shippingAddress?.firstName}{" "}
                      {selectedOrder.shippingAddress?.lastName}
                    </p>
                    <p>{selectedOrder.shippingAddress?.phone}</p>
                    <p>
                      {selectedOrder.shippingAddress?.address},{" "}
                      {selectedOrder.shippingAddress?.building}
                    </p>
                    <p>
                      {selectedOrder.shippingAddress?.city},{" "}
                      {selectedOrder.shippingAddress?.zone},{" "}
                      {selectedOrder.shippingAddress?.country}
                    </p>
                  </div>

                  <div className="rounded-xl border p-4">
                    <p className="font-semibold text-gray-900 mb-2">
                      Billing Address
                    </p>
                    <p>
                      {selectedOrder.billingAddress?.firstName}{" "}
                      {selectedOrder.billingAddress?.lastName}
                    </p>
                    <p>{selectedOrder.billingAddress?.phone}</p>
                    <p>
                      {selectedOrder.billingAddress?.address},{" "}
                      {selectedOrder.billingAddress?.building}
                    </p>
                    <p>
                      {selectedOrder.billingAddress?.city},{" "}
                      {selectedOrder.billingAddress?.zone},{" "}
                      {selectedOrder.billingAddress?.country}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border p-4">
                  <p className="font-semibold text-gray-900 mb-3">Items</p>
                  <div className="space-y-2">
                    {(selectedOrder.items || []).map((item, index) => (
                      <div
                        key={`${selectedOrder._id}-${item.productId || index}`}
                        className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(
                            Number(item.price) * Number(item.quantity),
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
