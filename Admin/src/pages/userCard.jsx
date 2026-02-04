import React from "react";

export default function UserCard({ user }) {
  const imageUrl = user?.image
    ? `http://localhost:3000/userImage/${user.image}`
    : null;

  return (
    <div className="p-4 bg-white shadow rounded-lg border border-gray-200 max-w-sm mx-auto">
      {imageUrl && (
        <img
          className="w-full h-40 object-cover rounded"
          src={imageUrl}
          alt={user?.image}
        />
      )}

      <p className="text-gray-900 font-semibold mt-3 mb-2">
        {user?.firstName} {user?.lastName}
      </p>

      <p className="text-gray-700 mb-1">
        <strong>Email:</strong> {user?.email}
      </p>

      <p className="text-gray-700 mb-1">
        <strong>Role:</strong>{" "}
        {Array.isArray(user?.roles) ? user.roles.join(", ") : user?.roles}
      </p>
    </div>
  );
}
