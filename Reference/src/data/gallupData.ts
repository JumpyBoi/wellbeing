
export interface GallupQuestion {
  id: number;
  question: string;
  description: string;
  score: number;
  respondents: number;
  category: 'basic-needs' | 'individual' | 'teamwork' | 'growth';
}

export interface YearlyData {
  year: number;
  questions: GallupQuestion[];
  engagementIndex: {
    engaged: number;
    notEngaged: number;
    activelyDisengaged: number;
  };
  grandMean: number;
}

export const CATEGORIES = {
  'basic-needs': {
    name: 'Basic Needs',
    color: 'gallup-basic-needs',
    description: 'The foundation of employee engagement, covering basic expectations and materials needed.',
    questions: [1, 2]
  },
  'individual': {
    name: 'Individual Contribution',
    color: 'gallup-individual', 
    description: 'How employees contribute as individuals and receive recognition.',
    questions: [3, 4, 5, 6]
  },
  'teamwork': {
    name: 'Teamwork',
    color: 'gallup-teamwork',
    description: 'How employees work together and collaborate as a team.',
    questions: [7, 8, 9, 10]
  },
  'growth': {
    name: 'Growth',
    color: 'gallup-growth',
    description: 'Opportunities for growth and development within the organization.',
    questions: [11, 12]
  }
};

export const gallupData: YearlyData[] = [
  {
    year: 2023,
    grandMean: 4.12,
    engagementIndex: {
      engaged: 75,
      notEngaged: 8,
      activelyDisengaged: 17
    },
    questions: [
      {
        id: 1,
        question: "Know What's Expected",
        description: "I know what is expected of me at work.",
        score: 4.00,
        respondents: 4,
        category: 'basic-needs'
      },
      {
        id: 2,
        question: "Materials and Equipment",
        description: "I have the materials and equipment I need to do my work right.",
        score: 4.00,
        respondents: 4,
        category: 'basic-needs'
      },
      {
        id: 3,
        question: "Opportunity to Do Best",
        description: "At work, I have the opportunity to do what I do best every day.",
        score: 4.25,
        respondents: 4,
        category: 'individual'
      },
      {
        id: 4,
        question: "Recognition",
        description: "In the last seven days, I have received recognition or praise for doing good work.",
        score: 3.25,
        respondents: 4,
        category: 'individual'
      },
      {
        id: 5,
        question: "Cares About Me",
        description: "My supervisor, or someone at work, seems to care about me as a person.",
        score: 3.00,
        respondents: 4,
        category: 'individual'
      },
      {
        id: 6,
        question: "Development",
        description: "There is someone at work who encourages my development.",
        score: 4.75,
        respondents: 4,
        category: 'individual'
      },
      {
        id: 7,
        question: "Opinions Count",
        description: "At work, my opinions seem to count.",
        score: 4.00,
        respondents: 4,
        category: 'teamwork'
      },
      {
        id: 8,
        question: "Mission/Purpose",
        description: "The mission or purpose of my company makes me feel my job is important.",
        score: 5.00,
        respondents: 4,
        category: 'teamwork'
      },
      {
        id: 9,
        question: "Committed to Quality",
        description: "My associates or fellow employees are committed to doing quality work.",
        score: 3.75,
        respondents: 4,
        category: 'teamwork'
      },
      {
        id: 10,
        question: "Best Friend",
        description: "I have a best friend at work.",
        score: 3.75,
        respondents: 4,
        category: 'teamwork'
      },
      {
        id: 11,
        question: "Progress",
        description: "In the last six months, someone at work has talked to me about my progress.",
        score: 4.75,
        respondents: 4,
        category: 'growth'
      },
      {
        id: 12,
        question: "Learn and Grow",
        description: "In the last year, I have had opportunities at work to learn and grow.",
        score: 5.00,
        respondents: 4,
        category: 'growth'
      }
    ]
  },
  {
    year: 2022,
    grandMean: 3.88,
    engagementIndex: {
      engaged: 65,
      notEngaged: 20,
      activelyDisengaged: 15
    },
    questions: [
      {
        id: 1,
        question: "Know What's Expected",
        description: "I know what is expected of me at work.",
        score: 3.80,
        respondents: 4,
        category: 'basic-needs'
      },
      {
        id: 2,
        question: "Materials and Equipment",
        description: "I have the materials and equipment I need to do my work right.",
        score: 3.75,
        respondents: 4,
        category: 'basic-needs'
      },
      {
        id: 3,
        question: "Opportunity to Do Best",
        description: "At work, I have the opportunity to do what I do best every day.",
        score: 4.00,
        respondents: 4,
        category: 'individual'
      },
      {
        id: 4,
        question: "Recognition",
        description: "In the last seven days, I have received recognition or praise for doing good work.",
        score: 3.00,
        respondents: 4,
        category: 'individual'
      },
      {
        id: 5,
        question: "Cares About Me",
        description: "My supervisor, or someone at work, seems to care about me as a person.",
        score: 2.75,
        respondents: 4,
        category: 'individual'
      },
      {
        id: 6,
        question: "Development",
        description: "There is someone at work who encourages my development.",
        score: 4.50,
        respondents: 4,
        category: 'individual'
      },
      {
        id: 7,
        question: "Opinions Count",
        description: "At work, my opinions seem to count.",
        score: 3.75,
        respondents: 4,
        category: 'teamwork'
      },
      {
        id: 8,
        question: "Mission/Purpose",
        description: "The mission or purpose of my company makes me feel my job is important.",
        score: 4.80,
        respondents: 4,
        category: 'teamwork'
      },
      {
        id: 9,
        question: "Committed to Quality",
        description: "My associates or fellow employees are committed to doing quality work.",
        score: 3.50,
        respondents: 4,
        category: 'teamwork'
      },
      {
        id: 10,
        question: "Best Friend",
        description: "I have a best friend at work.",
        score: 3.50,
        respondents: 4,
        category: 'teamwork'
      },
      {
        id: 11,
        question: "Progress",
        description: "In the last six months, someone at work has talked to me about my progress.",
        score: 4.50,
        respondents: 4,
        category: 'growth'
      },
      {
        id: 12,
        question: "Learn and Grow",
        description: "In the last year, I have had opportunities at work to learn and grow.",
        score: 4.75,
        respondents: 4,
        category: 'growth'
      }
    ]
  },
  {
    year: 2021,
    grandMean: 3.65,
    engagementIndex: {
      engaged: 55,
      notEngaged: 25,
      activelyDisengaged: 20
    },
    questions: [
      {
        id: 1,
        question: "Know What's Expected",
        description: "I know what is expected of me at work.",
        score: 3.60,
        respondents: 4,
        category: 'basic-needs'
      },
      {
        id: 2,
        question: "Materials and Equipment",
        description: "I have the materials and equipment I need to do my work right.",
        score: 3.50,
        respondents: 4,
        category: 'basic-needs'
      },
      {
        id: 3,
        question: "Opportunity to Do Best",
        description: "At work, I have the opportunity to do what I do best every day.",
        score: 3.75,
        respondents: 4,
        category: 'individual'
      },
      {
        id: 4,
        question: "Recognition",
        description: "In the last seven days, I have received recognition or praise for doing good work.",
        score: 2.75,
        respondents: 4,
        category: 'individual'
      },
      {
        id: 5,
        question: "Cares About Me",
        description: "My supervisor, or someone at work, seems to care about me as a person.",
        score: 2.50,
        respondents: 4,
        category: 'individual'
      },
      {
        id: 6,
        question: "Development",
        description: "There is someone at work who encourages my development.",
        score: 4.25,
        respondents: 4,
        category: 'individual'
      },
      {
        id: 7,
        question: "Opinions Count",
        description: "At work, my opinions seem to count.",
        score: 3.50,
        respondents: 4,
        category: 'teamwork'
      },
      {
        id: 8,
        question: "Mission/Purpose",
        description: "The mission or purpose of my company makes me feel my job is important.",
        score: 4.50,
        respondents: 4,
        category: 'teamwork'
      },
      {
        id: 9,
        question: "Committed to Quality",
        description: "My associates or fellow employees are committed to doing quality work.",
        score: 3.25,
        respondents: 4,
        category: 'teamwork'
      },
      {
        id: 10,
        question: "Best Friend",
        description: "I have a best friend at work.",
        score: 3.25,
        respondents: 4,
        category: 'teamwork'
      },
      {
        id: 11,
        question: "Progress",
        description: "In the last six months, someone at work has talked to me about my progress.",
        score: 4.25,
        respondents: 4,
        category: 'growth'
      },
      {
        id: 12,
        question: "Learn and Grow",
        description: "In the last year, I have had opportunities at work to learn and grow.",
        score: 4.50,
        respondents: 4,
        category: 'growth'
      }
    ]
  }
];

export const getCurrentYearData = (): YearlyData => {
  return gallupData.sort((a, b) => b.year - a.year)[0];
};

export const getQuestionById = (id: number, yearData?: YearlyData): GallupQuestion | undefined => {
  const data = yearData || getCurrentYearData();
  return data.questions.find(q => q.id === id);
};

export const getCategoryScores = (data: YearlyData) => {
  const categoryScores = {
    'basic-needs': 0,
    'individual': 0,
    'teamwork': 0,
    'growth': 0
  };
  
  const categoryCounts = {
    'basic-needs': 0,
    'individual': 0,
    'teamwork': 0,
    'growth': 0
  };
  
  data.questions.forEach(question => {
    categoryScores[question.category] += question.score;
    categoryCounts[question.category]++;
  });
  
  return {
    'basic-needs': categoryScores['basic-needs'] / categoryCounts['basic-needs'],
    'individual': categoryScores['individual'] / categoryCounts['individual'],
    'teamwork': categoryScores['teamwork'] / categoryCounts['teamwork'],
    'growth': categoryScores['growth'] / categoryCounts['growth']
  };
};

export const getCategoryQuestions = (category: 'basic-needs' | 'individual' | 'teamwork' | 'growth', data?: YearlyData) => {
  const yearData = data || getCurrentYearData();
  return yearData.questions.filter(q => q.category === category);
};
