import { Calendar, Clock, Users, Trash2, Check, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Booking {
  id: string;
  scheduled_date: string;
  meal_type: string;
  servings: number;
  notes: string | null;
  status: string;
  recipes: {
    id: string;
    title: string;
    image_url: string | null;
    prep_time: number;
    cook_time: number;
  } | null;
}

interface BookingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookings: Booking[];
  onCancel: (id: string) => void;
  onComplete: (id: string) => void;
  isLoading?: boolean;
}

const mealTypeEmoji: Record<string, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍿',
};

export function BookingsSheet({ open, onOpenChange, bookings, onCancel, onComplete, isLoading }: BookingsSheetProps) {
  const scheduledBookings = bookings.filter(b => b.status === 'scheduled');
  const completedBookings = bookings.filter(b => b.status === 'completed');

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md bg-card overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            My Bookings
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Scheduled */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Upcoming ({scheduledBookings.length})
            </h3>
            
            {scheduledBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No upcoming bookings. Start booking some delicious recipes!
              </p>
            ) : (
              <div className="space-y-3">
                {scheduledBookings.map((booking) => (
                  <div 
                    key={booking.id}
                    className="p-4 rounded-xl bg-muted/50 border border-border"
                  >
                    <div className="flex gap-3">
                      <img 
                        src={booking.recipes?.image_url || '/placeholder.svg'} 
                        alt={booking.recipes?.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-semibold truncate">
                          {booking.recipes?.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <span>{formatDate(booking.scheduled_date)}</span>
                          <span>•</span>
                          <span>{mealTypeEmoji[booking.meal_type]} {booking.meal_type}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Users className="w-3 h-3" />
                          <span>{booking.servings} servings</span>
                        </div>
                      </div>
                    </div>
                    
                    {booking.notes && (
                      <p className="text-xs text-muted-foreground mt-2 p-2 bg-background rounded">
                        {booking.notes}
                      </p>
                    )}
                    
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-herb hover:bg-herb hover:text-primary-foreground"
                        onClick={() => onComplete(booking.id)}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Done
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => onCancel(booking.id)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed */}
          {completedBookings.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Completed ({completedBookings.length})
              </h3>
              
              <div className="space-y-2">
                {completedBookings.slice(0, 5).map((booking) => (
                  <div 
                    key={booking.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-herb-light/50 opacity-70"
                  >
                    <img 
                      src={booking.recipes?.image_url || '/placeholder.svg'} 
                      alt={booking.recipes?.title}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{booking.recipes?.title}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(booking.scheduled_date)}</p>
                    </div>
                    <Badge variant="secondary" className="bg-herb-light text-herb text-xs">
                      <Check className="w-3 h-3 mr-1" />
                      Done
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
