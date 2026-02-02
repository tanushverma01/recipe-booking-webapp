import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string, fullName: string) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export function AuthDialog({ open, onOpenChange, onSignIn, onSignUp, isLoading, error }: AuthDialogProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signin') {
      await onSignIn(email, password);
    } else {
      await onSignUp(email, password, fullName);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
  };

  return (
    <Dialog open={open} onOpenChange={(open) => { onOpenChange(open); if (!open) resetForm(); }}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-elevated">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-center">
            {mode === 'signin' ? 'Welcome Back!' : 'Create Account'}
          </DialogTitle>
        </DialogHeader>

        {/* Mode tabs */}
        <div className="flex rounded-lg bg-muted p-1 mb-6">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-md transition-all",
              mode === 'signin' 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-md transition-all",
              mode === 'signup' 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Sign Up
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full name (signup only) */}
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10 bg-background"
                  required={mode === 'signup'}
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-background"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 bg-background"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isLoading}
          >
            {isLoading 
              ? (mode === 'signin' ? 'Signing in...' : 'Creating account...') 
              : (mode === 'signin' ? 'Sign In' : 'Create Account')
            }
          </Button>
        </form>

        {/* Additional info */}
        {mode === 'signup' && (
          <p className="text-xs text-center text-muted-foreground mt-4">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
