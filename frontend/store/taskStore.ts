import { create } from 'zustand';
import { Task } from '@/types/task';
import { taskAPI } from '@/lib/api';

interface TaskStore {
  tasks: Task[];
  selectedTask: Task | null;
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  fetchTask: (id: string) => Promise<void>;
  createTask: (task: Partial<Task>) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  selectTask: (task: Task | null) => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  selectedTask: null,
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await taskAPI.getAll();
      set({ tasks, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchTask: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const task = await taskAPI.getById(id);
      set({ selectedTask: task, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createTask: async (taskData: Partial<Task>) => {
    set({ isLoading: true, error: null });
    try {
      const newTask = await taskAPI.create(taskData);
      set(state => ({
        tasks: [...state.tasks, newTask],
        isLoading: false,
      }));
      return newTask;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateTask: async (id: string, updates: Partial<Task>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTask = await taskAPI.update(id, updates);
      set(state => ({
        tasks: state.tasks.map(t => t.id === id ? updatedTask : t),
        selectedTask: state.selectedTask?.id === id ? updatedTask : state.selectedTask,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  selectTask: (task: Task | null) => {
    set({ selectedTask: task });
  },
}));

