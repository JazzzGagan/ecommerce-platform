import { Routes, Route, Navigate } from "react-router-dom";
import Products from "./pages/Products.jsx";
import AdminLayout from "./components/Layout/AdminLayout.jsx";
import DashBoard from "./pages/DashBoard.jsx";
import Catagories from "./pages/Catagories.jsx";
import UsersList from "./components/userList.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Orders from "./pages/Orders.jsx";
import Coupons from "./pages/Coupons.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashBoard />} />
          <Route path="categories" element={<Catagories />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<UsersList />} />
          <Route path="coupons" element={<Coupons />} />
        </Route>

        <Route
          path="*"
          element={
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <h1>404 - Page Not Found</h1>
              <p>The page you are looking for does not exist.</p>
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App;
