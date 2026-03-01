import Test from "./pages/Test.jsx";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import CategoryProducts from "./pages/CategoryProducts.jsx";
import Account from "./pages/Account.jsx";
import ShippingBilling from "./pages/ShippingBilling.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/category/:slug" element={<CategoryProducts />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />
          <Route
            path="/shipping-billing-address"
            element={
              <PrivateRoute>
                <ShippingBilling />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/account"
            element={
              <PrivateRoute>
                <Account />
              </PrivateRoute>
            }
          />
          <Route
            path="test"
            element={
              <PrivateRoute>
                <Test />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
