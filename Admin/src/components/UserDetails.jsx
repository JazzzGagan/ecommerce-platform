import React, { useState, useEffect } from "react";
import API from "../api/api";
import UserCard from "../pages/userCard";

export default function UserDetails({
  userId,
  onClose,
  onUserUpdated,
  onUserDeleted,
}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    roles: "customer",
  });

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    API.get(`/users/${userId}`) // GET user by id
      .then((res) => {
        setUser(res.data);
        setFormData({
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          email: res.data.email || "",
          password: "",
          roles: Array.isArray(res.data.roles)
            ? res.data.roles[0]
            : res.data.roles || "customer",
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load user data.");
        setLoading(false);
      });
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        roles: [formData.roles],
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      const res = await API.put(`/users/${userId}`, payload);
      setUser(res.data);
      setFormData((prev) => ({ ...prev, password: "" }));
      onUserUpdated?.(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update user.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setSaving(true);
    setError(null);

    try {
      await API.delete(`/users/${userId}`);
      onUserDeleted?.(userId);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete user.");
    } finally {
      setSaving(false);
    }
  };

  if (!userId) return null; // Don't show if no user selected

  if (loading) return <p>Loading user details...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          aria-label="Close"
        >
          ✕
        </button>
        {user && <UserCard user={user} />}

        <form onSubmit={handleUpdate} className="mt-4 space-y-3">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First name"
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last name"
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="New password (optional)"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <select
            name="roles"
            value={formData.roles}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 disabled:bg-gray-300"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="flex-1 bg-red-600 text-white rounded px-4 py-2 hover:bg-red-700 disabled:bg-gray-300"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
