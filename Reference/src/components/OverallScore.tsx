
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OverallScoreProps {
  score: number;
}

const OverallScore: React.FC<OverallScoreProps> = ({ score }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold">YOUR COMPANY</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-center">
          <div className="relative w-40 h-40 rounded-full border-8 border-gray-200 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-700">{score.toFixed(2)}</div>
              <div className="text-sm text-gray-500">GRANDMEAN</div>
            </div>
            <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-gray-200"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="46"
                cx="50"
                cy="50"
              />
              <circle
                className="text-gallup-engaged"
                strokeWidth="8"
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="46"
                cx="50"
                cy="50"
                strokeDasharray={`${(score / 5) * 289} 289`}
                strokeDashoffset="0"
                transform="rotate(-90 50 50)"
              />
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverallScore;
