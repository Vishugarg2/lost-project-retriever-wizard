import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trees, Coins } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="max-w-md mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Trees className="h-12 w-12 text-emerald-600" />
            <h1 className="text-4xl font-bold text-emerald-700">EcoSwap</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Shop smarter, live greener
          </p>
        </div>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Transform Your Shopping</CardTitle>
            <CardDescription>
              Get eco-friendly product suggestions and earn rewards for sustainable choices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 text-sm font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-medium">Smart Suggestions</h3>
                  <p className="text-sm text-muted-foreground">
                    Get instant eco-friendly alternatives for your cart items
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Coins className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-medium">Earn Rewards</h3>
                  <p className="text-sm text-muted-foreground">
                    Collect Eco Points and redeem for discounts and donations
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Trees className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-medium">Track Impact</h3>
                  <p className="text-sm text-muted-foreground">
                    See your CO₂ savings and environmental impact in real-time
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="space-y-3">
          <Link to="/signup" className="w-full">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg h-12">
              Start Your Eco Journey
            </Button>
          </Link>
          <Link to="/login" className="w-full">
            <Button variant="outline" className="w-full">
              Already have an account? Sign In
            </Button>
          </Link>
        </div>

        {/* Community Stats */}
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="font-bold text-emerald-700">Community Impact</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-2xl font-bold text-emerald-600">127k</div>
                  <p className="text-emerald-700">Eco Swaps Made</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-600">89k kg</div>
                  <p className="text-emerald-700">CO₂ Saved</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
