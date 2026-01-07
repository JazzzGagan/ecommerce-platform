import React from "react";

export default function Header({ onLogout }) {
  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6">
      {/* <h1 className="text-xl font-semibold">Dashboard</h1> */}

      <div className="flex items-center space-x-4">
        {/* Optional search input */}
        <input
          type="search"
          placeholder="Search..."
          className="px-3 py-1 rounded border border-gray-300 focus:outline-none focus:ring focus:ring-indigo-300"
        />

        {/* Profile info */}
        <div className="flex items-center space-x-3 cursor-pointer">
          <img
            src=""
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">Admin</span>
        </div>

        {/* Logout button */}
        {/* <button
          onClick={onLogout}
          className="text-red-600 hover:text-red-700 font-semibold"
        >
          Logout
        </button> */}
      </div>
    </header>
  );
}
