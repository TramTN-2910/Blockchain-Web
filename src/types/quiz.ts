export type QuestionType = 'single' | 'multiple';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface QuestionOption {
  id: string;
  text_vn: string;
  text_en: string;
  is_correct: boolean;
}

export interface Question {
  id: string;
  quiz_id?: string;
  topic_slug: string;
  topic_name_vn: string;
  type: QuestionType;
  question_vn: string;
  question_en?: string;
  options: QuestionOption[];
  explanation_vn: string;
  explanation_en?: string;
  difficulty: DifficultyLevel;
}

export interface QuizTopic {
  slug: string;
  name_vn: string;
  icon: string; // lucide icon identifier or emoji
  total_questions: number;
  easy_count: number;
  medium_count: number;
  hard_count: number;
}

export interface Quiz {
  id: string;
  category_slug: string;
  title_vn: string;
  title_en?: string;
  duration_minutes: number;
  passing_score: number;
  questions?: Question[];
}

export interface UserAnswer {
  question_id: string;
  selected_option_ids: string[];
  is_correct: boolean;
}

export interface WrongQuestionItem {
  question_id: string;
  question: Question;
  wrong_count: number;
  last_wrong_at: string;
  is_mastered: boolean;
}

export interface TestResult {
  id: string;
  timestamp: string;
  total_questions: number;
  correct_count: number;
  score_percentage: number;
  passed: boolean;
  time_spent_seconds: number;
  answers: Record<string, string[]>; // questionId -> selectedOptionIds
  questions: Question[];
}
