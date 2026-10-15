export interface FeedbackItem {
  id: string;
  recipientId: string;
  requestId?: string;
  requestTitle?: string;
  message: string;
  category: string;
  isRead: boolean;
  isDeleted: boolean;
  createdAt: string;
}

export interface FeedbackRequestItem {
  id: string;
  ownerId: string;
  title: string;
  question: string;
  category: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  feedbackCount?: number;
}

export interface FeedbackCategoryCount {
  category: string;
  count: number;
}
