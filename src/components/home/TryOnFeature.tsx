import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Camera, Sparkles, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Real-Time Preview",
    description: "See how clothes look on you instantly through your camera",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Fitting",
    description: "Our AI ensures accurate sizing and natural appearance",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "No delays, no waiting - instant virtual try-on experience",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your camera feed is never recorded or stored",
  },
];

const TryOnFeature = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />
      
      <div className="container relative z-10 px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Revolutionary Technology</p>
            <h2 className="font-display text-4xl md:text-5xl mb-6">
              Virtual Try-On
              <span className="text-gradient-gold block">Experience</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-lg">
              Our cutting-edge virtual try-on technology lets you see exactly how 
              our clothes will look on you before making a purchase. Simply enable 
              your camera and start trying on!
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/try-on">
              <Button variant="hero" size="xl" className="gap-3">
                <Camera className="h-5 w-5" />
                Start Virtual Try-On
              </Button>
            </Link>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-gold/20 via-secondary to-gold/10 p-1">
              <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center overflow-hidden">
                <div className="text-center p-8">
                  <div className="w-32 h-32 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                    <Camera className="h-16 w-16 text-gold" />
                  </div>
                  <p className="text-xl font-display mb-2">Try It Now</p>
                  <p className="text-muted-foreground text-sm">Click to enable camera</p>
                </div>
              </div>
            </div>
            
            {/* Floating decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gold/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gold/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TryOnFeature;