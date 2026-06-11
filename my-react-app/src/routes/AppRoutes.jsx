import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import ProductsPage from "../pages/ProductsPage";
import ProductDetail from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/CheckOut";
import OrderSuccess from "../pages/OrderSuccess";
import Dashboard from "../pages/Dashboard";
import BMI from "../pages/Bmi";
import Admin from "../pages/admin";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentFailure from "../pages/PaymentFailure";

function AppRoutes({ products, addToCart, cart, increaseQty, decreaseQty, removeFromCart, clearCart }) {
    return (
     <Routes>
      <Route path="/" element={<Home products={products} addToCart={addToCart} />} />
      <Route path="/products" element={<ProductsPage addToCart={addToCart} />} />
      <Route path="/products/:id" element={<ProductDetail addToCart={addToCart} products={products} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/cart" element={
        <Cart
          cart={cart}
          increaseQty={increaseQty}
          decreaseQty={decreaseQty}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
        />}
      />
      <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/bmi" element={<BMI />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/failure" element={<PaymentFailure />} />
     </Routes>
    );
}

export default AppRoutes;