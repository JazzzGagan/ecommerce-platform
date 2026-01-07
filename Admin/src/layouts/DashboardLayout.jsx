import { Outlet, useNavigate } from "react-router-dom";
import { FaBoxOpen, FaListAlt, FaShoppingCart, FaUsers, FaSignOutAlt } from "react-icons/fa";

export default function DashboardLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here
    navigate("/");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-800 text-white flex flex-col">
        <div className="h-16 flex items-center px-4 text-xl font-semibold border-b border-gray-700">
          Dashboard
        </div>
        <nav className="flex-1 overflow-y-auto mt-4">
          <ul>
            <li>
              <button
                onClick={() => navigate("/dashboard/products")}
                className="flex items-center w-full px-4 py-3 hover:bg-gray-700 focus:outline-none"
              >
                <FaBoxOpen className="w-5 h-5 mr-3" />
                Products
              </button>
            </li>

            <li>
              <button
                onClick={() => navigate("/dashboard/categories")}
                className="flex items-center w-full px-4 py-3 hover:bg-gray-700 focus:outline-none"
              >
                <FaListAlt className="w-5 h-5 mr-3" />
                Categories
              </button>
            </li>

            <li>
              <button
                onClick={() => navigate("/dashboard/orders")}
                className="flex items-center w-full px-4 py-3 hover:bg-gray-700 focus:outline-none"
              >
                <FaShoppingCart className="w-5 h-5 mr-3" />
                Orders
              </button>
            </li>

            <li>
              <button
                onClick={() => navigate("/dashboard/users")}
                className="flex items-center w-full px-4 py-3 hover:bg-gray-700 focus:outline-none"
              >
                <FaUsers className="w-5 h-5 mr-3" />
                Users
              </button>
            </li>
          </ul>
        </nav>
        <div className="border-t border-gray-700 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-red-500 hover:text-red-600"
          >
            <FaSignOutAlt className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        {/* <Header onLogout={handleLogout} /> */}

        {/* Content Area */}
        <section className="flex-1 p-6 bg-gray-50 overflow-auto">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
