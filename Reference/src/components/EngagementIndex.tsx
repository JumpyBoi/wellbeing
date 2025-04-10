
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { YearlyData } from "@/data/gallupData";

interface EngagementIndexProps {
  data: YearlyData;
}

const EngagementIndex: React.FC<EngagementIndexProps> = ({ data }) => {
  const { engagementIndex } = data;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold">ENGAGEMENT INDEX</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-4 h-4 bg-gallup-engaged rounded-sm"></div>
            <span>Engaged</span>
            <div className="w-4 h-4 bg-gallup-not-engaged rounded-sm ml-4"></div>
            <span>Not Engaged</span>
            <div className="w-4 h-4 bg-gallup-disengaged rounded-sm ml-4"></div>
            <span>Actively Disengaged</span>
          </div>
          
          <div className="w-full h-6 flex rounded-md overflow-hidden">
            <div 
              className="bg-gallup-engaged h-full text-white text-xs flex items-center justify-center"
              style={{ width: `${engagementIndex.engaged}%` }}
            >
              {engagementIndex.engaged}%
            </div>
            <div 
              className="bg-gallup-not-engaged h-full text-white text-xs flex items-center justify-center"
              style={{ width: `${engagementIndex.notEngaged}%` }}
            >
              {engagementIndex.notEngaged}%
            </div>
            <div 
              className="bg-gallup-disengaged h-full text-white text-xs flex items-center justify-center"
              style={{ width: `${engagementIndex.activelyDisengaged}%` }}
            >
              {engagementIndex.activelyDisengaged}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EngagementIndex;
