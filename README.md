# Regex Extraction UI

This is a [Next.js](https://nextjs.org) project that provides a user interface for regex pattern extraction and approval workflow. Users can create regex patterns, extract matches from documents, and approve individual matches.

## Features

- **Regex Management**: Create, edit, and delete regex patterns with validation
- **Document Processing**: Extract matches from documents using regex patterns
- **Approval Workflow**: Review and approve individual matches
- **Persistent Storage**: State managed with React Query and localStorage
- **Real-time Updates**: Automatic match updates when patterns change

## Getting Started

First, install dependencies:

```bash
npm install
```

Then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality
- `npm test` - Run tests with coverage
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI interface
- `npm run test:preview` - Preview tests with vitest-preview
- `npm run showcoverage` - Open test coverage report (macOS/Linux)
- `npm run showcoverage:windows` - Open test coverage report (Windows)

## Architecture

- React Query for syncing and updating local storage state, with optimistic updates
- Shadcn/ui for re-usable UI components with consistent good defaults, built on top of Radix UI
- React Hook Form and Zod for form handling and validation
- Vitest and React Testing Library for integration testing the core user flows

## Project Structure

```
app/
├── (home)/
│   ├── components/
│   │   ├── edit-mode.tsx
│   │   ├── approval-mode.tsx
│   │   ├── regex-form-dialog.tsx
│   │   └── sidebar.tsx
│   ├── page.tsx
│   └── HomePage.test.tsx
├── globals.css
└── layout.tsx
components/ui/          # shadcn/ui components
hooks/                  # Custom React hooks
├── useRegexStore.ts    # Regex pattern management
└── useDocumentStore.ts # Document and match management
lib/
└── utils.ts           # Utility functions
```

## Assumptions

- Documents are assumed to be small in size, but if they were not, some things to consider:
  - Server-side processing for regex matching, so the client does not have to handle the processing where hardware resources are unknown
  - Virtualization for the document content so that only the visible portion is rendered, improving performance
- If there are multiple matches for a regex pattern, it should only displayed once, I did think about adding a count attribute to indicate the number of matches, but it wasn't required for the task

## Development Notes

- I would favour testing local storage persistance in a browser environment, such as writing an e2e test with Playwright. But I didn't want to spend too much time on this task.
- If this were a production application, I would consider Storybook tests for the re-usable UI components, brought in from shadcn/ui in this case.
- Integration style tests are used to cover the core user flows, these often provide the most value and confidence in the application, therefore I have focused on these.
