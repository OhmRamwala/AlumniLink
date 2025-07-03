import type { User, Job, NewsArticle, AppEvent, ForumThread, ForumReply } from './types';

export const mockUsers: User[] = [
  { id: '1', firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', role: 'alumni', avatar: '/avatars/01.png', company: 'Google', jobTitle: 'Software Engineer', graduationYear: 2018, country: 'USA', about: 'Passionate about web technologies and open source.', linkedin: '#', github: '#' },
  { id: '2', firstName: 'John', lastName: 'Smith', email: 'john.smith@example.com', role: 'alumni', avatar: '/avatars/02.png', company: 'Microsoft', jobTitle: 'Product Manager', graduationYear: 2015, country: 'USA', about: 'Building products that users love.', linkedin: '#', github: '#' },
  { id: '3', firstName: 'Emily', lastName: 'Jones', email: 'emily.jones@example.com', role: 'student', avatar: '/avatars/03.png', major: 'Computer Science', graduationYear: 2025, country: 'Canada', about: 'Aspiring full-stack developer with an interest in AI.', linkedin: '#', github: '#' },
  { id: '4', firstName: 'Michael', lastName: 'Brown', email: 'michael.brown@example.com', role: 'alumni', avatar: '/avatars/04.png', company: 'Apple', jobTitle: 'UX Designer', graduationYear: 2020, country: 'UK', about: 'Creating intuitive and beautiful user experiences.', linkedin: '#', github: '#' },
  { id: '5', firstName: 'Sarah', lastName: 'Davis', email: 'sarah.davis@example.com', role: 'student', avatar: '/avatars/05.png', major: 'Business Administration', graduationYear: 2026, country: 'Australia', about: 'Interested in the intersection of business and technology.', linkedin: '#', github: '#' },
  { id: '6', firstName: 'David', lastName: 'Miller', email: 'david.miller@example.com', role: 'alumni', avatar: '/avatars/06.png', company: 'Amazon', jobTitle: 'Data Scientist', graduationYear: 2019, country: 'Germany', about: 'Turning data into actionable insights.', linkedin: '#', github: '#' },
  { id: '7', firstName: 'Priya', lastName: 'Patel', email: 'priya.patel@example.com', role: 'alumni', avatar: '/avatars/07.png', company: 'Netflix', jobTitle: 'Backend Engineer', graduationYear: 2017, country: 'India', about: 'Building scalable and resilient systems.', linkedin: '#', github: '#' },
  { id: '8', firstName: 'Kenji', lastName: 'Tanaka', email: 'kenji.tanaka@example.com', role: 'alumni', avatar: '/avatars/08.png', company: 'Sony', jobTitle: 'Game Developer', graduationYear: 2021, country: 'Japan', about: 'Creating immersive gaming experiences.', linkedin: '#', github: '#' },
];

export const mockJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Frontend Developer',
    company: 'Innovate Inc.',
    location: 'Remote',
    type: 'Full-time',
    postedBy: { id: '1', firstName: 'Jane', lastName: 'Doe' },
    shortDescription: 'Join our team to build amazing user interfaces with React and Next.js.',
    fullDescription: 'Innovate Inc. is seeking a passionate Frontend Developer to join our dynamic team. The ideal candidate will have 3+ years of experience with modern JavaScript frameworks, particularly React and Next.js. You will be responsible for developing and maintaining web applications, collaborating with UI/UX designers, and ensuring the technical feasibility of UI/UX designs. A strong understanding of RESTful APIs, version control with Git, and responsive design principles is required. This is a great opportunity to work on cutting-edge technology in a collaborative environment.',
    url: '#',
  },
  {
    id: 'job-2',
    title: 'Data Analyst Intern',
    company: 'DataDriven Co.',
    location: 'New York, NY',
    type: 'Internship',
    postedBy: { id: '6', firstName: 'David', lastName: 'Miller' },
    shortDescription: 'An exciting internship opportunity for students passionate about data.',
    fullDescription: 'DataDriven Co. is looking for a Data Analyst Intern to help us make sense of our vast datasets. In this role, you will assist in collecting, cleaning, and analyzing data to provide actionable insights. You should be familiar with SQL and a statistical programming language like Python or R. Experience with data visualization tools such as Tableau or Power BI is a plus. This internship will provide you with hands-on experience in a real-world data environment. Candidates must be currently enrolled in a relevant undergraduate or graduate program.',
    url: '#',
  },
  {
    id: 'job-3',
    title: 'Backend Engineer',
    company: 'Secure Solutions',
    location: 'Austin, TX',
    type: 'Full-time',
    postedBy: { id: '7', firstName: 'Priya', lastName: 'Patel' },
    shortDescription: 'Develop robust and scalable backend systems using Node.js and PostgreSQL.',
    fullDescription: 'Secure Solutions is hiring a Backend Engineer to design, develop, and maintain our server-side logic. You will be working with Node.js, Express, and PostgreSQL to build secure and scalable APIs. The role requires experience with microservices architecture, database design, and cloud services like AWS or Google Cloud. You should be comfortable with writing unit and integration tests. A commitment to quality code and an understanding of security best practices are essential for this position. We offer competitive salary and benefits.',
    url: '#',
  },
];

export const mockNews: NewsArticle[] = [
  { id: 'news-1', title: 'University Announces New Tech Campus', source: 'University Press', date: '2024-07-20', summary: 'A new state-of-the-art technology campus will open its doors to students in Fall 2025.', url: '/dashboard/news/news-1', imageUrl: 'https://placehold.co/600x400.png', content: 'The university has announced the development of a brand new, state-of-the-art technology campus, set to open in the fall of 2025. This ambitious project aims to foster innovation and provide students with cutting-edge resources. The campus will feature modern laboratories, collaborative workspaces, and an entrepreneurship hub to support student startups. "We are thrilled to provide our students with an environment that reflects the future of technology and learning," said the University President. The project is funded by a combination of government grants and generous donations from alumni.' },
  { id: 'news-2', title: 'Alumni Startup Receives $10M in Funding', source: 'TechCrunch', date: '2024-07-18', summary: 'Connectify, a startup founded by two alumni, has secured series A funding to expand its operations.', url: '/dashboard/news/news-2', imageUrl: 'https://placehold.co/600x400.png', content: 'Connectify, a social networking platform for professionals founded by alumni Jane Doe (Class of 2018) and John Smith (Class of 2015), has successfully closed a $10 million Series A funding round. The round was led by Future Ventures, with participation from several angel investors. The company plans to use the funds to scale its engineering team, expand into new markets, and develop new features to enhance user engagement. "This is a huge milestone for us," said CEO Jane Doe. "We are grateful for the support of our investors and the entire alumni community."' },
  { id: 'news-3', title: 'Annual Homecoming Gala Breaks Records', source: 'Alumni Association', date: '2024-07-15', summary: 'This year\'s homecoming gala was the most successful yet, with record attendance and funds raised.', url: '/dashboard/news/news-3', imageUrl: 'https://placehold.co/600x400.png', content: 'The annual Homecoming Gala, held last Saturday, was a resounding success, breaking all previous records for attendance and fundraising. Over 500 alumni and friends gathered to celebrate, reconnect, and support the university. The event raised over $200,000 for student scholarships, thanks to the generosity of the attendees and sponsors. The evening featured a keynote address from distinguished alumnus Michael Brown (Class of 2020), a silent auction, and live entertainment. The Alumni Association extends its heartfelt thanks to everyone who made the night unforgettable.' },
];

export const mockEvents: AppEvent[] = [
  { id: 'event-1', title: 'Alumni Networking Night', date: '2024-08-15', time: '6:00 PM - 8:00 PM', location: 'Grand Ballroom', description: 'Connect with fellow alumni from various industries.', imageUrl: 'https://placehold.co/600x400.png', summary: 'A great opportunity to expand your professional network.', url: '#' },
  { id: 'event-2', title: 'Webinar: The Future of AI', date: '2024-08-22', time: '12:00 PM - 1:00 PM', location: 'Online', description: 'Join industry experts as they discuss the latest trends in Artificial Intelligence.', imageUrl: 'https://placehold.co/600x400.png', summary: 'Learn about the future of AI from leading experts.', url: '#' },
  { id: 'event-3', title: 'Campus Career Fair', date: '2024-09-10', time: '10:00 AM - 4:00 PM', location: 'University Gymnasium', description: 'Meet with top employers hiring for internships and full-time positions.', imageUrl: 'https://placehold.co/600x400.png', summary: 'Find your next career opportunity.', url: '#' },
];

const mockReplies: ForumReply[] = [
    { id: 'reply-1', author: mockUsers[1], content: 'Great question! My advice is to build a strong portfolio. Showcase your projects on GitHub and be able to talk about the design decisions you made. It matters more than your grades in many cases.', timestamp: '22 hours ago' },
    { id: 'reply-2', author: mockUsers[3], content: 'I totally agree with John. Also, don\'t underestimate the power of networking. Reach out to alumni on this platform or LinkedIn for informational interviews. Most people are happy to help.', timestamp: '15 hours ago' },
    { id: 'reply-3', author: mockUsers[0], content: 'Thanks, John and Michael! This is super helpful. I\'ll definitely focus on my portfolio and start reaching out to people.', timestamp: '1 hour ago' },
];

export const mockThreads: ForumThread[] = [
  {
    id: '1',
    title: 'Career advice for new graduates in tech?',
    author: mockUsers[2],
    timestamp: '1 day ago',
    content: 'I\'m graduating soon with a degree in Computer Science and would love to hear from alumni in the tech industry. What are some key skills I should focus on in my last year? Any advice for landing that first job out of college?',
    replies: mockReplies,
    replyCount: 3,
  },
  {
    id: '2',
    title: 'Best cities for starting a career in Business?',
    author: mockUsers[4],
    timestamp: '3 days ago',
    content: 'Hi everyone, I\'m thinking about where to move after I finish my Business Administration degree. What cities do people recommend for good job opportunities and a fun social scene for young professionals? I\'m considering places in the USA and Canada.',
    replies: [],
    replyCount: 0,
  },
  {
    id: '3',
    title: 'Organizing an alumni meetup in London - who is interested?',
    author: mockUsers[3],
    timestamp: '5 days ago',
    content: 'Any alumni based in or around London interested in a casual meetup next month? Thinking of a pub in the central London area. It would be great to connect and network. Let me know if you\'re interested and what dates work best!',
    replies: [
        { id: 'reply-4', author: mockUsers[5], content: 'I\'m in! Great idea.', timestamp: '4 days ago' },
    ],
    replyCount: 1,
  },
];
