import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Camera, ShoppingBag, User } from "lucide-react";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6">
        <nav className="flex items-center justify-between h-16">
          <Link to="/" className="font-display text-2xl tracking-wider text-foreground hover:text-primary transition-colors">
            LUXE
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/collection" className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors">
              Collection
            </Link>
            <Link to="/try-on" className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Virtual Try-On
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <ShoppingBag className="h-5 w-5" />
            </Button>
            <Link to="/auth">
              <Button variant="outline-gold" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;