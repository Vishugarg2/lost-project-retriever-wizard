import { useState } from 'react';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScanLine, Camera as CameraIcon, X } from 'lucide-react';
import { toast } from 'sonner';

interface ScannerProps {
  onScanComplete: (productData: any) => void;
  onClose: () => void;
}

const ProductScanner = ({ onScanComplete, onClose }: ScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      setIsScanning(true);
      
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl
      });

      setScannedImage(image.dataUrl || null);
      
      // Simulate barcode/product recognition
      setTimeout(() => {
        const carbonPercentage = (Math.random() * 15 + 5).toFixed(1); // 5-20% carbon
        const mockProductData = {
          id: Math.random().toString(),
          name: "Scanned Product",
          barcode: "123456789",
          ecoScore: Math.floor(Math.random() * 100),
          price: (Math.random() * 20 + 5).toFixed(2),
          co2Footprint: (Math.random() * 5 + 0.5).toFixed(1),
          carbonPercentage,
          image: "📦"
        };
        
        // Show carbon percentage prominently
        toast.success(`Carbon Footprint: ${carbonPercentage}% detected!`, {
          description: `Product scanned successfully!`
        });
        
        onScanComplete(mockProductData);
        setIsScanning(false);
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
      
      // Show carbon percentage prominently
      toast.success(`Carbon Footprint: ${carbonPercentage}% detected!`, {
        description: `Product scanned successfully!`
      });
      
      onScanComplete(mockProductData);
      setIsScanning(false);
    }, 2000);
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
              onClick={startCamera} 
              disabled={isScanning}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              <CameraIcon className="h-4 w-4 mr-2" />
              {isScanning ? "Scanning..." : "Start Camera Scan"}
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
            📱 On mobile: Use camera to scan barcodes<br/>
            💻 On web: Use demo scan for testing
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductScanner;