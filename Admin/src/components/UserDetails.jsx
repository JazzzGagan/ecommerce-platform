import React, { useState, useEffect } from "react";
import API from "../api/api";
import UserCard from "../pages/userCard";

export default function UserDetails({ userId, onClose }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    API.get(`/users/${userId}`) // GET user by id
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load user data.");
        setLoading(false);
      });
  }, [userId]);

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
      </div>
    </div>
  );
}
