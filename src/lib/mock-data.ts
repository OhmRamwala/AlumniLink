import type { User, Job, NewsArticle, AppEvent, ForumThread, ForumReply, LinkedInPost } from './types';
import { Timestamp } from 'firebase/firestore';

export const mockUsers: User[] = [
  { id: '1', firstName: 'Rahul', lastName: 'Desai', email: 'rahul.desai@example.com', role: 'alumni', avatar: 'https://picsum.photos/seed/rahul/200', company: 'Google', position: 'Software Engineer', graduationYear: 2018, country: 'USA', about: 'Passionate about cloud architecture and open-source contributions. CKPCET Batch of 2018.', linkedin: '#', github: '#', department: 'CSE', enrollmentNo: '111' },
  { id: '2', firstName: 'Ankita', lastName: 'Raval', email: 'ankita.raval@example.com', role: 'alumni', avatar: 'https://picsum.photos/seed/ankita/200', company: 'Microsoft', position: 'Product Manager', graduationYear: 2015, country: 'USA', about: 'Focusing on building user-centric products at scale. Helping students navigate tech careers.', linkedin: '#', github: '#', department: 'CSE', enrollmentNo: '222' },
  { id: '3', firstName: 'Emily', lastName: 'Jones', email: 'emily.jones@example.com', role: 'student', avatar: 'https://picsum.photos/seed/user3/200', major: 'Computer Science', graduationYear: 2025, country: 'Canada', about: 'Aspiring full-stack developer with an interest in AI.', linkedin: '#', github: '#', department: 'CSE', enrollmentNo: '333' },
  { id: '4', firstName: 'Michael', lastName: 'Brown', email: 'michael.brown@example.com', role: 'alumni', avatar: 'https://picsum.photos/seed/user4/200', company: 'Apple', position: 'UX Designer', graduationYear: 2020, country: 'UK', about: 'Creating intuitive and beautiful user experiences.', linkedin: '#', github: '#', department: 'IT', enrollmentNo: '444' },
  { id: '5', firstName: 'Sarah', lastName: 'Davis', email: 'sarah.davis@example.com', role: 'student', avatar: 'https://picsum.photos/seed/user5/200', major: 'Business Administration', graduationYear: 2026, country: 'Australia', about: 'Interested in the intersection of business and technology.', linkedin: '#', github: '#', department: 'MBA', enrollmentNo: '555' },
  { id: '6', firstName: 'David', lastName: 'Miller', email: 'david.miller@example.com', role: 'alumni', avatar: 'https://picsum.photos/seed/user6/200', company: 'Amazon', position: 'Data Scientist', graduationYear: 2019, country: 'Germany', about: 'Turning data into actionable insights.', linkedin: '#', github: '#', department: 'CSE', enrollmentNo: '666' },
  { id: '7', firstName: 'Priya', lastName: 'Desai', email: 'priya.desai@example.com', role: 'alumni', avatar: 'https://picsum.photos/seed/priya/200', company: 'NASA', position: 'Senior AI Engineer', graduationYear: 2017, country: 'USA', about: 'Specializing in AI-driven navigation for space exploration missions. Proud CKPCET Alumna.', linkedin: '#', github: '#', department: 'IT', enrollmentNo: '777' },
  { id: '8', firstName: 'Kenji', lastName: 'Tanaka', email: 'kenji.tanaka@example.com', role: 'alumni', avatar: 'https://picsum.photos/seed/user8/200', company: 'Sony', position: 'Game Developer', graduationYear: 2021, country: 'Japan', about: 'Creating immersive gaming experiences.', linkedin: '#', github: '#', department: 'CSE', enrollmentNo: '888' },
];

export const mockLinkedInPosts: LinkedInPost[] = [
  {
    id: 'post-1',
    author: {
      name: 'Rahul Desai',
      avatar: 'https://picsum.photos/seed/rahul/200',
      headline: 'Software Engineer at Google | CKPCET Batch of 2018'
    },
    content: "Thrilled to share that I've started a new position as a Senior Software Engineer at Google! 🚀 It's been an incredible journey since my days at CKPCET. To the current students: consistency is key. Keep building and keep learning! #NewJob #GoogleLife #AlumniSuccess",
    likes: 342,
    comments: 45,
    timeAgo: '2h',
    imageUrl: 'https://picsum.photos/seed/office1/600/400'
  },
  {
    id: 'post-2',
    author: {
      name: 'Ankita Raval',
      avatar: 'https://picsum.photos/seed/ankita/200',
      headline: 'Product Manager at Microsoft'
    },
    content: "We just wrapped up our annual Hackathon at Microsoft! 💻 The level of innovation was truly inspiring. It reminded me of the technical fests we used to organize back at college. If any students are interested in Product Management roles, feel free to reach out for a chat! #Mentorship #TechLife #Microsoft",
    likes: 189,
    comments: 28,
    timeAgo: '5h',
    imageUrl: 'https://picsum.photos/seed/hackathon1/600/400'
  },
  {
    id: 'post-3',
    author: {
      name: 'Priya Desai',
      avatar: 'https://picsum.photos/seed/priya/200',
      headline: 'Senior AI Engineer at NASA'
    },
    content: "Extremely excited to share our team's progress on AI-driven autonomous navigation for the upcoming Artemis lunar mission! 🌑 Harnessing machine learning to solve challenges in deep space exploration is a dream come true. Engineering fundamentals I learned at CKPCET are still my strongest assets. #NASAAI #SpaceTech #Artemis",
    likes: 512,
    comments: 67,
    timeAgo: '1d',
    imageUrl: 'https://picsum.photos/seed/space1/600/400'
  }
];

export const mockJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Mechanical Design Engineer',
    company: 'Bosch Ltd.',
    location: 'Frankfrut, Germany',
    type: 'Internship',
    postedBy: { id: '1', firstName: 'Rahul', lastName: 'Desai' },
    shortDescription: 'Exciting opportunity to intern in Germany with R&D team focused on mechanical design, prototyping, and thermal system development.',
    fullDescription: `About the Role:
Bosch is seeking a passionate Mechanical Design Intern to join our R&D team in Frankfurt. You will work on cutting-edge automotive systems and assist in developing sustainable thermal management solutions.

Key Responsibilities:
- Design and simulate mechanical components using CAD software.
- Assist in prototyping and testing phases.
- Collaborate with cross-functional teams to optimize system performance.
- Document technical findings and report to senior engineers.

Preferred Requirements:
- Currently pursuing a degree in Mechanical Engineering.
- Strong knowledge of thermodynamics and fluid mechanics.
- Proficiency in SolidWorks or similar CAD tools.
- Excellent English communication skills.`,
    url: '#',
    postedAt: Timestamp.fromDate(new Date()),
  },
  {
    id: 'job-2',
    title: 'UI/UX Designer (Figma + Web Design)',
    company: 'Tata Consultancy Services',
    location: 'Surat, India',
    type: 'Full-time',
    postedBy: { id: '6', firstName: 'David', lastName: 'Miller' },
    shortDescription: 'Join our design studio in Surat to create modern, responsive web and mobile interfaces for global clients.',
    fullDescription: `About the Role:
TCS is looking for a UI/UX Designer to join our digital transformation team. You will be responsible for creating seamless user journeys and visually stunning designs for a variety of platforms.

Key Responsibilities:
- Conduct user research and translate insights into wireframes and prototypes.
- Design high-fidelity UI components using Figma.
- Collaborate with developers to ensure pixel-perfect implementation.
- Maintain and contribute to our design system.

Preferred Requirements:
- 2+ years of experience in digital product design.
- Portfolio showcasing strong visual design skills.
- Expert-level proficiency in Figma.
- Understanding of HTML/CSS is a plus.`,
    url: '#',
    postedAt: Timestamp.fromDate(new Date()),
  },
  {
    id: 'job-3',
    title: 'Junior Frontend Developer (React.js)',
    company: 'CodeNest Labs',
    location: 'Remote',
    type: 'Full-time',
    postedBy: { id: '7', firstName: 'Priya', lastName: 'Desai' },
    shortDescription: 'Join our engineering team to build modern, scalable frontend interfaces using React.js and integrate with real-time APIs.',
    fullDescription: `About the Role:
CodeNest Labs is hiring a Junior Frontend Developer to help us build the future of collaborative coding tools. This is a remote-first role with plenty of room for growth.

Key Responsibilities:
- Build reusable React components and frontend libraries.
- Optimize applications for maximum speed and scalability.
- Work closely with backend engineers to integrate RESTful APIs.
- Participate in code reviews and agile ceremonies.

Preferred Requirements:
- Proficiency in JavaScript/TypeScript and React.js.
- Familiarity with Tailwind CSS and modern UI libraries.
- Understanding of Git version control.
- Passion for learning new technologies.`,
    url: '#',
    postedAt: Timestamp.fromDate(new Date()),
  },
];

export const mockNews: NewsArticle[] = [
  {
    id: 'news-1',
    title: "High-Speed Dual-Band Wi-Fi Network Launched on Campus",
    source: 'Campus News',
    date: Timestamp.fromDate(new Date('2024-07-20')),
    summary: 'CKPCET upgrades campus connectivity with a 200 Mbps 5GHz Wi-Fi network installed across labs, hostels, and classrooms.',
    imageUrl: 'https://i.ibb.co/nMYDpSqd/1.png',
    content: `CKP College of Engineering & Technology has successfully deployed a state-of-the-art campus-wide Wi-Fi network. The upgrade includes dual-band routers providing up to 200 Mbps speeds, ensuring students and faculty have reliable access to digital resources in laboratories, classrooms, and residential areas. The project was inaugurated by the Principal, who highlighted the importance of high-speed connectivity in modern engineering education.`
  },
  {
    id: 'news-2',
    title: 'Alumna Priya Desai Joins NASA’s Artemis AI Team',
    source: 'Alumni Spotlight',
    date: Timestamp.fromDate(new Date('2024-07-18')),
    summary: 'Priya Desai, CKPCET alumna, joins NASA’s Artemis AI division as a Senior AI Engineer, contributing to the future of space technology.',
    imageUrl: 'https://i.ibb.co/Q7nft3BQ/s75-31690.webp',
    content: `We are immensely proud to share that Priya Desai (Batch of 2017, IT) has joined NASA's Jet Propulsion Laboratory as a Senior AI Engineer. She will be working with the Artemis mission team to develop autonomous navigation systems for lunar exploration. Priya's journey from our campus to the forefront of space exploration serves as a major inspiration for all our current students.`
  },
  {
    id: 'news-3',
    title: 'CKPCET Signs MoU with Google Cloud India',
    source: 'Corporate Relations',
    date: Timestamp.fromDate(new Date('2024-07-15')),
    summary: 'CKPCET collaborates with Google Cloud India to enhance cloud computing education and resources for students.',
    imageUrl: 'https://i.ibb.co/jv85ynhZ/google-anant-featured-760x570.jpg',
    content: `CKP College of Engineering & Technology has signed a Memorandum of Understanding (MoU) with Google Cloud India. This partnership will provide students with access to Google Cloud's learning platform, certification paths, and cloud credits for research projects. The collaboration aims to bridge the industry-academia gap by equipping students with in-demand cloud computing skills.`
  },
];

export const mockEvents: AppEvent[] = [
  {
    id: 'event-1',
    title: 'One Day Hands-on Workshop on Generative AI with Google Vertex AI',
    date: Timestamp.fromDate(new Date('2025-07-30')),
    time: '10:30 AM – 1:30 PM',
    location: 'D2 Seminar Hall',
    description: 'A flagship national-level technical symposium featuring paper presentations, project expos, and workshops on the latest technologies. A great platform for budding engineers to showcase their talent.',
    imageUrl: 'https://i.ibb.co/tfRpbgS/maxresdefault-2-Ih7q-Vdf-max-1300x1300.png',
    summary: 'A cutting-edge hands-on workshop on building real-world GenAI apps using Google Vertex AI, Gemini Pro, and PaLM API, led by a Google Cloud expert.',
    url: '#'
  },
  {
    id: 'event-2',
    title: 'One Day Workshop on Cyber Security',
    date: Timestamp.fromDate(new Date('2025-07-22')),
    time: '10:00 AM – 12:00 PM',
    location: 'D2 Seminar Hall',
    description: 'Join us for a one-day workshop on modern cybersecurity threats and defense mechanisms. Organized by the Computer & IT Engineering Department.',
    imageUrl: 'https://i.ibb.co/F4kkxs13/qqqqq.jpg',
    summary: 'A one-day workshop on Cyber Security organized by the Computer & IT Engineering Department, focusing on modern cybersecurity threats and defenses.',
    url: '#'
  },
  {
    id: 'event-3',
    title: 'One Day Workshop on Flutter App Development',
    date: Timestamp.fromDate(new Date('2025-07-15')),
    time: '11:00 AM – 2:00 PM',
    location: 'D7 Seminar Hall',
    description: 'Learn to build beautiful, fast, cross-platform mobile apps using Flutter and Dart, with hands-on training by a Google-certified developer.',
    imageUrl: 'https://i.ibb.co/JRL4t9PG/fds.jpg',
    summary: 'Learn to build beautiful, fast, cross-platform mobile apps using Flutter and Dart, with hands-on training by a Google-certified developer.',
    url: '#'
  },
];

const mockReplies: ForumReply[] = [
    { id: 'reply-1', postedBy: { id: '2', firstName: 'Ankita', lastName: 'Raval'}, content: 'Great question! My advice is to build a strong portfolio. Showcase your projects on GitHub and be able to talk about the design decisions you made.', postedAt: Timestamp.fromDate(new Date()) },
    { id: 'reply-2', postedBy: { id: '4', firstName: 'Michael', lastName: 'Brown'}, content: 'I totally agree with Ankita. Also, don\'t underestimate the power of networking. Reach out to alumni on this platform or LinkedIn for informational interviews.', postedAt: Timestamp.fromDate(new Date()) },
    { id: 'reply-3', postedBy: { id: '1', firstName: 'Rahul', lastName: 'Desai'}, content: 'Thanks, Ankita and Michael! This is super helpful. I\'ll definitely focus on my portfolio and start reaching out to people.', postedAt: Timestamp.fromDate(new Date()) },
];

export const mockThreads: ForumThread[] = [
  {
    id: '1',
    title: 'Career advice for new graduates in tech?',
    postedBy: { id: '3', firstName: 'Emily', lastName: 'Jones' },
    postedAt: Timestamp.fromDate(new Date()),
    lastActivity: Timestamp.fromDate(new Date()),
    content: 'I\'m graduating soon with a degree in Computer Science and would love to hear from alumni in the tech industry. What are some key skills I should focus on in my last year?',
    replyCount: 3,
  },
  {
    id: '2',
    title: 'Best cities for starting a career in Business?',
    postedBy: { id: '5', firstName: 'Sarah', lastName: 'Davis'},
    postedAt: Timestamp.fromDate(new Date()),
    lastActivity: Timestamp.fromDate(new Date()),
    content: 'Hi everyone, I\'m thinking about where to move after I finish my Business Administration degree. What cities do people recommend for good job opportunities?',
    replyCount: 0,
  },
  {
    id: '3',
    title: 'Organizing an alumni meetup in London - who is interested?',
    postedBy: { id: '4', firstName: 'Michael', lastName: 'Brown' },
    postedAt: Timestamp.fromDate(new Date()),
    lastActivity: Timestamp.fromDate(new Date()),
    content: 'Any alumni based in or around London interested in a casual meetup next month? Let me know if you\'re interested and what dates work best!',
    replyCount: 1,
  },
];