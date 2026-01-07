import {
  BrowserRouter,
  Routes,
  Route,
  UNSAFE_getTurboStreamSingleFetchDataStrategy,
} from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardUsers from "./pages/DashboardUsers";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} /> */}

          {/* Dashboard routes */}
          <Route path="/dashboard" element={<DashboardLayout />} />

          {/* <Route path="products" element={<DashboardProducts />} /> */}
          <Route path="dashboard/users" element={<DashboardUsers />} />

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
      </BrowserRouter>
    </>
  );
}

export default App;
