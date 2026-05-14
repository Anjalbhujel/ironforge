import HeroSection from "../components/HeroSection";
import CategorySection from "../components/CategorySection";
import FeaturedProducts from "../components/FeaturedProducts";

function Home({ products, addToCart }) {
    return (
        <div>
            <HeroSection />
            <CategorySection />
            <FeaturedProducts products={products} addToCart={addToCart} />
        </div>
    );
}

export default Home;