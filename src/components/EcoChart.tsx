import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";

interface EcoChartProps {
  type: "co2-savings" | "eco-points" | "category-breakdown" | "monthly-progress";
  data?: any[];
}

const EcoChart = ({ type, data }: EcoChartProps) => {
  const co2Data = [
    { month: "Jan", co2: 2.1 },
    { month: "Feb", co2: 4.3 },
    { month: "Mar", co2: 8.7 },
    { month: "Apr", co2: 12.4 },
    { month: "May", co2: 18.9 },
    { month: "Jun", co2: 23.4 },
  ];

  const pointsData = [
    { month: "Jan", points: 25 },
    { month: "Feb", points: 45 },
    { month: "Mar", points: 78 },
    { month: "Apr", points: 95 },
    { month: "May", points: 110 },
    { month: "Jun", points: 125 },
  ];

  const categoryData = [
    { name: "Food", value: 40, color: "#10b981" },
    { name: "Packaging", value: 30, color: "#059669" },
    { name: "Transport", value: 20, color: "#047857" },
    { name: "Other", value: 10, color: "#065f46" },
  ];

  const weeklyData = [
    { day: "Mon", swaps: 2 },
    { day: "Tue", swaps: 1 },
    { day: "Wed", swaps: 3 },
    { day: "Thu", swaps: 0 },
    { day: "Fri", swaps: 2 },
    { day: "Sat", swaps: 4 },
    { day: "Sun", swaps: 1 },
  ];

  const renderChart = () => {
    switch (type) {
      case "co2-savings":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">CO₂ Savings Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={co2Data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} kg`, "CO₂ Saved"]} />
                  <Line type="monotone" dataKey="co2" stroke="#10b981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );

      case "eco-points":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Eco Points Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={pointsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}`, "Points"]} />
                  <Line type="monotone" dataKey="points" stroke="#f59e0b" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );

      case "category-breakdown":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Impact by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );

      case "monthly-progress":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Weekly Eco Swaps</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}`, "Swaps"]} />
                  <Bar dataKey="swaps" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return renderChart();
};

export default EcoChart;