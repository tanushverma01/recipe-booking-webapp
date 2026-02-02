import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Recipe {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: string;
  cuisine: string | null;
  ingredients: any;
  instructions: any;
  calories: number | null;
  rating: number | null;
  rating_count: number | null;
  is_popular: boolean | null;
  created_at: string;
}

// Get all recipes
export function useRecipes(searchQuery?: string) {
  return useQuery({
    queryKey: ['recipes', searchQuery],
    queryFn: async () => {
      let query = supabase.from('recipes').select('*').order('created_at', { ascending: false });
      
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,cuisine.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Recipe[];
    },
  });
}

// Get popular recipes
export function usePopularRecipes() {
  return useQuery({
    queryKey: ['recipes', 'popular'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_popular', true)
        .order('rating', { ascending: false })
        .limit(4);
      
      if (error) throw error;
      return data as Recipe[];
    },
  });
}

// Get recipe by ID
export function useRecipe(id: string) {
  return useQuery({
    queryKey: ['recipes', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Recipe | null;
    },
    enabled: !!id,
  });
}

// Rate a recipe
export function useRateRecipe() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ recipeId, rating, review }: { recipeId: string; rating: number; review?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in to rate');
      
      const { error } = await supabase
        .from('ratings')
        .upsert({
          user_id: user.id,
          recipe_id: recipeId,
          rating,
          review,
        }, { onConflict: 'user_id,recipe_id' });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      toast.success('Rating submitted!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
