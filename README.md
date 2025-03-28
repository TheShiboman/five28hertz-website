# Five28hertz Digital Platform

A comprehensive digital platform delivering an innovative ecosystem that connects purpose-driven brands with transformative client solutions through cutting-edge technology and design.

## Project Overview

Five28hertz is an innovation-focused company built around the concept of the 528Hz frequency - known as the "Miracle Tone" that resonates at the heart of everything. This digital platform serves as the central hub for the Five28hertz ecosystem, connecting multiple branded portals and showcasing the company's vision, projects, and community engagement opportunities.

## Key Features

- **Modern React/TypeScript Architecture**: Built with a robust tech stack for optimal performance and developer experience
- **Responsive Design**: Fully adaptive layouts for all devices with tailored mobile experiences
- **Multi-brand Portal System**: Unified platform with dedicated sub-portals for each brand
- **Firebase Authentication**: Secure user management with role-based access
- **AI Assistant Integration**: Contextual AI helpers for different user journeys
- **Multilingual Support**: Infrastructure for English, French, and Arabic localization
- **Google Analytics 4**: Advanced event tracking for CTAs and user engagement
- **Interactive Brand Showcases**: Immersive presentation of each branded initiative

## Brand Portals

The platform includes dedicated portals for the following Five28hertz brands:

- **QXT World**: Revolutionizing cue sports with real-time scoring, AI integration, and a global tournament ecosystem
- **Argento Homes**: Redefining modern real estate by integrating smart living, sustainable practices, and community-centered design
- **ExchangeSphere**: Creating a frictionless marketplace for global exchange of goods, services, and ideas
- **528Hz Blog & Podcast**: Content platform exploring transformation, innovation, and purpose through articles and audio

## Technology Stack

- **Frontend**: React with TypeScript, Tailwind CSS, Shadcn UI
- **Authentication**: Firebase Authentication
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: React Query, Context API
- **Routing**: Wouter for lightweight routing
- **Animations**: Framer Motion for fluid transitions
- **Styling**: Tailwind CSS with custom theming
- **Deployment**: Firebase Hosting with CI/CD pipeline

## Project Structure

```
/
├── client/             # Frontend React application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── contexts/   # React contexts for state management
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utility functions and services
│   │   ├── pages/      # Page components
│   │   └── styles/     # Global styles and theme
├── portals/            # Brand-specific portal implementations
│   ├── qxt-world/      # QXT World portal
│   ├── argento-homes/  # Argento Homes portal
│   ├── exchangesphere/ # ExchangeSphere portal
│   └── 528hz-blog-podcast/ # 528Hz Blog & Podcast portal
├── server/             # Backend Express server
│   ├── api/            # API route handlers
│   ├── lib/            # Server utilities
│   └── storage/        # Database interface
└── shared/             # Shared code between client and server
    └── schema.ts       # Database schema definitions
```

## Color Themes by Journey

The platform implements journey-specific color themes for different user pathways:

- **Visionary Innovator**: Teal Green (#06554E)
- **Investor Partner**: Deep Blue (#0D2747)
- **Community Member**: Golden Orange (#F28E1C)
- **Content Explorer**: Purple (#6A50A7)

## Portal Specific Brand Guidelines

### QXT World
- **Colors**: Deep blues (#0D2747, #1A3A66) and rich gold (#C8AA6E)
- **Theme**: Sophisticated, precise, premium

### Argento Homes
- **Colors**: Warm naturals and green (#4A6741)
- **Theme**: Sustainable, modern, community-focused

### ExchangeSphere
- **Colors**: Oceanic gradients (#1E6A7A, #3B5F9A)
- **Theme**: Global, fluid, innovative

### 528Hz Blog & Podcast
- **Colors**: Soothing purple palette (#6A50A7, #8B6AAD)
- **Theme**: Transformative, insightful, creative

## Getting Started

### Prerequisites
- Node.js v16+
- PostgreSQL
- Firebase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/TheShiboman/five28hertz-website.git
cd five28hertz-website
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```
DATABASE_URL=postgresql://...
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
VITE_GA_MEASUREMENT_ID=...
```

4. Start the development server
```bash
npm run dev
```

## Deployment

The project is configured for deployment to Firebase Hosting. The production site is available at https://five28hertz-a83f4.web.app/

## License

This project is proprietary and not open for redistribution or use without explicit permission from Five28hertz.