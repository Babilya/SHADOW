# QuantumX Monorepo

## Project Management (ПРОЕКТ)

QuantumX now includes a comprehensive project management system that allows users to create and manage projects with tasks.

### Bot Commands

- `/projects` - List all your projects
- `/newproject TITLE` - Create a new project
- `/project ID` - View project details
- `/addtask PROJECT_ID TITLE` - Add a task to a project
- `/complete PROJECT_ID TASK_ID` - Mark a task as completed
- `/projectstats` - View project statistics

### API Endpoints

- `GET /projects?userId=ID` - List user projects
- `POST /projects` - Create a new project
- `GET /projects/:id?userId=ID` - Get project details
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id?userId=ID` - Delete project
- `POST /projects/:id/tasks` - Add task to project
- `PUT /projects/:id/tasks/:taskId` - Update task
- `DELETE /projects/:id/tasks/:taskId?userId=ID` - Delete task
- `GET /projects/stats?userId=ID` - Get project statistics

### Features

- Create projects with title and description
- Add tasks to projects
- Mark tasks as completed
- Track project progress
- View statistics (total projects, active projects, completion rate)
- Integration with Telegram bot interface
