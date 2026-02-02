import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Favorite {
  id: string;
  user_id: string;
  recipe_id: string;
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

// Get user's favorites
export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          recipes (
            id,
            title,
            image_url,
            prep_time,
            cook_time,
            servings,
            rating,
            cuisine
          )
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data as Favorite[];
    },
  });
}

// Toggle favorite
export function useToggleFavorite() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ recipeId, isFavorite }: { recipeId: string; isFavorite: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in to favorite');
      
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', recipeId);
        
        if (error) throw error;
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            recipe_id: recipeId,
          });
        
        if (error) throw error;
      }
    },
    onSuccess: (_, { isFavorite }) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
