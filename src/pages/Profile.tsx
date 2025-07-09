import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, Edit3, Camera, QrCode, MessageCircle, Leaf, Award } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("ecoswap_user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleSaveProfile = () => {
    localStorage.setItem("ecoswap_user", JSON.stringify(user));
    setIsEditing(false);
    toast.success("Profile updated successfully! 🎉");
  };

  const tutorialSteps = [
    {
      icon: QrCode,
      title: "Scan Products",
      description: "Point your camera at any product barcode to instantly see eco-friendly alternatives and impact data."
    },
    {
      icon: MessageCircle,
      title: "Chat with EcoBot",
      description: "Tap the floating chat button to ask our AI assistant about sustainable products and eco tips."
    },
    {
      icon: Leaf,
      title: "Track Your Impact",
      description: "Monitor your CO₂ savings and earn eco points for every sustainable swap you make."
    }
  ];

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
            <h1 className="font-bold text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-emerald-600" />
              My Profile
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Profile Information</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="flex-1">
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 mb-2">
                  {user.level}
                </Badge>
                {isEditing ? (
                  <Input
                    value={user.name}
                    onChange={(e) => setUser({...user, name: e.target.value})}
                    className="font-medium"
                  />
                ) : (
                  <h3 className="font-medium text-lg">{user.name}</h3>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600">{user.ecoPoints}</div>
                <p className="text-sm text-muted-foreground">Eco Points</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{user.co2Saved}kg</div>
                <p className="text-sm text-muted-foreground">CO₂ Saved</p>
              </div>
            </div>

            {isEditing && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user.email || ""}
                    onChange={(e) => setUser({...user, email: e.target.value})}
                    placeholder="your@email.com"
                  />
                </div>
                <Button onClick={handleSaveProfile} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  🌱
                </div>
                <div>
                  <p className="font-medium text-sm">First Swap</p>
                  <p className="text-xs text-muted-foreground">Made your first eco-friendly swap</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  ♻️
                </div>
                <div>
                  <p className="font-medium text-sm">Recycling Champion</p>
                  <p className="text-xs text-muted-foreground">Recycled 5+ products</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tutorial Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">How to Use EcoSwap</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full mb-4"
              onClick={() => setShowTutorial(!showTutorial)}
            >
              {showTutorial ? "Hide Tutorial" : "Show Tutorial"}
            </Button>
            
            {showTutorial && (
              <div className="space-y-4">
                {tutorialSteps.map((step, index) => (
                  <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <step.icon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{step.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="h-16 flex-col gap-1"
            onClick={() => navigate("/analytics")}
          >
            <Camera className="h-5 w-5" />
            <span className="text-sm">Analytics</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-16 flex-col gap-1"
            onClick={() => setShowTutorial(true)}
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm">Help & Tips</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;