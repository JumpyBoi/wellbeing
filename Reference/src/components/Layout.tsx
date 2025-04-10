
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpDown, BarChart3, LineChart, PieChart } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, header, activeTab, onTabChange }) => {
  // Handler for tab changes
  const handleTabChange = (value: string) => {
    onTabChange(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Gallup Growth Compass
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Company: Your Company</span>
              <span className="text-sm text-gray-500">Department: All</span>
            </div>
          </div>
          {header}
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="mb-6 bg-white border">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-gallup-engaged data-[state=active]:text-white">
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="trends" className="data-[state=active]:bg-gallup-engaged data-[state=active]:text-white">
                <LineChart className="h-4 w-4 mr-2" />
                Trends
              </TabsTrigger>
              <TabsTrigger value="categories" className="data-[state=active]:bg-gallup-engaged data-[state=active]:text-white">
                <PieChart className="h-4 w-4 mr-2" />
                Categories
              </TabsTrigger>
              <TabsTrigger value="comparison" className="data-[state=active]:bg-gallup-engaged data-[state=active]:text-white">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Year Comparison
              </TabsTrigger>
            </TabsList>
            
            {/* The children now represent the content for each tab */}
            {children}
          </Tabs>
        </div>
      </main>

      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500">
            &copy; 2025 Gallup Growth Compass Dashboard
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
