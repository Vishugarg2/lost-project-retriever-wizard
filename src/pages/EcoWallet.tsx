import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Coins, Gift, Trees } from "lucide-react";
import { toast } from "sonner";

const EcoWallet = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("ecoswap_user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const rewards = [
    {
      id: "1",
      title: "$5 Off Next Purchase",
      cost: 100,
      type: "discount",
      description: "Save $5 on your next shopping trip",
      icon: "💰"
    },
    {
      id: "2",
      title: "Plant a Tree",
      cost: 150,
      type: "environmental",
      description: "Plant a tree in your name through our partner",
      icon: "🌳"
    },
    {
      id: "3",
      title: "$10 Walmart Gift Card",
      cost: 200,
      type: "giftcard",
      description: "Digital gift card for Walmart",
      icon: "🎁"
    },
    {
      id: "4",
      title: "Donate to Ocean Cleanup",
      cost: 75,
      type: "donation",
      description: "Support ocean conservation efforts",
      icon: "🌊"
    }
  ];

  const recentActivity = [
    { date: "Today", action: "Swapped to eco chips", points: 15 },
    { date: "Yesterday", action: "Used reusable bag", points: 5 },
    { date: "2 days ago", action: "Chose local produce", points: 12 },
    { date: "3 days ago", action: "Recycled packaging", points: 8 }
  ];

  const handleRedeem = (reward: any) => {
    if (!user || user.ecoPoints < reward.cost) {
      toast.error("Not enough Eco Points!");
      return;
    }

    const updatedUser = {
      ...user,
      ecoPoints: user.ecoPoints - reward.cost
    };
    
    localStorage.setItem("ecoswap_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    toast.success(`🎉 ${reward.title} redeemed successfully!`);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="font-bold text-lg">Eco Wallet</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Points Balance */}
        <Card className="bg-gradient-to-r from-emerald-500 to-green-600 text-white">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Coins className="h-8 w-8" />
                <span className="text-3xl font-bold">{user.ecoPoints}</span>
              </div>
              <p className="text-emerald-100">Eco Points Available</p>
              <Badge variant="secondary" className="bg-white/20 text-white">
                Level: {user.level}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Redeem Rewards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Redeem Rewards
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {rewards.map((reward) => (
              <div key={reward.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{reward.icon}</span>
                  <div>
                    <h3 className="font-medium text-sm">{reward.title}</h3>
                    <p className="text-xs text-muted-foreground">{reward.description}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Coins className="h-3 w-3 text-emerald-600" />
                      <span className="text-xs font-medium">{reward.cost} points</span>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleRedeem(reward)}
                  disabled={user.ecoPoints < reward.cost}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Redeem
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600">
                    <span className="text-sm font-medium">+{activity.points}</span>
                    <Coins className="h-3 w-3" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Impact Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-emerald-600">{user.co2Saved}kg</div>
                <p className="text-xs text-muted-foreground">CO₂ Saved</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">12</div>
                <p className="text-xs text-muted-foreground">Eco Swaps Made</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
              <p className="text-sm text-emerald-700 text-center">
                🌍 That's equivalent to taking a car off the road for {Math.round(user.co2Saved * 2.3)} miles!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EcoWallet;