import { useState } from "react";
import { Calendar, Clock, Users, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Recipe {
  id: string;
  title: string;
  image_url: string | null;
  servings: number;
  prep_time: number;
  cook_time: number;
}

interface BookingDialogProps {
  recipe: Recipe | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBook: (data: BookingData) => void;
  isLoading?: boolean;
}

export interface BookingData {
  recipe_id: string;
  scheduled_date: string;
  meal_type: string;
  servings: number;
  notes: string;
}

export function BookingDialog({ recipe, open, onOpenChange, onBook, isLoading }: BookingDialogProps) {
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [mealType, setMealType] = useState("dinner");
  const [servings, setServings] = useState(recipe?.servings || 2);
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipe) return;
    
    onBook({
      recipe_id: recipe.id,
      scheduled_date: date,
      meal_type: mealType,
      servings,
      notes,
    });
  };

  if (!recipe) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border shadow-elevated">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Book Recipe</DialogTitle>
        </DialogHeader>
        
        {/* Recipe preview */}
        <div className="flex gap-4 p-4 rounded-lg bg-muted/50 mb-4">
          <img 
            src={recipe.image_url || '/placeholder.svg'} 
            alt={recipe.title}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h4 className="font-serif font-semibold text-lg">{recipe.title}</h4>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {recipe.prep_time + recipe.cook_time}m
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {recipe.servings} servings
              </span>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Date picker */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">
              <Calendar className="w-4 h-4 inline mr-2" />
              Schedule Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="bg-background"
            />
          </div>
          
          {/* Meal type */}
          <div className="space-y-2">
            <Label htmlFor="meal-type" className="text-sm font-medium">
              Meal Type
            </Label>
            <Select value={mealType} onValueChange={setMealType}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">🌅 Breakfast</SelectItem>
                <SelectItem value="lunch">☀️ Lunch</SelectItem>
                <SelectItem value="dinner">🌙 Dinner</SelectItem>
                <SelectItem value="snack">🍿 Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Servings */}
          <div className="space-y-2">
            <Label htmlFor="servings" className="text-sm font-medium">
              <Users className="w-4 h-4 inline mr-2" />
              Number of Servings
            </Label>
            <Input
              id="servings"
              type="number"
              min={1}
              max={20}
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
              className="bg-background"
            />
          </div>
          
          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Notes (optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Any special preparations or modifications..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-background resize-none"
              rows={3}
            />
          </div>
          
          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
