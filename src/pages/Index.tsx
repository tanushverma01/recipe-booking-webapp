import { useState, useMemo } from "react";
import { Flame, Star, ChefHat } from "lucide-react";
import { Navbar } from "@/components/recipe/Navbar";
import { HeroSection } from "@/components/recipe/HeroSection";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { BookingDialog, BookingData } from "@/components/recipe/BookingDialog";
import { BookingsSheet } from "@/components/recipe/BookingsSheet";
import { FavoritesSheet } from "@/components/recipe/FavoritesSheet";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useAuth } from "@/hooks/useAuth";
import { useRecipes, usePopularRecipes, Recipe } from "@/hooks/useRecipes";
import { useBookings, useCreateBooking, useCancelBooking, useCompleteBooking } from "@/hooks/useBookings";
import { useFavorites, useToggleFavorite } from "@/hooks/useFavorites";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showBookingsSheet, setShowBookingsSheet] = useState(false);
  const [showFavoritesSheet, setShowFavoritesSheet] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Auth
  const { user, signIn, signUp, signOut, loading: authLoading } = useAuth();

  // Data
  const { data: recipes = [], isLoading: recipesLoading } = useRecipes(activeSearch);
  const { data: popularRecipes = [] } = usePopularRecipes();
  const { data: bookings = [] } = useBookings();
  const { data: favorites = [] } = useFavorites();

  // Mutations
  const createBooking = useCreateBooking();
  const cancelBooking = useCancelBooking();
  const completeBooking = useCompleteBooking();
  const toggleFavorite = useToggleFavorite();

  // Derived state
  const favoriteRecipeIds = useMemo(() => 
    new Set(favorites.map(f => f.recipe_id)), 
    [favorites]
  );

  // Handlers
  const handleSearch = () => {
    setActiveSearch(searchQuery);
  };

  const handleBookRecipe = (recipe: Recipe) => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    setSelectedRecipe(recipe);
    setShowBookingDialog(true);
  };

  const handleConfirmBooking = (data: BookingData) => {
    createBooking.mutate(data, {
      onSuccess: () => {
        setShowBookingDialog(false);
        setSelectedRecipe(null);
      },
    });
  };

  const handleToggleFavorite = (recipeId: string) => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    const isFavorite = favoriteRecipeIds.has(recipeId);
    toggleFavorite.mutate({ recipeId, isFavorite });
  };

  const handleSignIn = async (email: string, password: string) => {
    setAuthError(null);
    try {
      await signIn(email, password);
      setShowAuthDialog(false);
    } catch (error: any) {
      setAuthError(error.message);
    }
  };

  const handleSignUp = async (email: string, password: string, fullName: string) => {
    setAuthError(null);
    try {
      await signUp(email, password, fullName);
      setShowAuthDialog(false);
    } catch (error: any) {
      setAuthError(error.message);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleOpenBookRecipeFromFavorites = (recipe: any) => {
    setShowFavoritesSheet(false);
    setSelectedRecipe(recipe);
    setShowBookingDialog(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar
        user={user ? { email: user.email || '', id: user.id } : null}
        onSignIn={() => setShowAuthDialog(true)}
        onSignOut={handleSignOut}
        onViewBookings={() => setShowBookingsSheet(true)}
        onViewFavorites={() => setShowFavoritesSheet(true)}
      />

      {/* Hero Section */}
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Popular Recipes Section */}
        {!activeSearch && popularRecipes.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-accent/20">
                <Flame className="w-5 h-5 text-accent" />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold">
                Popular This Week
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularRecipes.map((recipe, index) => (
                <div 
                  key={recipe.id} 
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <RecipeCard
                    recipe={recipe}
                    isFavorite={favoriteRecipeIds.has(recipe.id)}
                    onFavorite={handleToggleFavorite}
                    onBook={handleBookRecipe}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Recipes Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-herb-light">
              <ChefHat className="w-5 h-5 text-herb" />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold">
              {activeSearch ? `Results for "${activeSearch}"` : 'All Recipes'}
            </h2>
            {activeSearch && (
              <button 
                onClick={() => { setActiveSearch(''); setSearchQuery(''); }}
                className="ml-auto text-sm text-primary hover:underline"
              >
                Clear search
              </button>
            )}
          </div>

          {recipesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-muted rounded-xl mb-4" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-16">
              <ChefHat className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-serif text-xl font-semibold mb-2">No recipes found</h3>
              <p className="text-muted-foreground">
                Try a different search term or browse our popular recipes.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe, index) => (
                <div 
                  key={recipe.id} 
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <RecipeCard
                    recipe={recipe}
                    isFavorite={favoriteRecipeIds.has(recipe.id)}
                    onFavorite={handleToggleFavorite}
                    onBook={handleBookRecipe}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-primary" />
              <span className="font-serif font-semibold">RecipeBook</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 RecipeBook. Plan your meals with love.
            </p>
          </div>
        </div>
      </footer>

      {/* Dialogs & Sheets */}
      <BookingDialog
        recipe={selectedRecipe}
        open={showBookingDialog}
        onOpenChange={setShowBookingDialog}
        onBook={handleConfirmBooking}
        isLoading={createBooking.isPending}
      />

      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        isLoading={authLoading}
        error={authError}
      />

      <BookingsSheet
        open={showBookingsSheet}
        onOpenChange={setShowBookingsSheet}
        bookings={bookings}
        onCancel={(id) => cancelBooking.mutate(id)}
        onComplete={(id) => completeBooking.mutate(id)}
      />

      <FavoritesSheet
        open={showFavoritesSheet}
        onOpenChange={setShowFavoritesSheet}
        favorites={favorites}
        onRemove={(recipeId) => toggleFavorite.mutate({ recipeId, isFavorite: true })}
        onBookRecipe={handleOpenBookRecipeFromFavorites}
      />
    </div>
  );
};

export default Index;
