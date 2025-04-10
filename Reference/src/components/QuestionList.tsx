
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GallupQuestion } from "@/data/gallupData";

interface QuestionListProps {
  questions: GallupQuestion[];
}

const QuestionList: React.FC<QuestionListProps> = ({ questions }) => {
  const sortedQuestions = [...questions].sort((a, b) => a.id - b.id);
  
  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "text-green-600";
    if (score >= 3.5) return "text-blue-600";
    if (score >= 2.5) return "text-amber-600";
    return "text-red-600";
  };
  
  const getBarWidth = (score: number) => {
    return `${(score / 5) * 100}%`;
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic-needs':
        return 'bg-gallup-basic-needs';
      case 'individual':
        return 'bg-gallup-individual';
      case 'teamwork':
        return 'bg-gallup-teamwork';
      case 'growth':
        return 'bg-gallup-growth';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold">QUESTIONS</CardTitle>
          <div className="text-right text-sm font-semibold">
            SCORE<br />
            (RESPONDENTS)
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {sortedQuestions.map((q) => (
            <div key={q.id} className="question-row">
              <div className="mr-4 text-center w-8">
                <div className="font-semibold">Q{q.id}</div>
                <div 
                  className={`w-2 h-2 rounded-full mx-auto mt-1 ${getCategoryColor(q.category)}`}
                ></div>
              </div>
              <div className="flex-grow">
                <div className="font-medium">{q.question}</div>
                <div className="text-sm text-gray-500 mb-2">{q.description}</div>
                <div className="question-score-bar">
                  <div 
                    className={`h-full ${getCategoryColor(q.category)}`}
                    style={{ width: getBarWidth(q.score) }}
                  ></div>
                </div>
              </div>
              <div className="ml-4 text-right">
                <div className={`font-bold ${getScoreColor(q.score)}`}>
                  {q.score.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">
                  ({q.respondents})
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionList;
