import HeroSection from "../components/HeroSection";
import CategorySection from "../components/CategorySection";
import ProductCard from "../components/ProductCard";

function Home({ products, addToCart }) {
    return (
        <div>
            <HeroSection />
            <CategorySection />
            <div className="products-Section">
                <div className="section-header">
                    <div>
                        <p className="section-tag">OUR COLLECTION</p>
                        <h2 className="section-title">
                            ALL<span className="orange"> PRODUCTS</span>
                        </h2>
                    </div>
                </div>


                {products.length === 0 ? (
                    <p className="no-products">Loading products...</p>
                ) : (
                    <div className="products-grid">  
                        {products.map((item) => (
                            <ProductCard 
                            key={item.id} 
                            product={item}
                            addToCart={addToCart}   
                            />
                        ))}
                    </div>
                )}
            
            </div>
        </div>
    );
}

export default Home;