# Agentic Workbench

A collaborative developer environment where humans and AI agents work together on tasks. This is a full UI mockup demonstrating all features and user flows.

## Features

- **Task Management**: Kanban-style task board with task creation, assignment, and tracking
- **Agent System**: Multiple AI agents with different personalities and task subscriptions
- **Live Session Shadowing**: Real-time terminal sessions with observe/guide modes
- **Human-in-the-Loop Review**: Mandatory review gates with code diff viewing and approval controls
- **Timeline & Activity Tracking**: Complete audit trail of all actions and decisions
- **Workspace Layout**: Cursor-like 4-pane interface with file tree, editor, agent console, and bottom panel

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Express.js, TypeScript
- **State Management**: Zustand
- **Code Editor**: Monaco Editor
- **Terminal**: xterm.js
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install frontend dependencies:
```bash
cd frontend
npm install
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:3001`

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

## Project Structure

```
ey-jumpstart/
├── frontend/          # Next.js application
│   ├── app/          # App Router pages
│   ├── components/   # React components
│   ├── store/        # Zustand state management
│   ├── types/        # TypeScript type definitions
│   └── lib/          # Utilities and API client
├── backend/          # Express API server
│   ├── src/
│   │   ├── routes/   # API routes
│   │   ├── services/ # Business logic
│   │   ├── models/   # Data models
│   │   └── data/     # Mock data
└── README.md
```

## User Flows

1. **Task Creation & Dispatch**: Create tasks from the Task Board, agents automatically pick them up
2. **Monitoring Task Execution**: View task details, timeline, and artifacts
3. **Live Session Shadowing**: Attach to agent sessions, switch between observe/guide modes
4. **HITL Review Gate**: Review code diffs, test results, and approve or request changes
5. **Post-Mortem Analysis**: View complete activity timeline and audit trail
6. **Agent Management**: View agent profiles, performance, and subscription rules

## Mock Data

The application uses comprehensive mock data to demonstrate all features:
- Sample tasks in various states (backlog, in progress, review, done)
- Multiple agents with different personalities
- Simulated execution timelines
- Code diffs and test results
- Terminal session history

## Development

This is a UI mockup - all data is stored in-memory and resets on server restart. The backend simulates a message bus and agent behavior for demonstration purposes.

## License

ISC

