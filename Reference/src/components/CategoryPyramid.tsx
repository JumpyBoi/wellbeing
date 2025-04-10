
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORIES, YearlyData, getCategoryQuestions, getCategoryScores } from "@/data/gallupData";

interface CategoryPyramidProps {
  data: YearlyData;
}

const CategoryPyramid: React.FC<CategoryPyramidProps> = ({ data }) => {
  const categoryScores = getCategoryScores(data);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold">CATEGORY HIERARCHY</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        <div className="pyramid-container">
          {/* Growth (Top) */}
          <div className="pyramid-level growth-level">
            <div className="pyramid-section bg-gallup-growth">
              <div className="pyramid-content">
                <div className="text-white font-bold text-lg">Growth</div>
                <div className="text-white text-sm">({categoryScores['growth'].toFixed(2)})</div>
              </div>
              
              {/* Question dots */}
              <div className="question-dot left">
                <div className="question-circle">Q11</div>
              </div>
              <div className="question-dot right">
                <div className="question-circle">Q12</div>
              </div>
            </div>
          </div>
          
          {/* Teamwork */}
          <div className="pyramid-level teamwork-level">
            <div className="pyramid-section bg-gallup-teamwork">
              <div className="pyramid-content">
                <div className="text-white font-bold text-lg">Teamwork</div>
                <div className="text-white text-sm">({categoryScores['teamwork'].toFixed(2)})</div>
              </div>
              
              {/* Question dots */}
              <div className="question-dot left-1">
                <div className="question-circle">Q7</div>
              </div>
              <div className="question-dot left-2">
                <div className="question-circle">Q8</div>
              </div>
              <div className="question-dot right-2">
                <div className="question-circle">Q9</div>
              </div>
              <div className="question-dot right-1">
                <div className="question-circle">Q10</div>
              </div>
            </div>
          </div>
          
          {/* Individual */}
          <div className="pyramid-level individual-level">
            <div className="pyramid-section bg-gallup-individual">
              <div className="pyramid-content">
                <div className="text-white font-bold text-lg">Individual Contribution</div>
                <div className="text-white text-sm">({categoryScores['individual'].toFixed(2)})</div>
              </div>
              
              {/* Question dots */}
              <div className="question-dot left-1">
                <div className="question-circle">Q3</div>
              </div>
              <div className="question-dot left-2">
                <div className="question-circle">Q4</div>
              </div>
              <div className="question-dot right-2">
                <div className="question-circle">Q5</div>
              </div>
              <div className="question-dot right-1">
                <div className="question-circle">Q6</div>
              </div>
            </div>
          </div>
          
          {/* Basic Needs (Bottom) */}
          <div className="pyramid-level basic-needs-level">
            <div className="pyramid-section bg-gallup-basic-needs">
              <div className="pyramid-content">
                <div className="text-white font-bold text-lg">Basic Needs</div>
                <div className="text-white text-sm">({categoryScores['basic-needs'].toFixed(2)})</div>
              </div>
              
              {/* Question dots */}
              <div className="question-dot left">
                <div className="question-circle">Q1</div>
              </div>
              <div className="question-dot right">
                <div className="question-circle">Q2</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryPyramid;
