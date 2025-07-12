import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Trees } from "lucide-react";
import { signUp } from "@/lib/supabase";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const { data, error } = await signUp(email, password, name);
      
      if (error) {
        // Fallback to mock authentication for demo
        console.log('Supabase signup failed, using mock auth:', error);
        
        const userData = {
          name,
          email,
          ecoPoints: 50, // Welcome bonus!
          level: "Eco Beginner",
          co2Saved: 0,
          joinDate: new Date().toISOString()
        };
        
        localStorage.setItem("ecoswap_user", JSON.stringify(userData));
      }
      
      // Welcome celebration sequence
      toast.success("🎉 Welcome to EcoSwap! Your green journey starts now!", {
        duration: 5000,
        description: "🌱 Together, we'll make shopping sustainable and fun!"
      });
      
      setTimeout(() => {
        toast.info("🏆 Achievement Unlocked: Eco Newcomer!", {
          duration: 4000,
          description: "🎯 You've earned your first badge for joining the community!"
        });
      }, 2000);
      
      setTimeout(() => {
        toast.info("📱 Pro Tip: Use our barcode scanner to find eco-alternatives!", {
          duration: 4000,
          description: "🔍 Point your camera at any product to get started!"
        });
      }, 4000);
      
      navigate("/onboarding");
    } catch (error) {
      console.error('Signup error:', error);
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trees className="h-8 w-8 text-emerald-600" />
            <h1 className="text-2xl font-bold text-emerald-700">EcoSwap</h1>
          </div>
          <CardTitle>Join the Green Revolution</CardTitle>
          <CardDescription>Create your account and start saving the planet</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
              Create Account
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-emerald-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;