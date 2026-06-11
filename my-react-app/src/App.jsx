import { useEffect, useState } from "react";
import "./styles/global.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

// Separate component to handle layout
function Layout({ cart, addToCart, increaseQty, decreaseQty, removeFromCart, clearCart, products }) {
  const location = useLocation();

  // Don't show Navbar/Footer on admin page
  const isAdminPage = location.pathname.startsWith("/admin");

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {!isAdminPage && <Navbar cartCount={cartCount} />}
      <AppRoutes
        products={products}
        addToCart={addToCart}
        cart={cart}
        increaseQty={increaseQty}
        decreaseQty={decreaseQty}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
      />
      {!isAdminPage && <Footer />}
    </>
  );
}

function App() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);

  const addToCart = (product) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) { window.location.href = "/login"; return; }
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const increaseQty = (productId) => {
    setCart(prevCart => prevCart.map(item =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decreaseQty = (productId) => {
    setCart(prevCart =>
      prevCart
        .map(item => item.id === productId ? { ...item, quantity: item.quantity - 1 } : item)
        .filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <BrowserRouter>
      <Layout
        cart={cart}
        addToCart={addToCart}
        increaseQty={increaseQty}
        decreaseQty={decreaseQty}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        products={products}
      />
    </BrowserRouter>
  );
}

export default App; 