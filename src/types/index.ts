export const UserRole = {
  USER: "USER",
  MODERATOR: "MODERATOR",
  ADMIN: "ADMIN",
} as const;

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role: keyof typeof UserRole;
  bio: string;
  goals: Goal[];
  joinedAt: string;
  badges: Badge[];
  isMentor?: boolean;
  specialization?: string;
}

export interface Goal {
  id: string;
  title: string;
  completed: boolean;
  category: "fitness" | "mindset" | "career" | "discipline" | "study";
  progress?: number; // 0 to 100
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
}

export type MediaType = "text" | "video" | "audio";

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
}

export interface Post {
  id: string;
  userId: string;
  authorUsername: string;
  authorName: string;
  authorAvatar: string;
  isMentor?: boolean;
  content: string;
  mediaType: MediaType;
  mediaUrl?: string;
  timestamp: string;
  encouragements: number;
  tags: string[];
  groupId?: string;
  comments?: Comment[];
}

export interface DiaryEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  isPublic: boolean;
  timestamp: string;
  mood?: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  category: string;
  membersCount: number;
  coverImage: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}
