import React, { useState } from "react";
import Layout from "@/components/Layout";
import DashboardHeader from "@/components/DashboardHeader";
import EngagementIndex from "@/components/EngagementIndex";
import OverallScore from "@/components/OverallScore";
import QuestionList from "@/components/QuestionList";
import CategoryPyramid from "@/components/CategoryPyramid";
import YearComparison from "@/components/YearComparison";
import { gallupData, getCurrentYearData } from "@/data/gallupData";

const Index = () => {
  const [selectedYear, setSelectedYear] = useState(getCurrentYearData().year);
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const currentYearData = gallupData.find((data) => data.year === selectedYear) || getCurrentYearData();
  
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Layout
      header={
        <DashboardHeader
          yearData={gallupData}
          selectedYear={selectedYear}
          onYearChange={handleYearChange}
        />
      }
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      {activeTab === "dashboard" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EngagementIndex data={currentYearData} />
            <OverallScore score={currentYearData.grandMean} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <CategoryPyramid data={currentYearData} />
            <QuestionList questions={currentYearData.questions} />
          </div>
        </>
      )}
      
      {activeTab === "comparison" && (
        <div className="bg-white shadow rounded-lg p-6">
          <YearComparison data={gallupData} />
        </div>
      )}
      
      {/* Other tabs content can be added here */}
    </Layout>
  );
};

export default Index;
