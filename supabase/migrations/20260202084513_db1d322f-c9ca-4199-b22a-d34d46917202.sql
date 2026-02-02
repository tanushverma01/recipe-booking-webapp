-- Fix search_path for all functions to prevent security issues
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.update_recipe_rating() SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;