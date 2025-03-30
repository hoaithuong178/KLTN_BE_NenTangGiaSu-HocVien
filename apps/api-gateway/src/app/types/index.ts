export interface IChatbotAnswerRequest {
  question: string;
  user_id: string;
  code: string;
}

export interface IRecommendTutorForStudentRequest {
  userId: string;
  top_n?: number;
  min_score?: number;
}

export interface IRecommendPostForStudentRequest {
  userId: string;
  limit?: number;
  min_score?: number;
}
