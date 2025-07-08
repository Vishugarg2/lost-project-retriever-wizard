import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trees, Coins } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  ecoScore: number;
  co2Footprint: number;
  image: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("ecoswap_user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));

    // Load mock cart data
    const mockCart = [
      {
        id: "1",
        name: "Regular Potato Chips",
        price: 3.99,
        ecoScore: 35,
        co2Footprint: 2.4,
        image: "🥔"
      }
    ];
    setCart(mockCart);
  }, [navigate]);

  const handleSwapProduct = () => {
    navigate("/compare");
  };

  const handleViewWallet = () => {
    navigate("/wallet");
  };

  const handleRecycle = () => {
    navigate("/recycle");
  };

  if (!user) return null;

  const monthlyGoal = 50; // kg CO2
  const progressPercent = (user.co2Saved / monthlyGoal) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trees className="h-6 w-6 text-emerald-600" />
              <span className="font-bold text-emerald-700">EcoSwap</span>
            </div>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
              {user.level}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Hello, {user.name}! 👋</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-emerald-600">
                  <Coins className="h-4 w-4" />
                  <span className="font-bold text-lg">{user.ecoPoints}</span>
                </div>
                <p className="text-xs text-muted-foreground">Eco Points</p>
              </div>
              <div className="text-center">
                <div className="text-emerald-600 font-bold text-lg">{user.co2Saved}kg</div>
                <p className="text-xs text-muted-foreground">CO₂ Saved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Impact Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>{user.co2Saved}kg saved</span>
                <span>{monthlyGoal}kg goal</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
              <p className="text-xs text-muted-foreground">
                You're {progressPercent < 100 ? Math.round(monthlyGoal - user.co2Saved) : 0}kg away from your goal!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Current Cart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Shopping Cart</CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length > 0 ? (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.image}</span>
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Eco Score: {item.ecoScore}/100 | ${item.price}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" onClick={handleSwapProduct} className="bg-emerald-600 hover:bg-emerald-700">
                      Swap
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Your cart is empty. Start shopping to see eco-friendly suggestions!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Community Impact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Community Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-emerald-600">17,245kg</div>
              <p className="text-sm text-muted-foreground">CO₂ saved by our community this week</p>
              <div className="flex justify-center">
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                  🌱 Growing stronger together
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={handleViewWallet} variant="outline" className="h-16 flex-col gap-1">
            <Coins className="h-5 w-5" />
            <span className="text-sm">Eco Wallet</span>
          </Button>
          <Button onClick={handleRecycle} variant="outline" className="h-16 flex-col gap-1">
            <Trees className="h-5 w-5" />
            <span className="text-sm">Recycle</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;