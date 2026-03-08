export const UserRole = {
  USER: "USER",
  MODERATOR: "MODERATOR",
  ADMIN: "ADMIN",
} as const;

export interface User {
  _id: string;
  name: string;
  username: string;
  avatar: string;
  role: keyof typeof UserRole;
  bio: string;
  goals: Goal[];
  isVerified: boolean;
  status: "active" | "inactive";
  isMentor: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  badges: Badge[];
}

export interface Goal {
  _id: string;
  title: string;
  completed: boolean;
  category: "fitness" | "mindset" | "career" | "discipline" | "study";
  progress?: number; // 0 to 100
}

export interface Badge {
  _id: string;
  name: string;
  icon: string;
}

export type MediaType = {
  url?: string;
  public_id?: string;
  mediaType?: "audio" | "video" | "image" | "none";
};

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
}

export interface Post {
  _id: string;
  userId: string;
  content: string;
  media: MediaType;
  visibility: "public" | "group" | "private";
  tags: string[];
  encouragements: number;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
  postBy: User;
}

export type DairyEntryInput = {
  title: string;
  content: string;
  isPrivate: boolean;
};

export type DairyEntryResponse = DairyEntryInput & {
  _id: string;
  userId: string;
  createdAt: Date;
  user?: {
    name: string;
    avatar: string;
  };
};

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
