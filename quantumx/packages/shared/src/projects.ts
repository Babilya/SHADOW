import { UserId, Project, ProjectTask, ProjectSummary } from './types.js';

const userProjects = new Map<UserId, Map<string, Project>>();

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function ensureUserProjects(userId: UserId): Map<string, Project> {
  if (!userProjects.has(userId)) {
    userProjects.set(userId, new Map());
  }
  return userProjects.get(userId)!;
}

export function createProject(userId: UserId, title: string, description?: string): Project {
  if (!title.trim()) {
    throw new Error('Project title is required');
  }

  const projects = ensureUserProjects(userId);
  const now = new Date().toISOString();
  
  const project: Project = {
    id: generateId(),
    userId,
    title: title.trim(),
    description: description?.trim(),
    tasks: [],
    createdAt: now,
    updatedAt: now,
    status: 'active'
  };

  projects.set(project.id, project);
  return project;
}

export function getProject(userId: UserId, projectId: string): Project | null {
  const projects = userProjects.get(userId);
  return projects?.get(projectId) || null;
}

export function getUserProjects(userId: UserId): ProjectSummary[] {
  const projects = userProjects.get(userId);
  if (!projects) return [];

  return Array.from(projects.values()).map(project => ({
    id: project.id,
    title: project.title,
    description: project.description,
    taskCount: project.tasks.length,
    completedTasks: project.tasks.filter(t => t.completed).length,
    status: project.status,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt
  }));
}

export function updateProject(userId: UserId, projectId: string, updates: Partial<Pick<Project, 'title' | 'description' | 'status'>>): Project {
  const project = getProject(userId, projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  if (updates.title !== undefined) {
    if (!updates.title.trim()) {
      throw new Error('Project title cannot be empty');
    }
    project.title = updates.title.trim();
  }

  if (updates.description !== undefined) {
    project.description = updates.description?.trim();
  }

  if (updates.status !== undefined) {
    project.status = updates.status;
  }

  project.updatedAt = new Date().toISOString();
  return project;
}

export function deleteProject(userId: UserId, projectId: string): boolean {
  const projects = userProjects.get(userId);
  if (!projects) return false;
  
  return projects.delete(projectId);
}

export function addTask(userId: UserId, projectId: string, title: string, description?: string): ProjectTask {
  const project = getProject(userId, projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  if (!title.trim()) {
    throw new Error('Task title is required');
  }

  const task: ProjectTask = {
    id: generateId(),
    title: title.trim(),
    description: description?.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };

  project.tasks.push(task);
  project.updatedAt = new Date().toISOString();
  
  return task;
}

export function updateTask(userId: UserId, projectId: string, taskId: string, updates: Partial<Pick<ProjectTask, 'title' | 'description' | 'completed'>>): ProjectTask {
  const project = getProject(userId, projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  const task = project.tasks.find(t => t.id === taskId);
  if (!task) {
    throw new Error('Task not found');
  }

  if (updates.title !== undefined) {
    if (!updates.title.trim()) {
      throw new Error('Task title cannot be empty');
    }
    task.title = updates.title.trim();
  }

  if (updates.description !== undefined) {
    task.description = updates.description?.trim();
  }

  if (updates.completed !== undefined) {
    task.completed = updates.completed;
    if (updates.completed) {
      task.completedAt = new Date().toISOString();
    } else {
      task.completedAt = undefined;
    }
  }

  project.updatedAt = new Date().toISOString();
  return task;
}

export function deleteTask(userId: UserId, projectId: string, taskId: string): boolean {
  const project = getProject(userId, projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  const taskIndex = project.tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) {
    return false;
  }

  project.tasks.splice(taskIndex, 1);
  project.updatedAt = new Date().toISOString();
  return true;
}

export function getProjectStats(userId: UserId): { totalProjects: number; activeProjects: number; completedTasks: number; totalTasks: number } {
  const projects = userProjects.get(userId);
  if (!projects) {
    return { totalProjects: 0, activeProjects: 0, completedTasks: 0, totalTasks: 0 };
  }

  const projectArray = Array.from(projects.values());
  const totalProjects = projectArray.length;
  const activeProjects = projectArray.filter(p => p.status === 'active').length;
  
  let totalTasks = 0;
  let completedTasks = 0;
  
  for (const project of projectArray) {
    totalTasks += project.tasks.length;
    completedTasks += project.tasks.filter(t => t.completed).length;
  }

  return { totalProjects, activeProjects, completedTasks, totalTasks };
}