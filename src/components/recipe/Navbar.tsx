import { useState } from "react";
import { Menu, X, ChefHat, Calendar, Heart, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavbarProps {
  user: { email: string; id: string } | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onViewBookings: () => void;
  onViewFavorites: () => void;
}

export function Navbar({ user, onSignIn, onSignOut, onViewBookings, onViewFavorites }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground group-hover:scale-105 transition-transform">
              <ChefHat className="w-5 h-5" />
            </div>
            <span className="font-serif text-xl font-bold text-foreground">
              Recipe<span className="text-primary">Book</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user && (
              <>
                <button 
                  onClick={onViewBookings}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  My Bookings
                </button>
                <button 
                  onClick={onViewFavorites}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  Favorites
                </button>
              </>
            )}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onSignOut}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                onClick={onSignIn}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          isOpen ? "max-h-64 pb-4" : "max-h-0"
        )}>
          <div className="flex flex-col gap-2 pt-2">
            {user && (
              <>
                <button 
                  onClick={() => { onViewBookings(); setIsOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  My Bookings
                </button>
                <button 
                  onClick={() => { onViewFavorites(); setIsOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  Favorites
                </button>
              </>
            )}
            
            {user ? (
              <Button 
                variant="outline" 
                onClick={() => { onSignOut(); setIsOpen(false); }}
                className="mt-2 gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            ) : (
              <Button 
                onClick={() => { onSignIn(); setIsOpen(false); }}
                className="mt-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
