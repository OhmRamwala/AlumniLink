import type { User, Job, NewsArticle, AppEvent, ForumThread, ForumReply } from './types';

export const mockUsers: User[] = [
  { id: '1', firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', role: 'alumni', avatar: '/avatars/01.png', company: 'Google', position: 'Software Engineer', graduationYear: 2018, country: 'USA', about: 'Passionate about web technologies and open source.', linkedin: '#', github: '#' },
  { id: '2', firstName: 'John', lastName: 'Smith', email: 'john.smith@example.com', role: 'alumni', avatar: '/avatars/02.png', company: 'Microsoft', position: 'Product Manager', graduationYear: 2015, country: 'USA', about: 'Building products that users love.', linkedin: '#', github: '#' },
  { id: '3', firstName: 'Emily', lastName: 'Jones', email: 'emily.jones@example.com', role: 'student', avatar: '/avatars/03.png', major: 'Computer Science', graduationYear: 2025, country: 'Canada', about: 'Aspiring full-stack developer with an interest in AI.', linkedin: '#', github: '#' },
  { id: '4', firstName: 'Michael', lastName: 'Brown', email: 'michael.brown@example.com', role: 'alumni', avatar: '/avatars/04.png', company: 'Apple', position: 'UX Designer', graduationYear: 2020, country: 'UK', about: 'Creating intuitive and beautiful user experiences.', linkedin: '#', github: '#' },
  { id: '5', firstName: 'Sarah', lastName: 'Davis', email: 'sarah.davis@example.com', role: 'student', avatar: '/avatars/05.png', major: 'Business Administration', graduationYear: 2026, country: 'Australia', about: 'Interested in the intersection of business and technology.', linkedin: '#', github: '#' },
  { id: '6', firstName: 'David', lastName: 'Miller', email: 'david.miller@example.com', role: 'alumni', avatar: '/avatars/06.png', company: 'Amazon', position: 'Data Scientist', graduationYear: 2019, country: 'Germany', about: 'Turning data into actionable insights.', linkedin: '#', github: '#' },
  { id: '7', firstName: 'Priya', lastName: 'Patel', email: 'priya.patel@example.com', role: 'alumni', avatar: '/avatars/07.png', company: 'Netflix', position: 'Backend Engineer', graduationYear: 2017, country: 'India', about: 'Building scalable and resilient systems.', linkedin: '#', github: '#' },
  { id: '8', firstName: 'Kenji', lastName: 'Tanaka', email: 'kenji.tanaka@example.com', role: 'alumni', avatar: '/avatars/08.png', company: 'Sony', position: 'Game Developer', graduationYear: 2021, country: 'Japan', about: 'Creating immersive gaming experiences.', linkedin: '#', github: '#' },
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
    fullDescription: `About the Role:
Innovate Inc. is seeking a passionate Frontend Developer to join our dynamic team. You will be at the forefront of creating beautiful and functional web applications that our users love. This is a great opportunity to work on cutting-edge technology in a collaborative and supportive environment. We value creativity, problem-solving, and a desire to learn and grow.

Key Responsibilities:
- Develop and maintain web applications using React, Next.js, and TypeScript.
- Collaborate with UI/UX designers and product managers to translate concepts into production-ready features.
- Ensure the technical feasibility of UI/UX designs and optimize applications for maximum speed and scalability.
- Write clean, maintainable, and well-tested code.
- Participate in code reviews and contribute to our team's best practices.

Preferred Requirements:
- 3+ years of experience with modern JavaScript frameworks, particularly React and Next.js.
- Strong proficiency in HTML, CSS, and TypeScript.
- A strong understanding of RESTful APIs, version control with Git, and responsive design principles.
- Experience with testing frameworks like Jest or React Testing Library.
- Excellent communication and teamwork skills.

Benefits:
- Competitive salary and stock options.
- Comprehensive health, dental, and vision insurance.
- Unlimited paid time off.
- Remote-first work culture.`,
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
    fullDescription: `About the Role:
DataDriven Co. is looking for a motivated Data Analyst Intern to join our team for the summer. This is a paid internship that offers hands-on experience in a real-world data environment. You will work closely with our team of data scientists and analysts to help us make sense of our vast datasets and drive business decisions.

Key Responsibilities:
- Assist in collecting, cleaning, and preprocessing data from various sources.
- Perform exploratory data analysis to identify trends and patterns.
- Create dashboards and visualizations to communicate findings to stakeholders.
- Support the data team with ad-hoc analysis and reporting.

Preferred Requirements:
- Currently enrolled in an undergraduate or graduate program in a quantitative field like Statistics, Computer Science, Economics, or a related area.
- Familiarity with SQL and a statistical programming language like Python or R.
- Basic understanding of statistical concepts.
- Experience with data visualization tools such as Tableau or Power BI is a plus.
- Strong analytical and problem-solving skills.`,
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
    fullDescription: `About the Role:
Secure Solutions is hiring a Backend Engineer to design, develop, and maintain our server-side logic. You will be a key member of our engineering team, responsible for building the foundation of our products. We are looking for someone who is passionate about building secure, scalable, and resilient systems.

Key Responsibilities:
- Design, build, and maintain efficient, reusable, and reliable backend code using Node.js and Express.
- Develop and manage our PostgreSQL databases, including schema design and query optimization.
- Build and maintain RESTful APIs for our web and mobile applications.
- Work with microservices architecture and containerization technologies like Docker.
- Implement security and data protection best practices.

Preferred Requirements:
- 3+ years of backend development experience.
- Strong proficiency in Node.js and experience with frameworks like Express.
- Experience with relational databases, preferably PostgreSQL.
- Familiarity with cloud services (AWS, Google Cloud, or Azure).
- Commitment to writing high-quality, tested code.`,
    url: '#',
  },
];

export const mockNews: NewsArticle[] = [
  {
    id: 'news-1',
    title: "CKPCET Awarded 'Best Upcoming College'",
    source: 'The Times of India',
    date: '2024-07-20',
    summary: 'Recognized for outstanding contribution to technical education and fostering innovation among students.',
    url: '/dashboard/news/news-1',
    imageUrl: 'https://placehold.co/600x400.png',
    content: `CKP College of Engineering & Technology was recently awarded the prestigious 'Best Upcoming College' award by The Times of India. The award recognizes the institution's significant contributions to technical education, its commitment to academic excellence, and its success in fostering an environment of innovation. The college has been lauded for its state-of-the-art infrastructure, experienced faculty, and impressive placement record. The management extended its gratitude to the students, staff, and alumni for their continuous support.`
  },
  {
    id: 'news-2',
    title: 'Students Secure Top Ranks in Anna University Exams',
    source: 'University News',
    date: '2024-07-18',
    summary: 'Our students have once again made us proud with their excellent academic performance in the recent university examinations.',
    url: '/dashboard/news/news-2',
    imageUrl: 'https://placehold.co/600x400.png',
    content: `Students from various departments at CKPCET have secured top ranks in the latest Anna University semester examinations. This outstanding achievement is a testament to the hard work of the students and the dedication of the faculty. The college chairman congratulated the students on their success and announced scholarships for the top performers to encourage them further. This consistent academic excellence reinforces CKPCET's position as a leading institution for engineering education in the region.`
  },
  {
    id: 'news-3',
    title: 'New Robotics & AI Lab Inaugurated on Campus',
    source: 'CKPCET Press',
    date: '2024-07-15',
    summary: 'The new lab, equipped with state-of-the-art technology, will provide students with hands-on experience in emerging fields.',
    url: '/dashboard/news/news-3',
    imageUrl: 'https://placehold.co/600x400.png',
    content: `In a move to bolster research and practical learning in cutting-edge technologies, CKP College of Engineering & Technology has inaugurated a new Robotics and Artificial Intelligence Lab. The lab is equipped with the latest robotic arms, AI development kits, and high-performance computing resources. It will serve as a hub for students to work on innovative projects, participate in competitions, and develop skills that are highly sought after in the industry. The lab was inaugurated by a leading AI researcher and is now open for all students.`
  },
];

export const mockEvents: AppEvent[] = [
  {
    id: 'event-1',
    title: 'Innovate 2K24 - National Technical Symposium',
    date: '2024-09-15',
    time: '9:00 AM - 5:00 PM',
    location: 'CKPCET Campus, Cuddalore',
    description: 'A flagship national-level technical symposium featuring paper presentations, project expos, and workshops on the latest technologies. A great platform for budding engineers to showcase their talent.',
    imageUrl: 'https://placehold.co/600x400.png',
    summary: 'Showcase your technical skills at our national-level symposium.',
    url: '#'
  },
  {
    id: 'event-2',
    title: 'Alumni Reunion 2024',
    date: '2024-10-05',
    time: '10:00 AM - 4:00 PM',
    location: 'University Auditorium',
    description: 'Join us for a day of nostalgia, fun, and reconnection. Meet your old friends, interact with faculty, and see how the campus has grown. A day to cherish and make new memories.',
    imageUrl: 'https://placehold.co/600x400.png',
    summary: 'Reconnect with old friends and relive your college days.',
    url: '#'
  },
  {
    id: 'event-3',
    title: 'Campus Placement Drive: Wipro',
    date: '2024-09-25',
    time: '9:30 AM onwards',
    location: 'Placement Cell, CKPCET',
    description: 'Wipro is conducting an exclusive on-campus recruitment drive for final year students of all engineering branches. Come prepared to land your dream job.',
    imageUrl: 'https://placehold.co/600x400.png',
    summary: 'Exclusive recruitment drive by Wipro for final year students.',
    url: '#'
  },
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
