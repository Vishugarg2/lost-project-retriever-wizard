import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trees, Coins } from "lucide-react";

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    {
      title: "Welcome to EcoSwap!",
      content: (
        <div className="text-center space-y-4">
          <Trees className="h-16 w-16 text-emerald-600 mx-auto" />
          <h2 className="text-2xl font-bold">Make Every Purchase Count</h2>
          <p className="text-muted-foreground">
            Discover eco-friendly alternatives while shopping and earn rewards for making sustainable choices.
          </p>
        </div>
      ),
    },
    {
      title: "How It Works",
      content: (
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
              1
            </div>
            <div>
              <h3 className="font-semibold">Shop as Usual</h3>
              <p className="text-sm text-muted-foreground">Add items to your cart normally</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
              2
            </div>
            <div>
              <h3 className="font-semibold">Get Green Suggestions</h3>
              <p className="text-sm text-muted-foreground">See eco-friendly alternatives instantly</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold">Earn Eco Points</h3>
              <p className="text-sm text-muted-foreground">Get rewarded for sustainable choices</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Start Your Journey",
      content: (
        <div className="text-center space-y-4">
          <Coins className="h-16 w-16 text-emerald-600 mx-auto" />
          <h2 className="text-2xl font-bold">Ready to Save the Planet?</h2>
          <p className="text-muted-foreground">
            Join thousands of eco-conscious shoppers making a difference, one purchase at a time.
          </p>
          <div className="bg-emerald-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-emerald-700">
              🎁 Welcome Bonus: 50 Eco Points
            </p>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Update user with welcome bonus
      const userData = JSON.parse(localStorage.getItem("ecoswap_user") || "{}");
      userData.ecoPoints = 50;
      localStorage.setItem("ecoswap_user", JSON.stringify(userData));
      navigate("/dashboard");
    }
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{steps[step].title}</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              Skip
            </Button>
          </div>
          <Progress value={(step + 1) / steps.length * 100} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          {steps[step].content}
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                Back
              </Button>
            )}
            <Button onClick={handleNext} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
              {step < steps.length - 1 ? "Next" : "Get Started"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;