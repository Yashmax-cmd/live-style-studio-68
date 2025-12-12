import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Silk Evening Dress",
    price: 289,
    category: "Dresses",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
  },
  {
    id: 2,
    name: "Tailored Blazer",
    price: 425,
    category: "Jackets",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
  },
  {
    id: 3,
    name: "Cashmere Sweater",
    price: 195,
    category: "Knitwear",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
  },
  {
    id: 4,
    name: "Linen Trousers",
    price: 165,
    category: "Pants",
    image: "https://images.unsplash.com/photo-1594938328870-9623159c8c99?w=600&q=80",
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container px-6">
        <div className="text-center mb-16">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Curated Selection</p>
          <h2 className="font-display text-4xl md:text-5xl">Featured Collection</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group relative animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <Link to="/try-on" className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <Button variant="gold" className="w-full gap-2">
                    <Camera className="h-4 w-4" />
                    Try On
                  </Button>
                </Link>
              </div>

              <p className="text-muted-foreground text-sm mb-1">{product.category}</p>
              <h3 className="font-medium text-lg mb-2">{product.name}</h3>
              <p className="text-gold font-medium">${product.price}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link to="/collection">
            <Button variant="outline-gold" size="lg">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;