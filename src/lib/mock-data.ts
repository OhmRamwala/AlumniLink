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
  { id: 'news-1', title: 'University Announces New Tech Campus', source: 'University Press', date: '2024-07-20', summary: 'A new state-of-the-art technology campus will open its doors to students in Fall 2025.', url: '/dashboard/news/news-1', imageUrl: 'https://placehold.co/600x400.png', content: `The university has announced the development of a brand new, state-of-the-art technology campus, set to open in the fall of 2025. This ambitious project aims to foster innovation and provide students with cutting-edge resources that mirror the fast-paced evolution of the tech industry.

The campus will feature modern laboratories equipped for research in artificial intelligence, robotics, and biotechnology. It will also house collaborative workspaces designed to encourage interdisciplinary projects, and an entrepreneurship hub to support student-led startups from conception to launch. "We are thrilled to provide our students with an environment that not only educates but also inspires the next wave of innovators," said the University President during the announcement ceremony. "This campus is a testament to our commitment to staying at the forefront of technological education."

The project is funded by a combination of government grants for educational infrastructure and generous donations from esteemed alumni who have made their mark in the technology sector. The university has launched a new fundraising campaign to equip the labs with the latest technology and to establish scholarships for students from underprivileged backgrounds who wish to enroll in the new programs.` },
  { id: 'news-2', title: 'Alumni Startup Receives $10M in Funding', source: 'TechCrunch', date: '2024-07-18', summary: 'Connectify, a startup founded by two alumni, has secured series A funding to expand its operations.', url: '/dashboard/news/news-2', imageUrl: 'https://placehold.co/600x400.png', content: `Connectify, a social networking platform for professionals founded by alumni Jane Doe (Class of 2018) and John Smith (Class of 2015), has successfully closed a $10 million Series A funding round. The round was led by Future Ventures, with significant participation from several angel investors, many of whom are also alumni of the university.

The company plans to use the capital injection to scale its engineering team, accelerate its expansion into European and Asian markets, and develop new features, including an AI-powered mentorship matching service. "This is a huge milestone for us, and it validates the hard work our team has put in," said CEO Jane Doe in a press release. "We are incredibly grateful for the support of our investors and the entire alumni community, which has been instrumental in our growth." Connectify has seen its user base grow by 300% in the last year, positioning it as a strong competitor in the professional networking space.` },
  { id: 'news-3', title: 'Annual Homecoming Gala Breaks Records', source: 'Alumni Association', date: '2024-07-15', summary: 'This year\'s homecoming gala was the most successful yet, with record attendance and funds raised.', url: '/dashboard/news/news-3', imageUrl: 'https://placehold.co/600x400.png', content: `The annual Homecoming Gala, held last Saturday at the Grand Ballroom, was a resounding success, breaking all previous records for attendance and fundraising. Over 500 alumni, faculty, and friends of the university gathered to celebrate, reconnect, and support the institution's future endeavors.

The event raised over $200,000 for student scholarships, thanks to the generosity of the attendees and corporate sponsors. The evening featured a moving keynote address from distinguished alumnus Michael Brown (Class of 2020), who spoke about the importance of giving back. A silent auction with items donated by alumni-owned businesses was a major highlight, contributing significantly to the total funds raised. The Alumni Association extends its heartfelt thanks to everyone who attended and contributed to making the night an unforgettable success. Planning for next year's gala is already underway.` },
];

export const mockEvents: AppEvent[] = [
  { id: 'event-1', title: 'Alumni Networking Night', date: '2024-08-15', time: '6:00 PM - 8:00 PM', location: 'Grand Ballroom', description: 'An exclusive event for alumni to connect with peers and industry leaders. Enjoy complimentary hors d\'oeuvres and refreshments while expanding your professional network.', imageUrl: 'https://placehold.co/600x400.png', summary: 'A great opportunity to expand your professional network.', url: '#' },
  { id: 'event-2', title: 'Webinar: The Future of AI', date: '2024-08-22', time: '12:00 PM - 1:00 PM', location: 'Online', description: 'Join a panel of industry experts, including our very own alumni, as they discuss the latest trends and future outlook of Artificial Intelligence. A Q&A session will follow the discussion.', imageUrl: 'https://placehold.co/600x400.png', summary: 'Learn about the future of AI from leading experts.', url: '#' },
  { id: 'event-3', title: 'Campus Career Fair', date: '2024-09-10', time: '10:00 AM - 4:00 PM', location: 'University Gymnasium', description: 'Open to all students and recent graduates. Meet with recruiters from over 50 top companies hiring for internships and full-time positions across various industries.', imageUrl: 'https://placehold.co/600x400.png', summary: 'Find your next career opportunity.', url: '#' },
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
