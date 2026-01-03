
export enum JobCategory {
  CLEANING = 'Cleaning',
  PET_CARE = 'Pet Care',
  MOVING = 'Moving Help',
  REPAIRS = 'Minor Repairs',
  ELDERLY_AID = 'Elderly Aid',
  GROCERIES = 'Groceries'
}

export enum JobStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  isProvider: boolean;
  phone?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: JobCategory;
  price: number;
  seekerId: string;
  seekerName: string;
  seekerAvatar: string;
  status: JobStatus;
  urgency: 'Low' | 'Medium' | 'High';
  distance?: number;
  createdAt: string;
  location: {
    lat: number;
    lng: number;
  };
  providerId?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  jobId: string;
  jobTitle: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  messages: ChatMessage[];
  lastMessage?: string;
}
