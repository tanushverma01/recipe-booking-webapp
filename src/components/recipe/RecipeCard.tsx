import { Heart, Clock, Users, Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Recipe {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: string;
  cuisine: string | null;
  rating: number | null;
  rating_count: number | null;
  is_popular: boolean | null;
}

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite?: boolean;
  onFavorite?: (id: string) => void;
  onBook?: (recipe: Recipe) => void;
  className?: string;
}

export function RecipeCard({ recipe, isFavorite, onFavorite, onBook, className }: RecipeCardProps) {
  const totalTime = recipe.prep_time + recipe.cook_time;
  
  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-xl bg-card shadow-soft transition-all duration-300 hover:shadow-elevated hover:-translate-y-1",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={recipe.image_url || '/placeholder.svg'} 
          alt={recipe.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Popular badge */}
        {recipe.is_popular && (
          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground border-0 font-medium">
            🔥 Popular
          </Badge>
        )}
        
        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite?.(recipe.id);
          }}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200",
            isFavorite 
              ? "bg-primary text-primary-foreground" 
              : "bg-background/80 text-foreground hover:bg-primary hover:text-primary-foreground"
          )}
        >
          <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
        </button>
        
        {/* Quick book button - appears on hover */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Button 
            onClick={() => onBook?.(recipe)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book Recipe
          </Button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Cuisine tag */}
        {recipe.cuisine && (
          <span className="text-xs font-medium text-herb uppercase tracking-wider">
            {recipe.cuisine}
          </span>
        )}
        
        {/* Title */}
        <h3 className="font-serif text-lg font-semibold text-foreground mt-1 mb-2 line-clamp-1">
          {recipe.title}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {recipe.description}
        </p>
        
        {/* Meta info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {totalTime}m
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {recipe.servings}
            </span>
          </div>
          
          {/* Rating */}
          {recipe.rating && recipe.rating > 0 && (
            <span className="flex items-center gap-1 text-accent">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-medium">{Number(recipe.rating).toFixed(1)}</span>
              <span className="text-muted-foreground">({recipe.rating_count})</span>
            </span>
          )}
        </div>
        
        {/* Difficulty badge */}
        <div className="mt-3 pt-3 border-t border-border">
          <Badge 
            variant="secondary" 
            className={cn(
              "text-xs",
              recipe.difficulty === 'Easy' && "bg-herb-light text-herb",
              recipe.difficulty === 'Medium' && "bg-accent/20 text-spice",
              recipe.difficulty === 'Hard' && "bg-destructive/10 text-destructive"
            )}
          >
            {recipe.difficulty}
          </Badge>
        </div>
      </div>
    </div>
  );
}
