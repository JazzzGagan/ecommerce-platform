import { useEffect, useState } from "react";
import API from "../api/api";

const initialForm = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  expiresAt: "",
};

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

const Coupons = () => {
  const [form, setForm] = useState(initialForm);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await API.get("/coupons");
      setCoupons(response.data || []);
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to fetch coupons.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.code.trim() || !form.discountValue || !form.expiresAt) {
      alert("Please complete all coupon fields.");
      return;
    }

    try {
      setSaving(true);
      await API.post("/coupons", {
        code: form.code.trim().toUpperCase(),
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        expiresAt: new Date(form.expiresAt).toISOString(),
      });

      setForm(initialForm);
      await fetchCoupons();
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to create coupon.";
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  const toggleCoupon = async (coupon) => {
    try {
      await API.patch(`/coupons/${coupon._id}`, {
        isActive: !coupon.isActive,
      });
      await fetchCoupons();
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to update coupon status.";
      alert(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Coupon Management
          </h1>
          <p className="mt-2 text-gray-600">
            Create and manage discount coupons for checkout.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-xl p-5 grid grid-cols-1 md:grid-cols-5 gap-3"
        >
          <input
            type="text"
            value={form.code}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                code: e.target.value.toUpperCase(),
              }))
            }
            placeholder="Code (e.g. SAVE10)"
            className="border rounded-lg px-3 py-2 text-sm"
          />

          <select
            value={form.discountType}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, discountType: e.target.value }))
            }
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount (NPR)</option>
          </select>

          <input
            type="number"
            min="0"
            step="0.01"
            value={form.discountValue}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, discountValue: e.target.value }))
            }
            placeholder="Discount value"
            className="border rounded-lg px-3 py-2 text-sm"
          />

          <input
            type="datetime-local"
            value={form.expiresAt}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, expiresAt: e.target.value }))
            }
            className="border rounded-lg px-3 py-2 text-sm"
          />

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60"
          >
            {saving ? "Saving..." : "Create Coupon"}
          </button>
        </form>

        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left px-4 py-3">Code</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Value</th>
                <th className="text-left px-4 py-3">Expiry</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={6}>
                    Loading coupons...
                  </td>
                </tr>
              )}

              {!loading && coupons.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={6}>
                    No coupons created yet.
                  </td>
                </tr>
              )}

              {!loading &&
                coupons.map((coupon) => (
                  <tr key={coupon._id} className="border-t">
                    <td className="px-4 py-3 font-semibold">{coupon.code}</td>
                    <td className="px-4 py-3 capitalize">{coupon.discountType}</td>
                    <td className="px-4 py-3">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : `NPR ${Number(coupon.discountValue || 0).toFixed(2)}`}
                    </td>
                    <td className="px-4 py-3">{formatDate(coupon.expiresAt)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          coupon.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {coupon.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleCoupon(coupon)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-semibold"
                      >
                        {coupon.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Coupons;