import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
}

export function HeroSection({ searchQuery, onSearchChange, onSearch }: HeroSectionProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-herb-light">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container relative mx-auto px-4 py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-herb-light text-herb text-sm font-medium mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-herb rounded-full animate-pulse" />
            Plan your meals with ease
          </div>
          
          {/* Heading */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Book Your Perfect
            <span className="text-gradient block mt-2">Recipe Experience</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Discover delicious recipes, schedule your meals, and create a personalized cooking journey that fits your lifestyle.
          </p>
          
          {/* Search bar */}
          <form 
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search recipes, cuisines, ingredients..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-12 h-14 text-base bg-card border-border shadow-soft focus:shadow-elevated transition-shadow"
              />
            </div>
            <Button 
              type="submit" 
              size="lg" 
              className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft hover:shadow-elevated transition-all"
            >
              Search
            </Button>
          </form>
          
          {/* Quick tags */}
          <div className="flex flex-wrap justify-center gap-2 mt-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <span className="text-sm text-muted-foreground">Popular:</span>
            {['Italian', 'Thai', 'Mexican', 'Quick & Easy'].map((tag) => (
              <button
                key={tag}
                onClick={() => onSearchChange(tag)}
                className="text-sm px-3 py-1 rounded-full bg-card text-foreground hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
