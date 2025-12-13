import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { Camera, Minus, Plus, ShoppingBag, CreditCard, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import SizeGuide from "@/components/product/SizeGuide";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  sizes: string[];
  in_stock: boolean;
}

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        navigate("/collection");
        return;
      }

      setProduct(data);
      if (data.sizes?.length > 0) {
        setSelectedSize(data.sizes[0]);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!product || !selectedSize) return;
    await addToCart(product.id, selectedSize, quantity);
  };

  const handleBuyNow = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!product || !selectedSize) return;
    await addToCart(product.id, selectedSize, quantity);
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container px-6">
            <div className="grid md:grid-cols-2 gap-12">
              <Skeleton className="aspect-[3/4] rounded-lg" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container px-6">
          <Link
            to="/collection"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Collection
          </Link>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="relative overflow-hidden rounded-lg bg-secondary aspect-[3/4]">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {!product.in_stock && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <span className="text-xl font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <p className="text-gold text-sm tracking-[0.2em] uppercase mb-2">
                {product.category}
              </p>
              <h1 className="font-display text-3xl md:text-4xl mb-4">
                {product.name}
              </h1>
              <p className="text-2xl text-gold font-medium mb-6">
                {formatPrice(product.price)}
              </p>

              <p className="text-muted-foreground leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Size Selection */}
              <div className="mb-4">
                <p className="text-sm font-medium mb-3">Select Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-md border text-sm font-medium transition-all ${
                        selectedSize === size
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-border hover:border-gold/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Guide */}
              <div className="mb-6">
                <SizeGuide category={product.category} selectedSize={selectedSize} />
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <p className="text-sm font-medium mb-3">Quantity</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-md border border-border flex items-center justify-center hover:border-gold/50 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-md border border-border flex items-center justify-center hover:border-gold/50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  variant="outline-gold"
                  size="xl"
                  className="flex-1 gap-2"
                  onClick={handleAddToCart}
                  disabled={!product.in_stock}
                >
                  <ShoppingBag className="h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  variant="gold"
                  size="xl"
                  className="flex-1 gap-2"
                  onClick={handleBuyNow}
                  disabled={!product.in_stock}
                >
                  <CreditCard className="h-5 w-5" />
                  Buy Now
                </Button>
              </div>

              {/* Try On Button */}
              <Link to={`/try-on?product=${product.id}`}>
                <Button variant="hero" size="lg" className="w-full gap-2">
                  <Camera className="h-5 w-5" />
                  Virtual Try-On
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Product;
