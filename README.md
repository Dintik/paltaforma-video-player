# Paltaforma Video Player

A modern video player platform built with Next.js, React, and MongoDB.

## Features

- Modern video player interface
- MongoDB database integration
- Dark/Light theme support
- TypeScript for type safety
- Tailwind CSS for styling
- State management with Zustand

## Tech Stack

- **Frontend Framework**: Next.js 15.1.4
- **UI Library**: React 19
- **Database**: MongoDB
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Type Checking**: TypeScript
- **Code Quality**: ESLint, Prettier

## Prerequisites

- Node.js
- MongoDB
- pnpm (recommended package manager)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
```

## Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd paltaforma-video-player
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

## Project Structure

```
src/
├── app/          # Next.js app directory
├── components/   # React components
├── config/       # Configuration files
├── hooks/        # Custom React hooks
├── lib/          # Library utilities
├── models/       # Database models
├── services/     # API services
├── store/        # Zustand store
├── types/        # TypeScript types
├── utils/        # Utility functions
└── assets/       # Static assets
```
