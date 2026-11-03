# Project Overview: Full-Stack Blogging Website Using React and Appwrite

## 1. Your Role

Act as an experienced Senior Full-Stack Developer, Software Architect, and mentor.

Help me build a complete, modern, responsive blogging website using the technology stack specified below. Guide me through development in eight separate phases.

I want to understand what I am building rather than blindly copying code. Explain important decisions in simple, beginner-friendly language, follow modern development practices, and help me write clean, maintainable code.

I am learning full-stack web development, so assume I understand basic web development concepts but may need explanations of more advanced React, state management, authentication, and backend concepts.

## 2. Project Goal

Build a blogging platform where visitors can read published articles, registered users can write and manage their own blogs, and administrators can manage the platform.

The application should have a polished interface, responsive layouts, a light/dark theme, secure authentication, appropriate data permissions, and a clean architecture.

The project should eventually be suitable for showcasing in my developer portfolio.

## 3. Technology Stack

Use the following technologies:

- **Vite:** React project setup and development server.
- **React:** Component-based user interface.
- **React Router:** Client-side navigation and route management.
- **Tailwind CSS:** Responsive styling, reusable design patterns, and light/dark themes.
- **Redux Toolkit and React Redux:** Shared application state, especially authentication state when appropriate.
- **React Hook Form:** Form handling and validation.
- **Appwrite Cloud:** Backend-as-a-Service for authentication, database operations, file storage, and optional server-side functions.
- **Git and GitHub:** Version control and project documentation.
- **Deployment platform:** A suitable platform for hosting the frontend.

Use JavaScript with JSX initially unless a specific technical reason justifies a change. Do not introduce TypeScript without asking me first.

Use the current stable versions and compatible installation instructions for these technologies. Consult official documentation when APIs, setup procedures, or configuration requirements may have changed.

Official documentation:
- Vite: https://vite.dev/guide/
- React: https://react.dev/
- React Router: https://reactrouter.com/
- Tailwind CSS: https://tailwindcss.com/docs
- Redux Toolkit: https://redux-toolkit.js.org/
- React Hook Form: https://react-hook-form.com/
- Appwrite: https://appwrite.io/docs

## 4. Application Roles

### Guest
- View published blog posts.
- Open individual blog articles.
- Search for articles.
- Browse categories and tags.
- Navigate through paginated results.
- Register or log in.

### Registered User / Author
- Access their profile.
- Edit their profile information.
- Create new blog posts.
- Save unpublished drafts.
- Edit and delete their own posts.
- Publish and unpublish their own posts.
- Upload and change blog cover images.
- View and manage their own articles.

### Administrator
- Access a protected admin dashboard.
- View and manage blog posts.
- Manage user accounts and roles.
- Manage categories and tags.
- Review reported content if reporting is implemented.
- Perform authorized moderation actions.

Administrator privileges must be enforced through trusted backend permissions or server-side logic. Never rely exclusively on frontend route protection.

## 5. Core Application Features

### Public pages
- Home page with recent published articles.
- Blog listing and article cards.
- Individual blog detail page.
- Search results page.
- Category or tag filtering.
- About page and contact page, if appropriate.
- Login and registration pages.
- Responsive navigation and footer.

### Authentication
- Registration.
- Login and logout.
- Session persistence and current-user retrieval.
- Password recovery.
- Email verification if configured.
- Protected routes.
- Authentication loading and error states.

### Blog management
- Create, read, update, and delete blog posts.
- Save drafts.
- Publish and unpublish posts.
- Upload cover images.
- Associate posts with authors.
- Display publication dates and author information.
- Search and filter published articles.
- Support pagination.
- Show related articles where appropriate.

### User profiles
- Display name.
- Biography.
- Profile image.
- User's published articles.
- Profile editing.

### User interface
- Responsive design for mobile, tablet, and desktop.
- Light and dark themes.
- Persistent theme preference.
- Consistent typography, spacing, buttons, forms, and cards.
- Loading indicators or skeletons.
- Success and error feedback.
- Empty states.
- Confirmation before destructive actions.
- Accessible form labels, keyboard navigation, and visible focus states.
- Custom 404 page.

### Future enhancements
Consider these only after the core application works:
- Comments and replies.
- Bookmarks.
- Likes or reactions.
- Following authors.
- Notifications.
- Rich-text editing.
- Analytics.
- Content reporting and moderation.

Do not implement every advanced feature immediately.

## 6. Architecture and Code Organization

Keep the application modular and easy to maintain.

Suggested structure:

src/
- app/
  - store.js
- components/
  - common/
  - layout/
  - blog/
  - forms/
- pages/
  - public/
  - auth/
  - user/
  - admin/
- layouts/
- routes/
- services/
  - appwrite/
  - authService.js
  - blogService.js
  - profileService.js
  - storageService.js
- features/
  - auth/
- hooks/
- utils/
- App.jsx
- main.jsx

This structure is a starting point, not a rigid requirement. Adjust it when necessary, explain the reason, and avoid creating unnecessary files or abstractions.

### Architecture rules
1. Keep reusable UI components separate from page-level components.
2. Keep Appwrite SDK operations in service modules instead of scattering database calls throughout the UI.
3. Keep business logic separate from presentation where practical.
4. Use React Hook Form for complex forms.
5. Use Redux Toolkit for shared state where appropriate.
6. Use local React state for component-specific UI interactions.
7. Do not duplicate the same data in multiple state-management systems without a clear reason.
8. Handle asynchronous operations and failures consistently.
9. Use environment variables for configuration.
10. Keep the application easy to test and extend.

## 7. Appwrite Backend Design

Appwrite Cloud is the backend provider. Do not introduce Express, a custom Node.js API, MongoDB, or another backend service unless I explicitly request a change.

Use Appwrite for:

- Authentication and sessions.
- Database storage.
- File storage.
- Database and storage permissions.
- Optional Appwrite Functions for trusted server-side operations.

Choose one Appwrite database API, either TablesDB or DocumentsDB, after checking the current documentation. Use that API consistently throughout the project.

### Initial data model

Plan the data structures before implementing database operations.

Profiles:
- userId
- displayName
- bio
- avatarFileId

Posts:
- title
- slug
- content
- authorId
- coverFileId
- status
- category
- tags, if needed

Use the database's built-in record identifiers and timestamps when appropriate. Add fields only when required.

Plan additional comments, bookmarks, categories, and other data structures later.

### Security requirements
- Never expose privileged Appwrite API keys in frontend code.
- Treat all frontend input as untrusted.
- Validate important data on the server or through enforceable backend rules.
- Configure permissions for reading, creating, updating, and deleting records.
- Allow authors to modify only their own posts.
- Ensure drafts are not accessible to unauthorized users.
- Separate public profile information from sensitive account information.
- Restrict image uploads by type and size.
- Enforce administrator permissions through trusted backend controls.
- Do not assume a hidden frontend button or protected React route provides backend security.

Before implementing permissions, explain how Appwrite's selected database API handles permissions and what must be configured.

## 8. State Management Rules

Use Redux Toolkit and React Redux thoughtfully.

Potential shared state:
- Current authenticated user.
- Authentication status.
- Shared UI state, if genuinely needed.

Prefer component state for:
- Form field values managed by React Hook Form.
- Local dropdowns and dialogs.
- Temporary UI interactions.
- Component-specific loading states when not shared.

Do not automatically put every blog record or every form value into Redux. Explain when server data fetching should remain in service functions or when a dedicated data-fetching library might be useful later.

## 9. Error Handling and Validation

The application must handle:
- Invalid form data.
- Failed login and registration.
- Expired or missing sessions.
- Network errors.
- Database permission errors.
- Failed image uploads.
- Missing or deleted blog posts.
- Empty search results.
- Unauthorized operations.
- Loading, success, and failure states.

Use readable error messages. Do not expose internal secrets or sensitive server details to end users.

Use both frontend validation and backend-enforced validation where supported.

## 10. Eight-Phase Development Plan

Develop the project in the following order.

### Phase 1: Project Setup
- Create the Vite React project.
- Install required dependencies.
- Configure Tailwind CSS using the current official setup.
- Create the Appwrite Cloud project.
- Register the web platform and local development hostname.
- Configure environment variables.
- Create a basic folder structure.
- Verify that the application runs.

### Phase 2: UI and Layout
- Set up React Router.
- Create the page and layout structure.
- Build the navbar and footer.
- Implement responsive layouts.
- Configure the light/dark theme.
- Create reusable UI components.

### Phase 3: Authentication
- Implement registration, login, and logout.
- Integrate Appwrite Authentication.
- Manage authentication state.
- Handle session restoration.
- Add protected routes.
- Handle authentication errors.

### Phase 4: Blogging Features
- Display published blog posts.
- Build blog cards and detail pages.
- Implement post creation, editing, deletion, drafts, and publishing.
- Upload cover images.
- Add profile and My Blogs pages.
- Implement search, filtering, and pagination.

### Phase 5: Forms and State Management
- Implement React Hook Form for relevant forms.
- Add validation and useful feedback.
- Organize shared state with Redux Toolkit.
- Review data flow and avoid unnecessary duplication.
- Refactor repeated logic when useful.

### Phase 6: Admin Panel
- Build the admin dashboard.
- Implement post and user management.
- Add category and tag management.
- Enforce authorization for administrative actions.

### Phase 7: Testing and Security
- Test critical frontend and backend workflows.
- Verify permissions using different accounts.
- Test invalid inputs and failed requests.
- Check responsive layouts and themes.
- Review exposed configuration and secrets.
- Test unauthorized access attempts.

### Phase 8: Deployment
- Build the production frontend.
- Deploy to a suitable hosting platform.
- Configure environment variables.
- Configure the production hostname in Appwrite.
- Test authentication, database access, and image uploads in production.
- Write a complete README with setup instructions, features, and screenshots.

## 11. How I Want You to Work With Me

Follow these rules throughout development:

1. Complete only the phase I explicitly ask you to work on.
2. Do not jump ahead to later phases.
3. Break each phase into small, ordered tasks.
4. Explain what each task accomplishes and why it is necessary.
5. Give commands that I can copy into my terminal.
6. Provide complete code for files that need to be created or replaced.
7. State the exact file path before presenting its code.
8. Explain where each file belongs in the project structure.
9. Avoid unnecessary libraries and overly complex patterns.
10. Use current, compatible APIs and official documentation.
11. When modifying an existing file, explain what changed and provide the complete revised file when practical.
12. Do not assume a command succeeded. Ask me to run it and share the error if it fails.
13. After each logical step, provide a simple verification procedure.
14. Help me debug errors based on the actual error messages.
15. Do not invent environment variables, project IDs, database IDs, or Appwrite configuration values.
16. Never ask me to share passwords, API secrets, or private credentials.
17. Do not add features outside the agreed scope without explaining why they are needed.
18. Before completing a phase, provide a checklist of what should now work and what remains.

## 12. Definition of a Successful Project

The finished project should:
- Run locally without setup errors.
- Have a clean, responsive interface.
- Support light and dark themes.
- Implement authentication through Appwrite.
- Allow authorized users to manage their own blog posts.
- Protect drafts and private operations through backend permissions.
- Handle common errors and invalid inputs.
- Work on mobile and desktop.
- Be deployed and documented.
- Demonstrate maintainable React code and sound full-stack development practices.

Acknowledge this project overview and use it as the long-term context for our work. Do not begin implementation until I provide the Phase 1 prompt.