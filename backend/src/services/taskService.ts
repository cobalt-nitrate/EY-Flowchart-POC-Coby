import { Task } from '../models/Task';
import { getMockTasks } from '../data/mockData';

let tasks: Task[] = getMockTasks();

export const taskService = {
  getAll: (): Task[] => {
    return tasks;
  },

  getById: (id: string): Task | undefined => {
    return tasks.find(t => t.id === id);
  },

  create: (data: Partial<Task>): Task => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: data.title || 'Untitled Task',
      description: data.description || '',
      type: data.type || 'feature',
      priority: data.priority || 'medium',
      status: 'backlog',
      assignedAgents: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      artifacts: [],
      timeline: [],
      reviews: [],
      ...data,
    };
    tasks.push(newTask);
    return newTask;
  },

  update: (id: string, updates: Partial<Task>): Task | undefined => {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return undefined;

    tasks[index] = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return tasks[index];
  },

  delete: (id: string): boolean => {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
  },
};

