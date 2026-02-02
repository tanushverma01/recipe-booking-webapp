-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recipes table (public recipes)
CREATE TABLE public.recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  prep_time INTEGER NOT NULL DEFAULT 15,
  cook_time INTEGER NOT NULL DEFAULT 30,
  servings INTEGER NOT NULL DEFAULT 4,
  difficulty TEXT NOT NULL DEFAULT 'Easy' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  cuisine TEXT,
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
  calories INTEGER,
  rating DECIMAL(2,1) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table for scheduled recipes
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  meal_type TEXT NOT NULL DEFAULT 'dinner' CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  servings INTEGER NOT NULL DEFAULT 2,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, recipe_id, scheduled_date, meal_type)
);

-- Create favorites table
CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, recipe_id)
);

-- Create ratings table
CREATE TABLE public.ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, recipe_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Recipes policies (public read, admin write - for now all can read)
CREATE POLICY "Anyone can view recipes" ON public.recipes FOR SELECT USING (true);

-- Bookings policies (user-specific)
CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own bookings" ON public.bookings FOR DELETE USING (auth.uid() = user_id);

-- Favorites policies (user-specific)
CREATE POLICY "Users can view their own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- Ratings policies
CREATE POLICY "Anyone can view ratings" ON public.ratings FOR SELECT USING (true);
CREATE POLICY "Users can add ratings" ON public.ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their ratings" ON public.ratings FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON public.recipes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ratings_updated_at BEFORE UPDATE ON public.ratings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update recipe rating when a new rating is added
CREATE OR REPLACE FUNCTION public.update_recipe_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.recipes
  SET 
    rating = (SELECT AVG(rating) FROM public.ratings WHERE recipe_id = NEW.recipe_id),
    rating_count = (SELECT COUNT(*) FROM public.ratings WHERE recipe_id = NEW.recipe_id)
  WHERE id = NEW.recipe_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_recipe_rating_on_insert AFTER INSERT ON public.ratings FOR EACH ROW EXECUTE FUNCTION public.update_recipe_rating();
CREATE TRIGGER update_recipe_rating_on_update AFTER UPDATE ON public.ratings FOR EACH ROW EXECUTE FUNCTION public.update_recipe_rating();

-- Create function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();