# GitHub Copilot Instructions for Clarity App

## Overview
This project is a React application built with TypeScript and Vite, utilizing AWS Amplify for authentication. The architecture is modular, with clear boundaries between the web app, services, and infrastructure.

## Architecture
- **Apps**: Contains the main web application.
- **Services**: Contains API services.
- **Infra**: Contains infrastructure as code (CDK).

### Key Components
- **Web App**: Located in `apps/web`, this is the main entry point for the application. The `src/main.tsx` file initializes the app and renders the `App` component.
- **Authentication**: Handled by AWS Amplify, configured in `src/lib/auth/amplify.ts`. Ensure environment variables for Cognito are set correctly.

## Developer Workflows
- **Building**: Use `pnpm build` to compile the application.
- **Testing**: Ensure tests are written in the `__tests__` directory and run them using `pnpm test`.
- **Debugging**: Utilize browser developer tools and console logs for debugging. Vite provides hot module replacement for a smooth development experience.

## Project Conventions
- **File Structure**: Follow the modular structure for components, services, and utilities. Each feature should have its own directory.
- **Naming Conventions**: Use PascalCase for components and camelCase for functions and variables.

## Integration Points
- **AWS Amplify**: Ensure to configure the Amplify library correctly in `src/lib/auth/amplify.ts` with the necessary environment variables.
- **Routing**: Use `react-router-dom` for navigation between components. Define routes in a centralized location for better maintainability.

## External Dependencies
- **Vite**: The build tool used for this project, providing fast development and build times.
- **React**: The core library for building user interfaces.
- **AWS Amplify**: Used for authentication and other AWS services integration.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **shadcn/ui**: High-quality React component library built on top of Tailwind CSS. Components are installed in `src/components/ui`.

## Examples
- **Component Example**: The `App` component in `src/App.tsx` demonstrates how to structure a basic React component with state management.
- **Vite Configuration**: The `vite.config.ts` file shows how to set up plugins and configurations for the Vite build process.

## Conclusion
These instructions should help AI agents understand the structure and workflows of the Clarity App. For any unclear sections, please provide feedback for further refinement.