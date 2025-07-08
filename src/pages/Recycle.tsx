import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, QrCode, MapPin, Trees, Coins } from "lucide-react";
import { toast } from "sonner";

const Recycle = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState("");

  const recycleCategories = [
    {
      id: "plastic",
      name: "Plastic Containers",
      icon: "🥤",
      points: 5,
      description: "Water bottles, food containers, etc."
    },
    {
      id: "paper",
      name: "Paper Products",
      icon: "📄",
      points: 3,
      description: "Cardboard, newspapers, magazines"
    },
    {
      id: "glass",
      name: "Glass Bottles",
      icon: "🍾",
      points: 8,
      description: "Glass jars, bottles, containers"
    },
    {
      id: "electronics",
      name: "Electronics",
      icon: "📱",
      points: 25,
      description: "Phones, batteries, small appliances"
    },
    {
      id: "clothing",
      name: "Textiles",
      icon: "👕",
      points: 15,
      description: "Old clothes, shoes, fabric items"
    }
  ];

  const nearbyLocations = [
    {
      name: "Walmart Recycling Center",
      address: "123 Main St, 0.5 miles",
      accepts: ["plastic", "paper", "electronics"],
      hours: "8AM - 8PM"
    },
    {
      name: "EcoRecycle Hub",
      address: "456 Green Ave, 1.2 miles",
      accepts: ["glass", "clothing", "electronics"],
      hours: "9AM - 6PM"
    },
    {
      name: "Community Drop-off",
      address: "789 Park Rd, 2.1 miles",
      accepts: ["plastic", "paper", "glass"],
      hours: "24/7"
    }
  ];

  const handleSubmitRecycle = () => {
    if (!selectedItem || !quantity) {
      toast.error("Please select an item and enter quantity");
      return;
    }

    const item = recycleCategories.find(cat => cat.id === selectedItem);
    if (!item) return;

    const pointsEarned = item.points * parseInt(quantity);
    
    // Update user data
    const userData = JSON.parse(localStorage.getItem("ecoswap_user") || "{}");
    userData.ecoPoints = (userData.ecoPoints || 0) + pointsEarned;
    
    localStorage.setItem("ecoswap_user", JSON.stringify(userData));
    
    toast.success(`🎉 Great job! You've earned ${pointsEarned} Eco Points for recycling!`);
    
    // Reset form
    setSelectedItem("");
    setQuantity("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="font-bold text-lg">Recycle & Earn</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Info Banner */}
        <div className="bg-emerald-100 border border-emerald-200 rounded-lg p-4">
          <p className="text-sm font-medium text-emerald-800">
            ♻️ Recycle your products after use and earn Eco Points!
          </p>
        </div>

        {/* Scan or Log Manually */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Log Your Recycling</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <QrCode className="h-6 w-6" />
                <span className="text-sm">Scan QR Code</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Trees className="h-6 w-6" />
                <span className="text-sm">Manual Entry</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recycling Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">What are you recycling?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {recycleCategories.map((category) => (
                <div
                  key={category.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedItem === category.id 
                      ? "border-emerald-500 bg-emerald-50" 
                      : "border-gray-200 hover:border-emerald-300"
                  }`}
                  onClick={() => setSelectedItem(category.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{category.name}</h3>
                      <p className="text-xs text-muted-foreground">{category.description}</p>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600">
                      <Coins className="h-3 w-3" />
                      <span className="text-xs font-medium">{category.points}pts</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedItem && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter number of items"
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleSubmitRecycle} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Log Recycling & Earn Points
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Nearby Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4" />
              Nearby Recycling Centers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {nearbyLocations.map((location, index) => (
              <div key={index} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-sm">{location.name}</h3>
                    <p className="text-xs text-muted-foreground">{location.address}</p>
                    <p className="text-xs text-muted-foreground">Hours: {location.hours}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Directions
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {location.accepts.map((type) => {
                    const category = recycleCategories.find(cat => cat.id === type);
                    return (
                      <span key={type} className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                        {category?.icon} {category?.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recycling Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-emerald-600">•</span>
                <span>Clean containers before recycling for better processing</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600">•</span>
                <span>Remove caps and lids from bottles unless specified</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600">•</span>
                <span>Separate different materials when possible</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600">•</span>
                <span>Check local guidelines for specific recycling rules</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Recycle;