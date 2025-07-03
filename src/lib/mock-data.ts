import type { User, Job, NewsArticle, AppEvent, ForumThread, ForumReply } from './types';

export const mockUsers: User[] = [
  { id: '1', firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', role: 'alumni', avatar: '/avatars/01.png', company: 'Google', jobTitle: 'Software Engineer', graduationYear: 2018 },
  { id: '2', firstName: 'John', lastName: 'Smith', email: 'john.smith@example.com', role: 'alumni', avatar: '/avatars/02.png', company: 'Microsoft', jobTitle: 'Product Manager', graduationYear: 2015 },
  { id: '3', firstName: 'Emily', lastName: 'Jones', email: 'emily.jones@example.com', role: 'student', avatar: '/avatars/03.png', major: 'Computer Science', graduationYear: 2025 },
  { id: '4', firstName: 'Michael', lastName: 'Brown', email: 'michael.brown@example.com', role: 'alumni', avatar: '/avatars/04.png', company: 'Apple', jobTitle: 'UX Designer', graduationYear: 2020 },
  { id: '5', firstName: 'Sarah', lastName: 'Davis', email: 'sarah.davis@example.com', role: 'student', avatar: '/avatars/05.png', major: 'Business Administration', graduationYear: 2026 },
  { id: '6', firstName: 'David', lastName: 'Miller', email: 'david.miller@example.com', role: 'alumni', avatar: '/avatars/06.png', company: 'Amazon', jobTitle: 'Data Scientist', graduationYear: 2019 },
];

export const mockJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Frontend Developer',
    company: 'Innovate Inc.',
    location: 'Remote',
    type: 'Full-time',
    shortDescription: 'Join our team to build amazing user interfaces with React and Next.js.',
    fullDescription: 'Innovate Inc. is seeking a passionate Frontend Developer to join our dynamic team. The ideal candidate will have 3+ years of experience with modern JavaScript frameworks, particularly React and Next.js. You will be responsible for developing and maintaining web applications, collaborating with UI/UX designers, and ensuring the technical feasibility of UI/UX designs. A strong understanding of RESTful APIs, version control with Git, and responsive design principles is required. This is a great opportunity to work on cutting-edge technology in a collaborative environment.',
    url: 'https://example.com/job1',
  },
  {
    id: 'job-2',
    title: 'Data Analyst Intern',
    company: 'DataDriven Co.',
    location: 'New York, NY',
    type: 'Internship',
    shortDescription: 'An exciting internship opportunity for students passionate about data.',
    fullDescription: 'DataDriven Co. is looking for a Data Analyst Intern to help us make sense of our vast datasets. In this role, you will assist in collecting, cleaning, and analyzing data to provide actionable insights. You should be familiar with SQL and a statistical programming language like Python or R. Experience with data visualization tools such as Tableau or Power BI is a plus. This internship will provide you with hands-on experience in a real-world data environment. Candidates must be currently enrolled in a relevant undergraduate or graduate program.',
    url: 'https://example.com/job2',
  },
  {
    id: 'job-3',
    title: 'Backend Engineer',
    company: 'Secure Solutions',
    location: 'Austin, TX',
    type: 'Full-time',
    shortDescription: 'Develop robust and scalable backend systems using Node.js and PostgreSQL.',
    fullDescription: 'Secure Solutions is hiring a Backend Engineer to design, develop, and maintain our server-side logic. You will be working with Node.js, Express, and PostgreSQL to build secure and scalable APIs. The role requires experience with microservices architecture, database design, and cloud services like AWS or Google Cloud. You should be comfortable with writing unit and integration tests. A commitment to quality code and an understanding of security best practices are essential for this position. We offer competitive salary and benefits.',
    url: 'https://example.com/job3',
  },
];

export const mockNews: NewsArticle[] = [
  { id: 'news-1', title: 'University Announces New Tech Campus', source: 'University Press', date: '2024-07-20', summary: 'A new state-of-the-art technology campus will open its doors to students in Fall 2025.', url: '#', imageUrl: 'https://placehold.co/600x400', },
  { id: 'news-2', title: 'Alumni Startup Receives $10M in Funding', source: 'TechCrunch', date: '2024-07-18', summary: 'Connectify, a startup founded by two alumni, has secured series A funding to expand its operations.', url: '#', imageUrl: 'https://placehold.co/600x400', },
  { id: 'news-3', title: 'Annual Homecoming Gala Breaks Records', source: 'Alumni Association', date: '2024-07-15', summary: 'This year\'s homecoming gala was the most successful yet, with record attendance and funds raised.', url: '#', imageUrl: 'https://placehold.co/600x400', },
];

export const mockEvents: AppEvent[] = [
  { id: 'event-1', title: 'Alumni Networking Night', date: '2024-08-15', time: '6:00 PM - 8:00 PM', location: 'Grand Ballroom', description: 'Connect with fellow alumni from various industries.', imageUrl: 'https://placehold.co/600x400', },
  { id: 'event-2', title: 'Webinar: The Future of AI', date: '2024-08-22', time: '12:00 PM - 1:00 PM', location: 'Online', description: 'Join industry experts as they discuss the latest trends in Artificial Intelligence.', imageUrl: 'https://placehold.co/600x400', },
  { id: 'event-3', title: 'Campus Career Fair', date: '2024-09-10', time: '10:00 AM - 4:00 PM', location: 'University Gymnasium', description: 'Meet with top employers hiring for internships and full-time positions.', imageUrl: 'https://placehold.co/600x400', },
];

const mockReplies: ForumReply[] = [
    { id: 'reply-1', author: mockUsers[1], content: 'That\'s a great point, I hadn\'t considered that perspective.', timestamp: '2 hours ago' },
    { id: 'reply-2', author: mockUsers[2], content: 'I agree with John. The market is definitely shifting.', timestamp: '1 hour ago' },
];

export const mockThreads: ForumThread[] = [
  {
    id: 'thread-1',
    title: 'Career advice for new graduates in tech?',
    author: mockUsers[0],
    timestamp: '1 day ago',
    content: 'I\'m graduating soon and would love to hear from alumni in the tech industry. What are some key skills I should focus on? Any advice for landing the first job?',
    replies: mockReplies,
    replyCount: 2,
  },
  {
    id: 'thread-2',
    title: 'Best places to live after graduation?',
    author: mockUsers[4],
    timestamp: '3 days ago',
    content: 'Thinking about where to move after I finish my degree. What cities do people recommend for good job opportunities and a fun social scene?',
    replies: [],
    replyCount: 0,
  },
  {
    id: 'thread-3',
    title: 'Organizing an alumni meetup in London',
    author: mockUsers[5],
    timestamp: '5 days ago',
    content: 'Any alumni based in or around London interested in a casual meetup next month? Let\'s connect!',
    replies: [],
    replyCount: 0,
  },
];
