import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, CameraOff, RefreshCw, Shirt, ShoppingBag, Sparkles, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const clothingItems = [
  {
    id: 1,
    name: "Classic White Tee",
    category: "Tops",
    price: 49,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80",
    description: "classic white t-shirt with a clean minimalist design",
  },
  {
    id: 2,
    name: "Navy Blazer",
    category: "Jackets",
    price: 289,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&q=80",
    description: "professional navy blue blazer jacket",
  },
  {
    id: 3,
    name: "Striped Shirt",
    category: "Tops",
    price: 89,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&q=80",
    description: "blue and white horizontal striped button-up shirt",
  },
  {
    id: 4,
    name: "Cashmere Sweater",
    category: "Knitwear",
    price: 195,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200&q=80",
    description: "soft beige cashmere crewneck sweater",
  },
  {
    id: 5,
    name: "Leather Jacket",
    category: "Jackets",
    price: 425,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&q=80",
    description: "black leather motorcycle jacket",
  },
  {
    id: 6,
    name: "Floral Dress",
    category: "Dresses",
    price: 159,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&q=80",
    description: "elegant red floral pattern dress",
  },
  {
    id: 7,
    name: "Denim Jacket",
    category: "Jackets",
    price: 175,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=200&q=80",
    description: "classic blue denim jacket",
  },
  {
    id: 8,
    name: "Black Hoodie",
    category: "Tops",
    price: 85,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=80",
    description: "comfortable black hoodie sweatshirt with drawstrings",
  },
  {
    id: 9,
    name: "Silk Blouse",
    category: "Tops",
    price: 145,
    image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=200&q=80",
    description: "elegant pink silk blouse",
  },
  {
    id: 10,
    name: "Wool Cardigan",
    category: "Knitwear",
    price: 165,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&q=80",
    description: "cozy brown wool cardigan with buttons",
  },
  {
    id: 11,
    name: "White Hoodie",
    category: "Tops",
    price: 89,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=80",
    description: "clean white hoodie sweatshirt",
  },
  {
    id: 12,
    name: "Polo Shirt",
    category: "Tops",
    price: 69,
    image: "https://images.unsplash.com/photo-1625910513413-5fc40551a299?w=200&q=80",
    description: "classic navy polo shirt with collar",
  },
];

const TryOn = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedItem, setSelectedItem] = useState<typeof clothingItems[0] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
    if (!videoRef.current || !canvasRef.current) return null;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    
    // Flip horizontally to match the mirrored view
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    
    return canvas.toDataURL("image/jpeg", 0.8);
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
          clothingDescription: selectedItem.description,
          clothingImageUrl: selectedItem.image,
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
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to store
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
            Choose clothing to try on with AI
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
          {resultImage ? (
            /* Result view - side by side comparison */
            <div className="w-full max-w-5xl">
              <div className="grid grid-cols-2 gap-8">
                {/* Original */}
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

                {/* With clothing */}
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
                  <Button variant="gold" className="gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Add to Cart - ${selectedItem.price}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            /* Camera view */
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
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mb-4 animate-pulse">
                          <Sparkles className="h-8 w-8 text-gold" />
                        </div>
                        <p className="text-lg font-medium">AI is dressing you up...</p>
                        <p className="text-sm text-muted-foreground">This may take a few seconds</p>
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

              {/* Controls */}
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

          {/* Instructions */}
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