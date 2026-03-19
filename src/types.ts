export interface Team {
  _id: string;
  name: string;
  email: string;
  member1: string;
  member2?: string;
  scores: {
    quiz: number;
    logo: number;
    debug: number;
    optimization: number;
  };
  totalScore: number;
  createdAt: any;
  completedRounds?: string[];
}

export interface Logo {
  _id: string;
  imageUrl: string;
  answer: string;
}

export interface Coordinator {
  _id: string;
  name: string;
  photoUrl: string;
  role: string;
}

export interface Question {
  _id: string;
  roundId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  codeSnippet?: string;
  imageUrl?: string;
}

export interface RoundSetting {
  isActive: boolean;
  duration: number; // in seconds
  startTime?: number; // timestamp in milliseconds
}

export interface GlobalSettings {
  rounds: {
    quiz: RoundSetting;
    logo: RoundSetting;
    debug: RoundSetting;
    optimization: RoundSetting;
  };
}
