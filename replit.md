# Overview

This is a modern e-commerce web application built with React, Express, and PostgreSQL. The system features a fashion-focused product catalog with categories including shoes, handbags, makeup, accessories, and clothing. It provides a complete shopping experience with product browsing, search, filtering, cart management, and checkout functionality.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built with React and TypeScript using Vite as the build tool. It follows a component-based architecture with the following key design decisions:

- **Routing**: Uses Wouter for lightweight client-side routing with pages for home, products, product details, and checkout
- **State Management**: Redux Toolkit for global state management, particularly for cart and product filters
- **Data Fetching**: TanStack React Query for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design
- **Styling**: Tailwind CSS with CSS custom properties for theming and responsive design
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

The application structure separates concerns with dedicated folders for components, pages, services, store, and hooks. The component library provides reusable UI elements while maintaining consistency across the application.

## Backend Architecture

The backend uses Express.js with TypeScript and follows a layered architecture:

- **API Layer**: RESTful endpoints for products, categories, and related operations
- **Storage Layer**: Abstracted storage interface (IStorage) with in-memory implementation for development
- **Data Layer**: Drizzle ORM with PostgreSQL schemas for type-safe database operations
- **Middleware**: Request logging, JSON parsing, and error handling

The storage abstraction allows for easy switching between different implementations (currently using MemStorage for development with sample data).

## Data Storage

The system uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations:

- **Products**: Core product information including name, type, price, descriptions, and images
- **Categories**: Hierarchical product categorization system
- **Product Images**: Multiple images per product with primary image designation
- **Product Attributes**: Flexible key-value attributes for product specifications
- **Users**: Basic user management structure

Database migrations are managed through Drizzle Kit with schema definitions shared between frontend and backend.

## Authentication and Authorization

The application has basic user schema defined but authentication is not fully implemented. The structure includes:

- User table with username/password fields
- Session management preparation with connect-pg-simple
- Login/registration UI components ready for integration

## External Dependencies

- **API Communication**: Axios for HTTP requests to Python backend API
- **Database**: Neon Database (PostgreSQL) for production data storage
- **UI Framework**: Radix UI for accessible component primitives
- **Styling**: Tailwind CSS for utility-first styling
- **Build Tools**: Vite for fast development and optimized production builds
- **Development**: Replit-specific plugins for development environment integration
- **Type Safety**: TypeScript throughout the stack with shared schemas
- **Validation**: Zod for runtime type validation and form schemas

## Recent Changes (January 2025)

- **API Integration**: Replaced built-in Express server with axios-based API client for Python backend
- **AI-Powered Search**: Enhanced search functionality with automatic detection of natural language queries
- **Environment Configuration**: Added support for VITE_API_URL environment variable to configure Python API endpoint
- **Search Intelligence**: Implemented smart routing between regular search and AI search based on query patterns
- **Visual Indicators**: Added AI search badges and animations to indicate when AI-powered search is active