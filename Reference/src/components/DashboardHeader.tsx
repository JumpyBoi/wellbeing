
import React from "react";
import { YearlyData } from "@/data/gallupData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown } from "lucide-react";

interface DashboardHeaderProps {
  yearData: YearlyData[];
  selectedYear: number;
  onYearChange: (year: number) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  yearData,
  selectedYear,
  onYearChange,
}) => {
  return (
    <div className="mt-4 flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold text-gray-700">
          Your Company Engagement Survey | Overall
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Percentile Range in Gallup Database: <span className="text-red-500 font-medium">{'<33'}</span> | <span className="text-amber-500 font-medium">33-66</span> | <span className="text-green-500 font-medium">{'>66'}</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          * Item data not shown if sample size is less than 4. Workgroup data not shown to protect confidentiality.
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">Survey Year:</span>
        <Select
          value={selectedYear.toString()}
          onValueChange={(value) => onYearChange(parseInt(value))}
        >
          <SelectTrigger className="w-48 bg-blue-600 hover:bg-blue-700 text-white transition-colors font-medium border-0 shadow-lg">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select year" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {yearData.map((data) => (
              <SelectItem key={data.year} value={data.year.toString()}>
                {data.year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DashboardHeader;
