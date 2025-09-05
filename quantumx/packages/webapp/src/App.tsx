import { useState, useEffect } from 'react'
import './App.css'

interface Project {
  id: string;
  title: string;
  description?: string;
  taskCount: number;
  completedTasks: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

interface ProjectDetails extends Omit<Project, 'taskCount' | 'completedTasks'> {
  userId: string;
  tasks: Task[];
}

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectDetails | null>(null);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId] = useState('webapp-user'); // In real app, get from Telegram WebApp

  const API_BASE = '/api'; // Assuming bot API is proxied

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/projects?userId=${userId}`);
      const data = await response.json();
      if (data.ok) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    if (!newProjectTitle.trim()) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, title: newProjectTitle.trim() }),
      });
      const data = await response.json();
      if (data.ok) {
        setNewProjectTitle('');
        loadProjects();
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProjectDetails = async (projectId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/projects/${projectId}?userId=${userId}`);
      const data = await response.json();
      if (data.ok) {
        setSelectedProject(data.project);
      }
    } catch (error) {
      console.error('Failed to load project details:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTaskTitle.trim() || !selectedProject) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/projects/${selectedProject.id}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, title: newTaskTitle.trim() }),
      });
      const data = await response.json();
      if (data.ok) {
        setNewTaskTitle('');
        loadProjectDetails(selectedProject.id);
      }
    } catch (error) {
      console.error('Failed to add task:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskId: string, completed: boolean) => {
    if (!selectedProject) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/projects/${selectedProject.id}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, completed }),
      });
      const data = await response.json();
      if (data.ok) {
        loadProjectDetails(selectedProject.id);
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quantumx-app">
      <header className="app-header">
        <h1>🚀 QuantumX</h1>
        <p>Кібер-платформа нового покоління</p>
      </header>

      {!selectedProject ? (
        <div className="projects-view">
          <div className="new-project">
            <h2>📋 Створити новий проект</h2>
            <div className="input-group">
              <input
                type="text"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                placeholder="Назва проекту"
                onKeyPress={(e) => e.key === 'Enter' && createProject()}
              />
              <button onClick={createProject} disabled={loading}>
                ✨ Створити
              </button>
            </div>
          </div>

          <div className="projects-list">
            <h2>📊 Ваші проекти</h2>
            {loading && <p>Завантаження...</p>}
            {projects.length === 0 && !loading && (
              <p>У вас поки немає проектів. Створіть перший!</p>
            )}
            {projects.map((project) => (
              <div
                key={project.id}
                className="project-card"
                onClick={() => loadProjectDetails(project.id)}
              >
                <h3>{project.title}</h3>
                <p>📈 {project.completedTasks}/{project.taskCount} завдань</p>
                <p>📅 {project.status.toUpperCase()}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="project-details">
          <button className="back-btn" onClick={() => {
            setSelectedProject(null);
            loadProjects();
          }}>
            ← Назад до проектів
          </button>
          
          <h2>📋 {selectedProject.title}</h2>
          {selectedProject.description && <p>{selectedProject.description}</p>}
          
          <div className="add-task">
            <h3>➕ Додати завдання</h3>
            <div className="input-group">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Назва завдання"
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
              />
              <button onClick={addTask} disabled={loading}>
                ✅ Додати
              </button>
            </div>
          </div>

          <div className="tasks-list">
            <h3>📝 Завдання</h3>
            {selectedProject.tasks.length === 0 && (
              <p>Немає завдань. Додайте перше!</p>
            )}
            {selectedProject.tasks.map((task) => (
              <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={(e) => toggleTask(task.id, e.target.checked)}
                />
                <span className="task-title">{task.title}</span>
                <span className="task-status">
                  {task.completed ? '✅' : '⭕'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
