import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-16">
      <div className="container px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link to="/" className="font-display text-3xl tracking-wider text-foreground mb-4 block">
              LUXE
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6">
              Experience fashion like never before with our revolutionary virtual try-on technology. 
              Shop with confidence, knowing exactly how you'll look.
            </p>
            <p className="text-sm text-muted-foreground">
              © 2024 LUXE. All rights reserved.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/collection" className="text-muted-foreground hover:text-foreground transition-colors">
                  Collection
                </Link>
              </li>
              <li>
                <Link to="/try-on" className="text-muted-foreground hover:text-foreground transition-colors">
                  Virtual Try-On
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-muted-foreground hover:text-foreground transition-colors">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  Contact Us
                </span>
              </li>
              <li>
                <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  Size Guide
                </span>
              </li>
              <li>
                <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  Shipping Info
                </span>
              </li>
              <li>
                <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  Returns Policy
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;