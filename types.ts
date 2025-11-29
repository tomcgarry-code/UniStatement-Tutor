
export interface PlagiarismCheck {
  risk_score: number;
  status: string;
  feedback: string;
}

export interface StatementAnalysis {
  score: number;
  summary: string;
  structure_feedback: string;
  content_feedback: string;
  style_tone_feedback: string;
  plagiarism_check: PlagiarismCheck;
  key_strengths: string[];
  key_improvements: string[];
  actionable_tips: string[];
}

export interface UserInput {
  subject: string;
  university: string;
  statement: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}
