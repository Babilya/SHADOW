# API Documentation

This section contains comprehensive API documentation for SHADOW project services.

## QuantumX API

### Base URL
```
http://localhost:8000
```

### Authentication
Most endpoints require user authentication. Include the `userId` parameter in your requests.

### Rate Limiting
API requests are rate-limited to prevent abuse:
- 5 requests per second for general endpoints
- Higher limits for authenticated users

### Endpoints

#### Health Check
- `GET /` - Service health check
- `GET /health` - Detailed health information

#### Project Management
- `GET /projects?userId=ID` - List user projects
- `POST /projects` - Create a new project
- `GET /projects/:id?userId=ID` - Get project details
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id?userId=ID` - Delete project

#### Task Management
- `POST /projects/:id/tasks` - Add task to project
- `PUT /projects/:id/tasks/:taskId` - Update task
- `DELETE /projects/:id/tasks/:taskId?userId=ID` - Delete task

#### Statistics
- `GET /projects/stats?userId=ID` - Get project statistics

### Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": {},
  "message": "Optional message",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Error Handling

Error responses include:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## For More Details

See individual endpoint documentation in the `endpoints/` subdirectory.