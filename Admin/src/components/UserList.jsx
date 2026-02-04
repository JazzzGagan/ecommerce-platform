// UsersList.jsx
import React, { useState, useEffect } from "react";
import API from "../api/api";
import UserDetails from "./UserDetails";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    roles: "customer",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    API.get("/users")
      .then((res) => setUsers(res.data))
      .catch(() => setError("Failed to fetch users"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await API.post("/users", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        roles: [formData.roles],
      });

      setUsers((prev) => [response.data, ...prev]);
      setSuccess("User created successfully");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        roles: "customer",
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers((prev) =>
      prev.map((user) => (user._id === updatedUser._id ? updatedUser : user)),
    );
  };

  const handleUserDeleted = (deletedId) => {
    setUsers((prev) => prev.filter((user) => user._id !== deletedId));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Create User</h2>

        {error && <p className="text-red-600 mb-2">{error}</p>}
        {success && <p className="text-green-600 mb-2">{success}</p>}

        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First name"
            required
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last name"
            required
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="border border-gray-300 rounded px-3 py-2"
          />
          <select
            name="roles"
            value={formData.roles}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 disabled:bg-gray-300"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </form>
      </div>

      <ul className="space-y-4">
        {users.map((user) => (
          <li
            key={user._id}
            className="p-4 border border-gray-300 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-medium">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
            <button
              onClick={() => setSelectedUserId(user._id)}
              className="text-blue-600 hover:underline"
            >
              View
            </button>
          </li>
        ))}
      </ul>

      {/* Show UserDetails modal */}
      {selectedUserId && (
        <UserDetails
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
          onUserUpdated={handleUserUpdated}
          onUserDeleted={handleUserDeleted}
        />
      )}
    </div>
  );
}
