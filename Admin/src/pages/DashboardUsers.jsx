import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast, Bounce } from "react-toastify";

export default function DashboardUsers() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 1000);

  const handleChangePage = (newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(1);
  };

  // Fetch users from API with query params
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["users", { page, rowsPerPage, debounceSearch }],
    queryFn: async () => {
      const res = await axios.get("/api/users", {
        params: { page, limit: rowsPerPage, search: debounceSearch },
      });
      return res.data;
    },
  });

  // Mutation to delete a user
  const mutation = useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(`/api/users/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message, { transition: Bounce });
      refetch();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Error deleting user");
    },
  });

  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      {/* Search and Add User Button */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search Users"
          className="border rounded-lg px-4 py-2 w-2/3"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
          onClick={() => navigate("/dashboard/users/add")}
        >
          Add User
        </button>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">S.No</th>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">Role</th>
              <th className="py-2 px-4 border-b text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array(rowsPerPage)
                  .fill(null)
                  .map((_, idx) => (
                    <tr key={idx}>
                      <td colSpan="5" className="py-4 px-4">
                        <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                    </tr>
                  ))
              : data?.data.map(({ _id, name, email, role }, index) => (
                  <tr key={_id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">
                      {(page - 1) * rowsPerPage + index + 1}
                    </td>
                    <td className="py-2 px-4 border-b">{name}</td>
                    <td className="py-2 px-4 border-b">{email}</td>
                    <td className="py-2 px-4 border-b capitalize">{role}</td>
                    <td className="py-2 px-4 border-b flex gap-2">
                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                        onClick={() => navigate(`/dashboard/users/edit/${_id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => mutation.mutate(_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-gray-700">
          Rows per page:
          <select
            className="ml-2 border border-gray-300 rounded-md p-1"
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
          >
            {[5, 10, 15].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-gray-600">
            Total Users: <strong>{data?.total ?? 0}</strong>
          </span>
          <div className="flex">
            <button
              onClick={() => handleChangePage(page - 2)}
              disabled={page === 1}
              className="p-2 border border-gray-300 rounded-l-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => handleChangePage(page)}
              disabled={page === Math.ceil((data?.total ?? 1) / rowsPerPage)}
              className="p-2 border border-gray-300 rounded-r-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
