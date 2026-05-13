
import { useEffect, useState } from "react";
import "./styles/global.css";
import Navbar from "./components/Navbar";  
import Footer from "./components/Footer";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  
  const addToCart = (product) => {
  setCart([...cart, product]);
  };

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <BrowserRouter>
      <Navbar cartCount={cart.length} />
      <AppRoutes products={products} addToCart={addToCart} />
      <Footer />
    </BrowserRouter>
  );
}

export default App;

             