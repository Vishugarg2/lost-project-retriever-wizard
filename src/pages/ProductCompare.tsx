import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Trees, Coins } from "lucide-react";
import { toast } from "sonner";

const ProductCompare = () => {
  const navigate = useNavigate();
  const [swapped, setSwapped] = useState(false);

  const originalProduct = {
    id: "1",
    name: "Regular Potato Chips",
    brand: "ChipsyCo",
    price: 3.99,
    ecoScore: 35,
    co2Footprint: 2.4,
    packaging: "Plastic bag",
    origin: "Mexico (2,100 miles)",
    image: "🥔"
  };

  const ecoProduct = {
    id: "2",
    name: "Organic Sweet Potato Chips",
    brand: "GreenBites",
    price: 4.49,
    ecoScore: 89,
    co2Footprint: 0.8,
    packaging: "Compostable paper",
    origin: "Local farm (45 miles)",
    image: "🍠"
  };

  const handleSwap = () => {
    setSwapped(true);
    
    // Update user data
    const userData = JSON.parse(localStorage.getItem("ecoswap_user") || "{}");
    const pointsEarned = 15;
    const co2Saved = originalProduct.co2Footprint - ecoProduct.co2Footprint;
    
    userData.ecoPoints = (userData.ecoPoints || 0) + pointsEarned;
    userData.co2Saved = (userData.co2Saved || 0) + co2Saved;
    
    localStorage.setItem("ecoswap_user", JSON.stringify(userData));
    
    toast.success(`🎉 You've saved ${co2Saved.toFixed(1)} kg CO₂ and earned ${pointsEarned} Eco Points!`);
    
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "bg-emerald-100 text-emerald-700";
    if (score >= 60) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  if (swapped) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 space-y-4">
            <div className="text-6xl">🎉</div>
            <h2 className="text-2xl font-bold text-emerald-700">Great Choice!</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-emerald-600">
                <Trees className="h-5 w-5" />
                <span className="font-medium">1.6 kg CO₂ saved</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-emerald-600">
                <Coins className="h-5 w-5" />
                <span className="font-medium">15 Eco Points earned</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              You're making a difference for our planet! 🌍
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="font-bold text-lg">Product Comparison</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Alert Banner */}
        <div className="bg-orange-100 border border-orange-200 rounded-lg p-4">
          <p className="text-sm font-medium text-orange-800">
            💡 We found a greener alternative for you!
          </p>
        </div>

        {/* Product Comparison */}
        <div className="space-y-4">
          {/* Original Product */}
          <Card className="border-2 border-red-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Current Choice</CardTitle>
                <Badge className={getScoreBadgeColor(originalProduct.ecoScore)}>
                  {originalProduct.ecoScore}/100
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{originalProduct.image}</span>
                <div className="flex-1">
                  <h3 className="font-medium">{originalProduct.name}</h3>
                  <p className="text-sm text-muted-foreground">{originalProduct.brand}</p>
                  <p className="font-bold text-lg">${originalProduct.price}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="font-medium">CO₂ Footprint</p>
                  <p className="text-red-600">{originalProduct.co2Footprint} kg</p>
                </div>
                <div>
                  <p className="font-medium">Packaging</p>
                  <p className="text-muted-foreground">{originalProduct.packaging}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium">Origin</p>
                  <p className="text-muted-foreground">{originalProduct.origin}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* VS Indicator */}
          <div className="flex justify-center">
            <div className="bg-white rounded-full p-2 shadow-sm">
              <ArrowRight className="h-6 w-6 text-emerald-600" />
            </div>
          </div>

          {/* Eco Alternative */}
          <Card className="border-2 border-emerald-200 bg-emerald-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-emerald-700">Eco Alternative</CardTitle>
                <Badge className={getScoreBadgeColor(ecoProduct.ecoScore)}>
                  {ecoProduct.ecoScore}/100
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{ecoProduct.image}</span>
                <div className="flex-1">
                  <h3 className="font-medium">{ecoProduct.name}</h3>
                  <p className="text-sm text-muted-foreground">{ecoProduct.brand}</p>
                  <p className="font-bold text-lg">${ecoProduct.price}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="font-medium">CO₂ Footprint</p>
                  <p className="text-emerald-600">{ecoProduct.co2Footprint} kg</p>
                </div>
                <div>
                  <p className="font-medium">Packaging</p>
                  <p className="text-muted-foreground">{ecoProduct.packaging}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium">Origin</p>
                  <p className="text-muted-foreground">{ecoProduct.origin}</p>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-white rounded-lg p-3 space-y-2">
                <p className="font-medium text-sm text-emerald-700">Benefits of switching:</p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <Trees className="h-3 w-3 text-emerald-600" />
                    <span>Save {(originalProduct.co2Footprint - ecoProduct.co2Footprint).toFixed(1)} kg CO₂</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Coins className="h-3 w-3 text-emerald-600" />
                    <span>Earn 15 Eco Points</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600">🌱</span>
                    <span>Support local farming</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button onClick={handleSwap} className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg h-12">
            Swap to Eco Alternative
          </Button>
          <Button variant="outline" onClick={() => navigate("/dashboard")} className="w-full">
            Keep Original Choice
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCompare;