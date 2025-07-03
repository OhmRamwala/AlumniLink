# **App Name**: AlumniLink

## Core Features:

- User Authentication: Login and signup pages for students and alumni with role-specific details. Note: Authentication will be handled by Firebase Auth (no backend or database is needed).
- Discussion Forum: A forum where users can start threads and reply to existing ones. (MVP focuses on UI/UX for forum interaction, avoiding database component for storing threads)
- Main Dashboard: Dashboard with navigation bar, news feed, event listings, main page, job board (linked externally), alumni directory (UI only), and logout button.
- News Feed Integration: Display news feed using content from an external RSS feed.
- Event Listings Integration: Display Events from an external calendar API. Note: MVP focuses on displaying data, not modifying it.
- Job Summary: Use an AI tool to automatically summarize job description content from external job board sources (MVP implementation focuses on a 'read more' to summarize job listing and linking out to external source)

## Style Guidelines:

- Primary color: A vibrant blue (#29ABE2) to represent connectivity and professionalism.
- Background color: A light gray (#F5F5F5) to provide a clean and modern backdrop.
- Accent color: An energetic orange (#FF8C00) to highlight key interactive elements.
- Body and headline font: 'Inter' sans-serif font for a clean and modern look.
- Use a set of clean, outline-style icons from a library like FontAwesome to represent different sections of the dashboard and forum actions.
- Utilize a grid-based layout with a sidebar navigation on the left and main content on the right for easy navigation. Keep page widths to a maximum of 1200px for readability.
- Incorporate subtle transition animations on page loads and interactive elements such as button hovers.