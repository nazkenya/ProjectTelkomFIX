# Account Management System

## Overview
This is a React + Vite frontend application for an Account Management System (Telkom Enterprise Solution). The application provides a comprehensive dashboard for managing customer accounts, account managers, sales plans, and customer relationships.

## Project Architecture

### Technology Stack
- **Frontend Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Routing**: React Router DOM 7.9.4
- **Styling**: Tailwind CSS 4.1.14
- **State Management**: React Context API (Auth)
- **HTTP Client**: Axios
- **Rich Text Editor**: React Quill
- **Icons**: Lucide React, React Icons
- **Data Export**: XLSX library

### Project Structure
- `/src/pages` - Main application pages (Dashboard, Customer Management, Account Managers, Activities, etc.)
- `/src/components` - Reusable UI components organized by feature
  - `/ui` - Generic UI components (Button, Card, Table, Modal, etc.)
  - `/layout` - Layout components (Header, Sidebar, Layout)
  - `/customer` - Customer-specific components
  - `/activities` - Activity management components
  - `/analysis` - Analysis-related components
  - `/wiki` - Wiki/documentation components
- `/src/services` - API service layer for backend communication
- `/src/auth` - Authentication context and logic
- `/src/routes` - Routing configuration
- `/src/api` - API client setup
- `/src/data` - Mock data for development

### Key Features
- User authentication with role-based access (Admin, Sales, Viewer, Manager)
- Customer management with detailed profiles
- Account manager dashboard
- Sales plan tracking and validation
- Contact management
- **Activity Management** - Comprehensive activity tracking system for sales activities
  - Create and manage sales activities (meetings, calls, visits, etc.)
  - Calendar and list views for activity visualization
  - Support for customer-related and internal activities
  - Invite other account managers and stakeholders
  - Upload proof of completion (photos) and Minutes of Meeting (MoM) files
  - Track activity status (upcoming, completed, needs update)
- Analytics and reporting
- Rich text editing for documentation
- Excel data export functionality

## Development Setup

### Prerequisites
- Node.js 20.x
- npm package manager

### Installation
Dependencies are already installed. To reinstall:
```bash
npm install
```

### Running the Application
The application is configured to run on port 5000:
```bash
npm run dev
```

The dev server is configured with:
- Host: 0.0.0.0 (accessible externally)
- Port: 5000
- Allowed hosts: true (for Replit proxy compatibility)

### Building for Production
```bash
npm run build
```

## Deployment
The application is configured for Replit Autoscale deployment:
- Build command: `npm run build`
- Run command: `npx vite preview --host 0.0.0.0 --port 5000`

## Backend Integration
The application expects a backend API running on `localhost:8000`. The API client is configured in:
- `/src/api/client.js` - Uses `VITE_API_BASE` environment variable
- `/src/services/amService.js` - Account manager service (expects Laravel backend)

Note: The backend is not included in this repository and needs to be set up separately.

## Environment Variables
- `VITE_API_BASE` - Base URL for API calls (optional, defaults to empty string for relative paths)

## Recent Changes
- **2025-11-07**: Activities Page Implementation
  - Created comprehensive activity management system for sales activities
  - Implemented calendar view with proper date/time handling
  - Implemented list view for easy activity browsing
  - Added activity creation form with all required fields (date, time, location, type, topic, description, invitees)
  - Built activity detail modal with proof and MoM upload functionality
  - Enhanced Badge component with warning variant
  - Fixed date/time bugs for proper timezone handling and status determination
  - Added route configuration for /aktivitas
  - Accessible to Admin and Sales roles

- **2025-11-07**: Initial Replit environment setup
  - Configured Vite for Replit (port 5000, host 0.0.0.0, allowedHosts: true)
  - Installed all dependencies
  - Set up frontend workflow
  - Configured deployment settings
  - Application successfully running and accessible

## Notes
- The application uses mock data for development (see `/src/data`)
- Authentication is handled through React Context
- The UI is fully responsive with Tailwind CSS
- Rich text editing capabilities for documentation/wiki features
