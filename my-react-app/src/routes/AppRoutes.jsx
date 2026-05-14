import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import ProductsPage from "../pages/ProductsPage";
import ProductDetail from "../pages/ProductDetails";

function AppRoutes({ products, addToCart }) {
    return (
        <Routes>
            <Route path="/" element={<Home products={products} addToCart={addToCart} />} />
            <Route path="/products" element={<ProductsPage addToCart={addToCart} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/products/:id" element={<ProductDetail addToCart={addToCart} products={products} />} />
        </Routes>
    );
}

export default AppRoutes;