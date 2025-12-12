import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, CameraOff, RefreshCw, Shirt, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const clothingItems = [
  {
    id: 1,
    name: "Classic White Tee",
    category: "Tops",
    price: 49,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80",
  },
  {
    id: 2,
    name: "Navy Blazer",
    category: "Jackets",
    price: 289,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&q=80",
  },
  {
    id: 3,
    name: "Striped Shirt",
    category: "Tops",
    price: 89,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&q=80",
  },
  {
    id: 4,
    name: "Cashmere Sweater",
    category: "Knitwear",
    price: 195,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200&q=80",
  },
  {
    id: 5,
    name: "Leather Jacket",
    category: "Jackets",
    price: 425,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&q=80",
  },
  {
    id: 6,
    name: "Floral Dress",
    category: "Dresses",
    price: 159,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&q=80",
  },
  {
    id: 7,
    name: "Denim Jacket",
    category: "Jackets",
    price: 175,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=200&q=80",
  },
  {
    id: 8,
    name: "Black Hoodie",
    category: "Tops",
    price: 85,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=80",
  },
  {
    id: 9,
    name: "Silk Blouse",
    category: "Tops",
    price: 145,
    image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=200&q=80",
  },
  {
    id: 10,
    name: "Wool Cardigan",
    category: "Knitwear",
    price: 165,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&q=80",
  },
  {
    id: 11,
    name: "Evening Gown",
    category: "Dresses",
    price: 389,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=200&q=80",
  },
  {
    id: 12,
    name: "Polo Shirt",
    category: "Tops",
    price: 69,
    image: "https://images.unsplash.com/photo-1625910513413-5fc40551a299?w=200&q=80",
  },
];

const TryOn = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedItem, setSelectedItem] = useState<typeof clothingItems[0] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    setIsLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      
      streamRef.current = stream;
      setIsCameraActive(true);
      
      toast({
        title: "Camera activated",
        description: "Select an item from the sidebar to try it on!",
      });
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to use virtual try-on.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }, [toast]);

  // Attach stream to video element when camera becomes active
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(console.error);
    }
  }, [isCameraActive]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6">
          <nav className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to store
            </Link>
            <h1 className="font-display text-xl">Virtual Try-On</h1>
            <div className="w-24" />
          </nav>
        </div>
      </header>

      <div className="pt-16 flex min-h-screen">
        {/* Sidebar - Clothing items */}
        <aside className="w-80 border-r border-border bg-card p-6 overflow-y-auto max-h-screen">
          <h2 className="font-display text-lg mb-4">Select an Item</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Choose clothing to try on virtually
          </p>

          <div className="space-y-4 pb-20">
            {clothingItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all ${
                  selectedItem?.id === item.id
                    ? "bg-gold/10 border border-gold"
                    : "bg-secondary hover:bg-secondary/80 border border-transparent"
                }`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="text-left flex-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                  <p className="text-gold text-sm font-medium mt-1">${item.price}</p>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Main camera area */}
        <main className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden bg-secondary border border-border">
            {isCameraActive ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: "scaleX(-1)" }}
                />
                {/* Overlay for selected item */}
                {selectedItem && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg p-3 pointer-events-auto">
                      <p className="text-sm font-medium">{selectedItem.name}</p>
                      <p className="text-xs text-muted-foreground">Trying on...</p>
                    </div>
                    {/* Virtual clothing overlay placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-40">
                      <img
                        src={selectedItem.image}
                        alt={selectedItem.name}
                        className="h-1/2 object-contain mix-blend-screen"
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-24 h-24 rounded-full bg-gold/10 flex items-center justify-center mb-6">
                  <Camera className="h-12 w-12 text-gold" />
                </div>
                <h3 className="font-display text-2xl mb-2">Start Virtual Try-On</h3>
                <p className="text-muted-foreground max-w-sm mb-8">
                  Enable your camera to see how our clothes look on you in real-time
                </p>
                <Button
                  variant="hero"
                  size="xl"
                  onClick={startCamera}
                  disabled={isLoading}
                  className="gap-3"
                >
                  {isLoading ? (
                    <RefreshCw className="h-5 w-5 animate-spin" />
                  ) : (
                    <Camera className="h-5 w-5" />
                  )}
                  {isLoading ? "Activating..." : "Enable Camera"}
                </Button>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-8">
            {isCameraActive && (
              <>
                <Button variant="outline" onClick={stopCamera} className="gap-2">
                  <CameraOff className="h-4 w-4" />
                  Stop Camera
                </Button>
                {selectedItem && (
                  <Button variant="gold" className="gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Add to Cart - ${selectedItem.price}
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-8 text-center max-w-lg">
            <p className="text-sm text-muted-foreground">
              <Shirt className="h-4 w-4 inline-block mr-2" />
              Select items from the sidebar and see them overlaid on your live camera feed.
              Position yourself in frame for the best experience.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TryOn;