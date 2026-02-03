
export interface User {
  name: string;
  joinedAt: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  visualizationType?: 'ai-venn' | 'neural-net' | 'nlp-flow' | 'ethics-balance';
  recommendations?: CourseRecommendation[];
  citations?: string[];
}

export interface CourseRecommendation {
  title: string;
  module: string;
  description: string;
  linkText: string;
}

export interface KnowledgePair {
  question: string;
  answer: string;
  topic: string;
  relatedConcepts: string[];
}

export type ConversationFlow = 'nlp' | 'ethics' | 'cv' | 'fundamentals';
