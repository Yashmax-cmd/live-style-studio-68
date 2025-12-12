import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Camera, ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />

      <div className="container relative z-10 px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Experience Fashion Like Never Before
          </p>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-tight mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Discover Your
            <span className="block text-gradient-gold">Perfect Style</span>
          </h1>
          
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            Try before you buy with our revolutionary virtual try-on technology. 
            See how clothes look on you in real-time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <Link to="/try-on">
              <Button variant="hero" size="xl" className="gap-3">
                <Camera className="h-5 w-5" />
                Try On Live
              </Button>
            </Link>
            <Link to="/collection">
              <Button variant="outline" size="xl" className="gap-3">
                View Collection
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-px h-16 bg-gradient-to-b from-gold to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default Hero;