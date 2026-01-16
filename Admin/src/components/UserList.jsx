// UsersList.jsx
import React, { useState, useEffect } from "react";
import API from "../api/api";
import UserDetails from "./UserDetails";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    API.get("/users").then((res) => setUsers(res.data));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <ul className="space-y-4">
        {users.map((user) => (
          <li
            key={user._id}
            className="p-4 border border-gray-300 rounded flex justify-between items-center"
          >
            <span>{user.name}</span>
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
        />
      )}
    </div>
  );
}
