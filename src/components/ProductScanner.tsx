import { useState } from 'react';
import { Camera, CameraResultType, CameraSource, CameraDirection } from '@capacitor/camera';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScanLine, Camera as CameraIcon, X, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { addProduct, getCurrentUser, addToCart } from '@/lib/supabase';

interface ScannerProps {
  onScanComplete: (productData: any) => void;
  onClose: () => void;
}

interface ScannedProduct {
  id: string;
  name: string;
  barcode: string;
  ecoScore: number;
  price: string;
  co2Footprint: string;
  carbonPercentage: string;
  image: string;
}

const ProductScanner = ({ onScanComplete, onClose }: ScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null);

  const startCamera = async (useFrontCamera: boolean = false) => {
    try {
      setIsScanning(true);
      
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        direction: useFrontCamera ? CameraDirection.Front : CameraDirection.Rear
      });

      setScannedImage(image.dataUrl || null);
      
      // Simulate barcode/product recognition
      setTimeout(async () => {
        const carbonPercentage = (Math.random() * 15 + 5).toFixed(1); // 5-20% carbon
        const barcode = `${Math.floor(Math.random() * 1000000000)}`;
        const price = Math.floor(Math.random() * 500 + 50); // ₹50-₹550
        
        const mockProductData = {
          id: Math.random().toString(),
          name: useFrontCamera ? "Front Camera Scanned Item" : "Scanned Product",
          barcode,
          ecoScore: Math.floor(Math.random() * 100),
          price: price.toString(),
          co2Footprint: (Math.random() * 5 + 0.5).toFixed(1),
          carbonPercentage,
          image: useFrontCamera ? "🤳" : "📦"
        };
        
        // Save to Supabase
        try {
          const user = await getCurrentUser();
          if (user) {
            await addProduct({
              name: mockProductData.name,
              barcode: mockProductData.barcode,
              price: parseInt(mockProductData.price),
              eco_score: mockProductData.ecoScore,
              co2_footprint: parseFloat(mockProductData.co2Footprint),
              carbon_percentage: mockProductData.carbonPercentage,
              image: mockProductData.image,
              category: useFrontCamera ? 'selfie_scan' : 'barcode_scan'
            });
          }
        } catch (error) {
          console.error('Error saving product:', error);
        }
        
        setScannedProduct(mockProductData);
        setIsScanning(false);
        toast.success(`${useFrontCamera ? '🤳 Front camera' : '📷 Rear camera'} scan complete! Carbon: ${carbonPercentage}%`);
      }, 2000);
      
    } catch (error) {
      console.error('Camera error:', error);
      toast.error("Camera access failed. Please allow camera permissions.");
      setIsScanning(false);
    }
  };

  const simulateScan = () => {
    setIsScanning(true);
    
    // Simulate scan for web demo
    setTimeout(() => {
      const carbonPercentage = "12.3"; // Demo carbon percentage
      const mockProductData = {
        id: Math.random().toString(),
        name: "Regular Potato Chips",
        barcode: "123456789",
        ecoScore: 35,
        price: "3.99",
        co2Footprint: "2.4",
        carbonPercentage,
        image: "🥔"
      };
      
      setScannedProduct(mockProductData);
      setIsScanning(false);
      toast.success(`Carbon Footprint: ${carbonPercentage}% detected!`);
    }, 2000);
  };

  const handleAddToCart = async () => {
    if (scannedProduct) {
      try {
        const user = await getCurrentUser();
        if (user) {
          // Add to Supabase cart
          await addToCart(user.id, scannedProduct.id);
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
      
      onScanComplete(scannedProduct);
      toast.success(`Added ${scannedProduct.name} to cart!`);
      onClose();
    }
  };

  const handleScanAnother = () => {
    setScannedProduct(null);
    setScannedImage(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ScanLine className="h-5 w-5 text-emerald-600" />
            Product Scanner
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {scannedImage && (
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img src={scannedImage} alt="Scanned" className="w-full h-full object-cover" />
            </div>
          )}
          
          {scannedProduct ? (
            // Show scan results
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-6xl mb-2">{scannedProduct.image}</div>
                <h3 className="font-bold text-lg">{scannedProduct.name}</h3>
                <div className="flex justify-center mt-3">
                  <div className="bg-red-100 text-red-700 px-4 py-2 rounded-full border-2 border-red-200">
                    <span className="text-2xl font-bold">🔥 {scannedProduct.carbonPercentage}%</span>
                    <p className="text-sm font-medium">Carbon Footprint</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Eco Score:</span>
                  <span className="font-medium">{scannedProduct.ecoScore}/100</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-medium">${scannedProduct.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">CO₂ Footprint:</span>
                  <span className="font-medium">{scannedProduct.co2Footprint}kg</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button onClick={handleAddToCart} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Add to Cart
                </Button>
                <Button onClick={handleScanAnother} variant="outline" className="w-full">
                  Scan Another Product
                </Button>
              </div>
            </div>
          ) : (
            // Show scanning interface
            <>
              <div className="text-center space-y-4">
                {isScanning ? (
                  <div className="space-y-3">
                    <div className="w-16 h-16 mx-auto border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-muted-foreground">
                      Scanning product... Please wait
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                      <CameraIcon className="h-8 w-8 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Scan Product Barcode</h3>
                      <p className="text-sm text-muted-foreground">
                        Point your camera at the product barcode
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={() => startCamera(false)} 
                  disabled={isScanning}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  <CameraIcon className="h-4 w-4 mr-2" />
                  {isScanning ? "Scanning..." : "Rear Camera Scan"}
                </Button>
                
                <Button 
                  onClick={() => startCamera(true)} 
                  disabled={isScanning}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {isScanning ? "Scanning..." : "Front Camera Scan"}
                </Button>
                
                <Button 
                  onClick={simulateScan} 
                  disabled={isScanning}
                  variant="outline"
                  className="w-full"
                >
                  <ScanLine className="h-4 w-4 mr-2" />
                  Demo Scan (Web)
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground text-center">
                📱 Rear Camera: Scan product barcodes<br/>
                🤳 Front Camera: Scan personal items<br/>
                💻 Demo: Test scanning functionality
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductScanner;