import { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'alumni' | 'admin';
  avatar: string;
  major?: string;
  graduationYear?: number;
  company?: string;
  jobTitle?: string;
  country: string;
  about?: string;
  linkedin?: string;
  github?: string;
  cvUrl?: string;
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
  author: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatar'>;
  content: string;
  timestamp: string;
}

export interface ForumThread {
  id: string;
  title: string;
  author: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatar'>;
  timestamp: string;
  content: string;
  replies: ForumReply[];
  replyCount: number;
  imageUrl?: string;
  videoUrl?: string;
  externalUrl?: string;
}
