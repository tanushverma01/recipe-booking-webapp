import { Heart, Clock, Users, Star, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface Favorite {
  id: string;
  recipes: {
    id: string;
    title: string;
    image_url: string | null;
    prep_time: number;
    cook_time: number;
    servings: number;
    rating: number | null;
    cuisine: string | null;
  } | null;
}

interface FavoritesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  favorites: Favorite[];
  onRemove: (recipeId: string) => void;
  onBookRecipe: (recipe: any) => void;
}

export function FavoritesSheet({ open, onOpenChange, favorites, onRemove, onBookRecipe }: FavoritesSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md bg-card overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary fill-primary" />
            My Favorites
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No favorites yet.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Click the heart icon on recipes to save them here!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {favorites.map((favorite) => (
                <div 
                  key={favorite.id}
                  className="p-4 rounded-xl bg-muted/50 border border-border"
                >
                  <div className="flex gap-3">
                    <img 
                      src={favorite.recipes?.image_url || '/placeholder.svg'} 
                      alt={favorite.recipes?.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      {favorite.recipes?.cuisine && (
                        <span className="text-xs font-medium text-herb uppercase">
                          {favorite.recipes.cuisine}
                        </span>
                      )}
                      <h4 className="font-serif font-semibold truncate">
                        {favorite.recipes?.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {(favorite.recipes?.prep_time || 0) + (favorite.recipes?.cook_time || 0)}m
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {favorite.recipes?.servings}
                        </span>
                        {favorite.recipes?.rating && favorite.recipes.rating > 0 && (
                          <span className="flex items-center gap-1 text-accent">
                            <Star className="w-3 h-3 fill-current" />
                            {Number(favorite.recipes.rating).toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      className="flex-1 bg-primary hover:bg-primary/90"
                      onClick={() => onBookRecipe(favorite.recipes)}
                    >
                      Book Recipe
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => onRemove(favorite.recipes?.id || '')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
