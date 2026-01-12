import { Outlet } from "react-router-dom";
import Header from "../Header/Navbar.jsx";
import Footer from "../Footer/Footer.jsx";
import NavBar from "../../Test/NavBar.jsx";

export default function AppLayout() {
  return (
    <div className="min-h-dvh bg-bg text-gray-900">
      <NavBar />
      <main className="container py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
