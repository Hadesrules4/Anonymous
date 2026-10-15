export interface UserProfile {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
  isAcceptingFeedback: boolean;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  totalFeedback: number;
  totalRequests: number;
  unreadFeedback: number;
  thisWeekFeedback: number;
}
