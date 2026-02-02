import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Booking {
  id: string;
  user_id: string;
  recipe_id: string;
  scheduled_date: string;
  meal_type: string;
  servings: number;
  notes: string | null;
  status: string;
  created_at: string;
  recipes: {
    id: string;
    title: string;
    image_url: string | null;
    prep_time: number;
    cook_time: number;
  } | null;
}

// Get user's bookings
export function useBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          recipes (
            id,
            title,
            image_url,
            prep_time,
            cook_time
          )
        `)
        .eq('user_id', user.id)
        .order('scheduled_date', { ascending: true });
      
      if (error) throw error;
      return data as Booking[];
    },
  });
}

// Create booking
export function useCreateBooking() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (booking: {
      recipe_id: string;
      scheduled_date: string;
      meal_type: string;
      servings: number;
      notes?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in to book');
      
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          ...booking,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Recipe booked successfully!');
    },
    onError: (error: Error) => {
      if (error.message.includes('duplicate')) {
        toast.error('You already have this recipe booked for this time!');
      } else {
        toast.error(error.message);
      }
    },
  });
}

// Cancel booking
export function useCancelBooking() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking cancelled');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Complete booking
export function useCompleteBooking() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'completed' })
        .eq('id', bookingId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Recipe marked as completed!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
