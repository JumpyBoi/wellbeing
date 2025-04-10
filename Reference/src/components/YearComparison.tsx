
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { YearlyData, CATEGORIES, getCategoryScores } from "@/data/gallupData";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  ReferenceLine
} from "recharts";
import { ArrowDown, ArrowUp } from "lucide-react";

interface YearComparisonProps {
  data: YearlyData[];
}

const YearComparison: React.FC<YearComparisonProps> = ({ data }) => {
  // Sort data by year in ascending order
  const sortedData = [...data].sort((a, b) => a.year - b.year);
  
  // Prepare data for category comparison chart
  const categoryData = sortedData.map(yearData => {
    const scores = getCategoryScores(yearData);
    return {
      year: yearData.year,
      "Basic Needs": scores["basic-needs"],
      "Individual Contribution": scores["individual"],
      "Teamwork": scores["teamwork"],
      "Growth": scores["growth"],
    };
  });

  // Prepare data for engagement index comparison
  const engagementData = sortedData.map(yearData => {
    return {
      year: yearData.year,
      "Engaged": yearData.engagementIndex.engaged,
      "Not Engaged": yearData.engagementIndex.notEngaged,
      "Actively Disengaged": yearData.engagementIndex.activelyDisengaged,
    };
  });

  // Helper function to determine if a category has grown since the previous year
  const getCategoryGrowth = (category: string) => {
    if (categoryData.length < 2) return null;
    
    const currentYear = categoryData[categoryData.length - 1];
    const previousYear = categoryData[categoryData.length - 2];
    
    const diff = currentYear[category as keyof typeof currentYear] - 
      previousYear[category as keyof typeof previousYear];
      
    return {
      diff,
      percentage: previousYear[category as keyof typeof previousYear] !== 0 
        ? (diff / previousYear[category as keyof typeof previousYear]) * 100 
        : 0
    };
  };

  return (
    <div className="space-y-8">
      {/* Line graphs showing growth or decline for each category */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-bold">CATEGORY TRENDS OVER TIME</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={categoryData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <ReferenceLine y={3.5} label="Target" stroke="#9b87f5" strokeDasharray="3 3" />
              <Line 
                type="monotone" 
                dataKey="Basic Needs" 
                stroke="#D4E157" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="Individual Contribution" 
                stroke="#9CCC65" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="Teamwork" 
                stroke="#43A047" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="Growth" 
                stroke="#00796B" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category growth indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {["Basic Needs", "Individual Contribution", "Teamwork", "Growth"].map((category) => {
          const growth = getCategoryGrowth(category);
          const isPositive = growth && growth.diff > 0;
          const isNegative = growth && growth.diff < 0;
          
          return (
            <Card key={category} className={isPositive ? "border-l-4 border-l-green-500" : isNegative ? "border-l-4 border-l-red-500" : ""}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-sm">{category}</h3>
                  {growth && (
                    <div className={`flex items-center ${isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-gray-500'}`}>
                      {isPositive ? <ArrowUp className="h-4 w-4 mr-1" /> : isNegative ? <ArrowDown className="h-4 w-4 mr-1" /> : null}
                      <span className="text-sm font-medium">{growth.diff.toFixed(2)} ({growth.percentage.toFixed(1)}%)</span>
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold">
                    {categoryData[categoryData.length - 1][category as keyof typeof categoryData[0]].toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">Current Score</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div>
        <h3 className="text-md font-semibold mb-4">Category Scores by Year</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <XAxis dataKey="year" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Basic Needs" fill="#D4E157" name="Basic Needs" />
            <Bar dataKey="Individual Contribution" fill="#9CCC65" name="Individual Contribution" />
            <Bar dataKey="Teamwork" fill="#43A047" name="Teamwork" />
            <Bar dataKey="Growth" fill="#00796B" name="Growth" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div>
        <h3 className="text-md font-semibold mb-4">Engagement Index by Year</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={engagementData}>
            <XAxis dataKey="year" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Engaged" fill="#8BC34A" stackId="a" name="Engaged" />
            <Bar dataKey="Not Engaged" fill="#9E9E9E" stackId="a" name="Not Engaged" />
            <Bar dataKey="Actively Disengaged" fill="#212121" stackId="a" name="Actively Disengaged" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default YearComparison;
