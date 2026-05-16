import HeroSection from "../components/HeroSection";
import CategorySection from "../components/CategorySection";
import FeaturedProducts from "../components/FeaturedProducts";
import WhyUs from "../components/WhyUs";
import TransformBanner from "../components/TransformBanner";
import Reviews from "../components/Reviews";

function Home({ products, addToCart }) {
    return (
        <div>
            <HeroSection />
            <CategorySection />
            <FeaturedProducts products={products} addToCart={addToCart} />
            <WhyUs />
            <TransformBanner />
            <Reviews />
        </div>
    );
}

export default Home;