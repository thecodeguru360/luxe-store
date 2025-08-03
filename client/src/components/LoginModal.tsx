import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function LoginModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement authentication logic
    console.log(isRegistering ? 'Register' : 'Login');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isRegistering ? 'Create Account' : 'Sign In'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" type="text" required />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" type="text" required />
              </div>
            </div>
          )}
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          
          {isRegistering && (
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" required />
            </div>
          )}
          
          {!isRegistering ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm">Remember me</Label>
              </div>
              <Button variant="link" className="text-sm p-0">
                Forgot password?
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" required />
              <Label htmlFor="terms" className="text-sm">
                I agree to the Terms of Service and Privacy Policy
              </Label>
            </div>
          )}
          
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            {isRegistering ? 'Create Account' : 'Sign In'}
          </Button>
        </form>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}
            <Button 
              variant="link" 
              className="p-0 ml-1"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? 'Sign in' : 'Sign up'}
            </Button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
