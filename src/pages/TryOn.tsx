import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, CameraOff, RefreshCw, Shirt, ShoppingBag, Sparkles, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string;
  description: string;
}

const TryOn = () => {
  const [searchParams] = useSearchParams();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  const { addToCart } = useCart();

  // Fetch all products from database
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, category, image_url, description")
        .order("name");

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data || []);
        
        // If product ID is in URL, select it
        const productId = searchParams.get("product");
        if (productId && data) {
          const product = data.find(p => p.id === productId);
          if (product) {
            setSelectedItem(product);
          }
        }
      }
      setLoadingProducts(false);
    };

    fetchProducts();
  }, [searchParams]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(price);
  };

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
        description: "Select an item and click 'Try On with AI' to see the magic!",
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
    setCapturedImage(null);
    setResultImage(null);
  }, []);

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) {
      console.error("Video or canvas ref not available");
      return null;
    }
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error("Video dimensions not ready:", video.videoWidth, video.videoHeight);
      return null;
    }
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Could not get canvas context");
      return null;
    }
    
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    ctx.restore();
    
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    
    if (!dataUrl || dataUrl === "data:," || dataUrl.length < 1000) {
      console.error("Invalid data URL generated:", dataUrl.substring(0, 50));
      return null;
    }
    
    console.log("Captured frame successfully, length:", dataUrl.length);
    return dataUrl;
  }, []);

  const handleTryOn = useCallback(async () => {
    if (!selectedItem) {
      toast({
        title: "Select an item",
        description: "Please select a clothing item to try on.",
        variant: "destructive",
      });
      return;
    }

    const frame = captureFrame();
    if (!frame) {
      toast({
        title: "Capture failed",
        description: "Could not capture camera frame. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setCapturedImage(frame);
    setIsProcessing(true);
    setResultImage(null);

    try {
      const { data, error } = await supabase.functions.invoke("virtual-try-on", {
        body: {
          userImage: frame,
          clothingDescription: selectedItem.description || selectedItem.name,
          clothingImageUrl: selectedItem.image_url,
        },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.resultImage) {
        setResultImage(data.resultImage);
        toast({
          title: "Try-on complete!",
          description: `See how you look in the ${selectedItem.name}`,
        });
      }
    } catch (error) {
      console.error("Try-on error:", error);
      toast({
        title: "Try-on failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setCapturedImage(null);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedItem, captureFrame, toast]);

  const handleAddToCart = async () => {
    if (selectedItem) {
      await addToCart(selectedItem.id, "M");
    }
  };

  const clearResult = useCallback(() => {
    setCapturedImage(null);
    setResultImage(null);
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
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6">
          <nav className="flex items-center justify-between h-16">
            <Link
              to="/collection"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Collection
            </Link>
            <h1 className="font-display text-xl">AI Virtual Try-On</h1>
            <div className="w-24" />
          </nav>
        </div>
      </header>

      <div className="pt-16 flex min-h-screen">
        {/* Sidebar - Clothing items */}
        <aside className="w-80 border-r border-border bg-card p-6 overflow-y-auto max-h-screen">
          <h2 className="font-display text-lg mb-4">Select an Item</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Choose any clothing to try on with AI ({products.length} items)
          </p>

          <div className="space-y-4 pb-20">
            {loadingProducts ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3">
                  <Skeleton className="w-16 h-16 rounded-md" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-16 mb-2" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              ))
            ) : (
              products.map((item) => (
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
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                    <p className="text-gold text-sm font-medium mt-1">{formatPrice(item.price)}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Main camera area */}
        <main className="flex-1 flex flex-col items-center justify-center p-8">
          {resultImage ? (
            <div className="w-full max-w-5xl">
              <div className="grid grid-cols-2 gap-8">
                <div className="relative">
                  <p className="text-muted-foreground text-sm mb-3">Original</p>
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-secondary border border-border">
                    <img
                      src={capturedImage || ""}
                      alt="Original"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="relative">
                  <p className="text-gold text-sm mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    With {selectedItem?.name}
                  </p>
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-secondary border border-gold">
                    <img
                      src={resultImage}
                      alt="Try-on result"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 mt-8">
                <Button variant="outline" onClick={clearResult} className="gap-2">
                  <X className="h-4 w-4" />
                  Try Another
                </Button>
                {selectedItem && (
                  <Button variant="gold" className="gap-2" onClick={handleAddToCart}>
                    <ShoppingBag className="h-4 w-4" />
                    Add to Cart - {formatPrice(selectedItem.price)}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
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
                    {isProcessing && (
                      <div className="absolute inset-0 bg-background/90 backdrop-blur-md flex items-center justify-center p-8">
                        <div className="w-full max-w-md">
                          {/* Skeleton preview */}
                          <div className="relative">
                            <Skeleton className="w-full aspect-[3/4] rounded-2xl" />
                            
                            {/* Animated shimmer overlay */}
                            <div className="absolute inset-0 rounded-2xl overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent animate-[shimmer_2s_infinite] -translate-x-full" 
                                   style={{ animation: 'shimmer 2s infinite' }} />
                            </div>
                            
                            {/* Center icon */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mb-4 animate-pulse">
                                <Sparkles className="h-10 w-10 text-gold animate-spin" style={{ animationDuration: '3s' }} />
                              </div>
                              <p className="text-lg font-medium text-foreground">AI is dressing you up...</p>
                              <p className="text-sm text-muted-foreground mt-1">This may take a few seconds</p>
                              
                              {/* Progress dots */}
                              <div className="flex gap-2 mt-4">
                                <div className="w-2 h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '300ms' }} />
                              </div>
                            </div>
                          </div>
                          
                          {/* Selected item preview */}
                          {selectedItem && (
                            <div className="mt-6 flex items-center gap-4 bg-card/50 rounded-lg p-3 border border-border">
                              <Skeleton className="w-12 h-12 rounded-md" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{selectedItem.name}</p>
                                <p className="text-xs text-muted-foreground">Processing virtual try-on</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {selectedItem && !isProcessing && (
                      <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg p-3">
                        <p className="text-sm font-medium">{selectedItem.name}</p>
                        <p className="text-xs text-muted-foreground">Selected for try-on</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="w-24 h-24 rounded-full bg-gold/10 flex items-center justify-center mb-6">
                      <Camera className="h-12 w-12 text-gold" />
                    </div>
                    <h3 className="font-display text-2xl mb-2">AI Virtual Try-On</h3>
                    <p className="text-muted-foreground max-w-sm mb-8">
                      Enable your camera, select an item, and let AI show you wearing it!
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

              <div className="flex items-center gap-4 mt-8">
                {isCameraActive && (
                  <>
                    <Button variant="outline" onClick={stopCamera} className="gap-2">
                      <CameraOff className="h-4 w-4" />
                      Stop Camera
                    </Button>
                    <Button
                      variant="hero"
                      size="lg"
                      onClick={handleTryOn}
                      disabled={!selectedItem || isProcessing}
                      className="gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      Try On with AI
                    </Button>
                  </>
                )}
              </div>
            </>
          )}

          <div className="mt-8 text-center max-w-lg">
            <p className="text-sm text-muted-foreground">
              <Shirt className="h-4 w-4 inline-block mr-2" />
              {resultImage 
                ? "Like what you see? Add it to your cart or try another item!"
                : "Select an item from the sidebar, then click 'Try On with AI' to see yourself wearing it."
              }
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TryOn;
