import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp } from "lucide-react";
import EcoChart from "@/components/EcoChart";
import EcoPoll from "@/components/EcoPoll";

const Analytics = () => {
  const navigate = useNavigate();

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
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Analytics & Insights
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Charts Section */}
        <div className="space-y-4">
          <EcoChart type="co2-savings" />
          <EcoChart type="eco-points" />
          <EcoChart type="category-breakdown" />
          <EcoChart type="monthly-progress" />
        </div>

        {/* Polls Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-emerald-700">Community Polls</h2>
          <EcoPoll />
        </div>
      </div>
    </div>
  );
};

export default Analytics;