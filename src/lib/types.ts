import { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'alumni' | 'admin';
  country: string;
  about: string;
  enrollmentNo: string;
  department: string;
  avatar?: string;
  // Student specific
  major?: string;
  // Alumni specific
  graduationYear?: number;
  company?: string;
  position?: string;
  // Socials
  linkedin?: string;
  github?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Internship';
  shortDescription: string;
  fullDescription: string;
  url: string;
  postedBy: Pick<User, 'id' | 'firstName' | 'lastName'>;
  postedAt?: Timestamp;
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  date: Timestamp | Date | string;
  summary: string;
  url?: string;
  imageUrl: string;
  content: string;
}

export interface AppEvent {
  id: string;
  title: string;
  date: Timestamp | Date | string;
  time: string;
  location: string;
  description: string;
  imageUrl: string;
  summary: string;
  url: string;
}

export interface ForumReply {
  id: string;
  postedBy: Pick<User, 'id' | 'firstName' | 'lastName'>;
  content: string;
  postedAt: Timestamp;
}

export interface ForumThread {
  id: string;
  title: string;
  postedBy: Pick<User, 'id' | 'firstName' | 'lastName'>;
  postedAt: Timestamp;
  lastActivity: Timestamp;
  content: string;
  replyCount: number;
  imageUrl?: string;
  videoUrl?: string;
}

export interface DonationCampaign {
    id: string;
    title: string;
    description: string;
    goalAmount: number;
    currentAmount: number;
    imageUrl: string;
    createdAt: Timestamp;
}

export interface LinkedInPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    headline: string;
  };
  content: string;
  likes: number;
  comments: number;
  timeAgo: string;
  imageUrl?: string;
}