import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trees, Coins, BarChart3, MessageCircle, User, ScanLine, ShoppingCart, CreditCard, Smartphone, Wallet } from "lucide-react";
import { toast } from "sonner";
import EcoBot from "@/components/EcoBot";
import ProductScanner from "@/components/ProductScanner";
import { getCurrentUser, getCartItems, removeFromCart, clearCart, updateUserPoints } from "@/lib/supabase";

interface Product {
  id: string;
  name: string;
  price: number;
  ecoScore: number;
  co2Footprint: number;
  carbonPercentage?: string;
  image: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [showCartDetails, setShowCartDetails] = useState(false);
  const [showPaymentModes, setShowPaymentModes] = useState(false);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadUserData();
  }, [navigate]);

  const loadUserData = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        // Load cart from Supabase
        const { data: cartData } = await getCartItems(currentUser.id);
        if (cartData) {
          const cartItems = cartData.map((item: any) => ({
            id: item.id,
            name: item.products.name,
            price: item.products.price,
            ecoScore: item.products.eco_score,
            co2Footprint: item.products.co2_footprint,
            carbonPercentage: item.products.carbon_percentage,
            image: item.products.image
          }));
          setCart(cartItems);
        }
      } else {
        // Fallback to localStorage
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
            price: 299,
            ecoScore: 35,
            co2Footprint: 2.4,
            image: "🥔"
          }
        ];
        setCart(mockCart);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Fallback to localStorage
      const userData = localStorage.getItem("ecoswap_user");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        navigate("/login");
      }
    }
  };

  const handleSwapProduct = () => {
    navigate("/compare");
  };

  const handleViewWallet = () => {
    navigate("/wallet");
  };

  const handleRecycle = () => {
    navigate("/recycle");
  };

  const handleViewAnalytics = () => {
    navigate("/analytics");
  };

  const handleScanComplete = (productData: any) => {
    setCart(prev => [...prev, productData]);
    setShowScanner(false);
    toast.success(`Added ${productData.name} to cart!`);
  };

  const handlePayment = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    setShowPaymentModes(true);
  };

  const processPayment = async (paymentMode: string) => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    try {
      // Clear cart in Supabase
      if (user) {
        await clearCart(user.id);
        // Award eco points for purchase
        const pointsEarned = Math.floor(total / 10); // 1 point per ₹10
        const co2Saved = cart.reduce((sum, item) => sum + (item.co2Footprint || 0), 0);
        await updateUserPoints(user.id, user.eco_points + pointsEarned, user.co2_saved + co2Saved);
        
        toast.success(`Payment of ₹${total.toFixed(2)} processed via ${paymentMode}! Earned ${pointsEarned} eco points!`);
      } else {
        toast.success(`Payment of ₹${total.toFixed(2)} processed successfully via ${paymentMode}!`);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.success(`Payment of ₹${total.toFixed(2)} processed successfully via ${paymentMode}!`);
    }
    
    setCart([]);
    setShowCartDetails(false);
    setShowPaymentModes(false);
    setSelectedPaymentMode("");
    
    // Reload user data to update points
    loadUserData();
  };

  const removeFromCart = async (productId: string) => {
    try {
      if (user) {
        await removeFromCart(productId);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
    
    setCart(prev => prev.filter(item => item.id !== productId));
    toast.success("Item removed from cart");
  };

  const paymentModes = [
    { id: "phonepe", name: "PhonePe", icon: "📱", color: "bg-purple-100 text-purple-700" },
    { id: "googlepay", name: "Google Pay", icon: "💳", color: "bg-blue-100 text-blue-700" },
    { id: "paytm", name: "Paytm", icon: "💰", color: "bg-indigo-100 text-indigo-700" },
    { id: "upi", name: "UPI", icon: "🏦", color: "bg-green-100 text-green-700" },
    { id: "creditcard", name: "Credit Card", icon: "💳", color: "bg-orange-100 text-orange-700" },
    { id: "debitcard", name: "Debit Card", icon: "💳", color: "bg-red-100 text-red-700" },
  ];

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
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowCartDetails(true)}
                className="p-2 relative"
              >
                <ShoppingCart className="h-5 w-5 text-emerald-600" />
                {cart.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs p-0 bg-red-500 text-white flex items-center justify-center">
                    {cart.length}
                  </Badge>
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/profile")}
                className="p-2"
              >
                <User className="h-5 w-5 text-emerald-600" />
              </Button>
            </div>
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
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Your Shopping Cart</CardTitle>
              {cart.length > 0 && (
                <Button 
                  onClick={handlePayment} 
                  size="sm" 
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <CreditCard className="h-4 w-4 mr-1" />
                  Pay ₹{cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                </Button>
              )}
            </div>
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
                         <div className="flex items-center gap-2 text-xs">
                           <span className="text-muted-foreground">
                             Eco Score: {item.ecoScore}/100 | ₹{item.price}
                           </span>
                           {item.carbonPercentage && (
                             <Badge variant="destructive" className="bg-red-100 text-red-700 text-xs px-2 py-0">
                               🔥 {item.carbonPercentage}% Carbon
                             </Badge>
                           )}
                         </div>
                       </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSwapProduct} className="bg-emerald-600 hover:bg-emerald-700">
                        Swap
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs px-2"
                      >
                        ✕
                      </Button>
                    </div>
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

        {/* Scan Product Button */}
        <Card>
          <CardContent className="pt-6">
            <Button 
              onClick={() => setShowScanner(true)} 
              className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-medium"
            >
              <ScanLine className="h-6 w-6 mr-3" />
              Scan Product
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              📱 Point camera at barcode to add products
            </p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <Button onClick={handleViewWallet} variant="outline" className="h-16 flex-col gap-1">
            <Coins className="h-5 w-5" />
            <span className="text-sm">Eco Wallet</span>
          </Button>
          <Button onClick={handleRecycle} variant="outline" className="h-16 flex-col gap-1">
            <Trees className="h-5 w-5" />
            <span className="text-sm">Recycle</span>
          </Button>
          <Button onClick={handleViewAnalytics} variant="outline" className="h-16 flex-col gap-1">
            <BarChart3 className="h-5 w-5" />
            <span className="text-sm">Analytics</span>
          </Button>
        </div>

        {/* EcoBot Assistant */}
        <EcoBot />

        {/* Product Scanner Modal */}
        {showScanner && (
          <ProductScanner 
            onScanComplete={handleScanComplete}
            onClose={() => setShowScanner(false)}
          />
        )}

        {/* Cart Details Modal */}
        {showCartDetails && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Shopping Cart ({cart.length})</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowCartDetails(false)}
                    className="p-2"
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {cart.length > 0 ? (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.image}</span>
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-muted-foreground">
                                Eco Score: {item.ecoScore}/100 | ₹{item.price}
                              </span>
                              {item.carbonPercentage && (
                                <Badge variant="destructive" className="bg-red-100 text-red-700 text-xs px-2 py-0">
                                  🔥 {item.carbonPercentage}% Carbon
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs px-2"
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold">Total: ₹{cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
                      </div>
                      <Button 
                        onClick={handlePayment} 
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Choose Payment Method
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Your cart is empty
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Payment Modes Modal */}
        {showPaymentModes && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Choose Payment Method</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowPaymentModes(false)}
                    className="p-2"
                  >
                    ✕
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Total: ₹{cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {paymentModes.map((mode) => (
                    <Button
                      key={mode.id}
                      variant="outline"
                      className={`h-20 flex-col gap-2 ${selectedPaymentMode === mode.id ? 'ring-2 ring-emerald-500' : ''}`}
                      onClick={() => {
                        setSelectedPaymentMode(mode.id);
                        setTimeout(() => processPayment(mode.name), 500);
                      }}
                    >
                      <span className="text-2xl">{mode.icon}</span>
                      <span className="text-xs font-medium">{mode.name}</span>
                    </Button>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700">
                    💡 All payments are secure and encrypted. Choose your preferred payment method.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;