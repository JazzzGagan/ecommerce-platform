import React from "react";

export default function UserCard({ user }) {
  return (
    <div className="p-4 bg-white shadow rounded-lg border border-gray-200 max-w-sm mx-auto">
      <img
        className="w-95 h-40 object-cover"
        src={`http://localhost:3003/${user?.image}`}
        alt={user?.image}
      />

      <p className="text-gray-700 mb-1">
        <strong>Email:</strong> {user?.email}
      </p>
      <p className="text-gray-700 mb-1">
        <strong>Email:</strong> {user?.email}
      </p>
      <p className="text-gray-700 mb-1">
        <strong>Role:</strong> {user?.roles}
      </p>
    </div>
  );
}
