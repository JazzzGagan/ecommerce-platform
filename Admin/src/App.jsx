import { Routes, Route } from "react-router-dom";
import Products from "./pages/Products.jsx";
import AdminLayout from "./components/Layout/AdminLayout.jsx";
import DashBoard from "./pages/DashBoard.jsx";
import Catagories from "./pages/Catagories.jsx";

function App() {
  return (
    <>
      <Routes>
        {/* <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} /> */}

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashBoard />} />
          <Route path="categories" element={<Catagories />} />
          <Route path="products" element={<Products />} />
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
