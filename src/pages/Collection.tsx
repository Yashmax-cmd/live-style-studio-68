import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Camera, Filter, Grid, List } from "lucide-react";

const allProducts = [
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
  {
    id: 5,
    name: "Classic White Tee",
    price: 49,
    category: "Tops",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
  },
  {
    id: 6,
    name: "Leather Jacket",
    price: 425,
    category: "Jackets",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
  },
  {
    id: 7,
    name: "Striped Shirt",
    price: 89,
    category: "Tops",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",
  },
  {
    id: 8,
    name: "Wool Coat",
    price: 549,
    category: "Jackets",
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80",
  },
  {
    id: 9,
    name: "Denim Jacket",
    price: 175,
    category: "Jackets",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&q=80",
  },
  {
    id: 10,
    name: "Black Hoodie",
    price: 85,
    category: "Tops",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
  },
  {
    id: 11,
    name: "Silk Blouse",
    price: 145,
    category: "Tops",
    image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&q=80",
  },
  {
    id: 12,
    name: "Wool Cardigan",
    price: 165,
    category: "Knitwear",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80",
  },
  {
    id: 13,
    name: "Evening Gown",
    price: 389,
    category: "Dresses",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80",
  },
  {
    id: 14,
    name: "Polo Shirt",
    price: 69,
    category: "Tops",
    image: "https://images.unsplash.com/photo-1625910513413-5fc40551a299?w=600&q=80",
  },
  {
    id: 15,
    name: "Floral Midi Dress",
    price: 225,
    category: "Dresses",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80",
  },
  {
    id: 16,
    name: "Chino Pants",
    price: 95,
    category: "Pants",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
  },
  {
    id: 17,
    name: "Turtleneck Sweater",
    price: 135,
    category: "Knitwear",
    image: "https://images.unsplash.com/photo-1608234808654-2a8875faa7fd?w=600&q=80",
  },
  {
    id: 18,
    name: "Bomber Jacket",
    price: 295,
    category: "Jackets",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
  },
  {
    id: 19,
    name: "Maxi Dress",
    price: 199,
    category: "Dresses",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80",
  },
  {
    id: 20,
    name: "Wide Leg Trousers",
    price: 145,
    category: "Pants",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
  },
];

const categories = ["All", "Dresses", "Jackets", "Knitwear", "Pants", "Tops"];

const Collection = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredProducts =
    activeCategory === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Our Collection</p>
            <h1 className="font-display text-4xl md:text-5xl">Curated Fashion</h1>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "gold" : "ghost"}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <div className="flex items-center gap-1 border border-border rounded-md p-1">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                : "flex flex-col gap-6"
            }
          >
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className={`group animate-fade-up ${
                  viewMode === "list" ? "flex gap-6 items-center" : ""
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div
                  className={`relative overflow-hidden rounded-lg bg-secondary ${
                    viewMode === "list" ? "w-48 aspect-square flex-shrink-0" : "aspect-[3/4] mb-4"
                  }`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <Link
                    to="/try-on"
                    className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                  >
                    <Button variant="gold" className="w-full gap-2">
                      <Camera className="h-4 w-4" />
                      Try On
                    </Button>
                  </Link>
                </div>

                <div className={viewMode === "list" ? "flex-1" : ""}>
                  <p className="text-muted-foreground text-sm mb-1">{product.category}</p>
                  <h3 className="font-medium text-lg mb-2">{product.name}</h3>
                  <p className="text-gold font-medium">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Collection;