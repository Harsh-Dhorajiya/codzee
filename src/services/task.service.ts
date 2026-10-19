import { v4 as uuidv4 } from 'uuid';
import {
  CreateTaskDTO,
  PaginatedTasksResult,
  Task,
  TaskQueryFilters,
  UpdateTaskDTO,
} from '../types/task.types';

export class TaskService {
  private tasks: Map<string, Task> = new Map();

  /**
   * Retrieve tasks with optional filtering, search, and pagination.
   */
  public getAll(filters?: TaskQueryFilters): PaginatedTasksResult {
    let result = Array.from(this.tasks.values());

    // 1. Filter by status
    if (filters?.status) {
      result = result.filter((task) => task.status === filters.status);
    }

    // 2. Filter by priority
    if (filters?.priority) {
      result = result.filter((task) => task.priority === filters.priority);
    }

    // 3. Search query: case-insensitive match on title or description
    if (filters?.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
      );
    }

    // 4. Sort newest first by default
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = result.length;

    // 5. Pagination
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;

    // Note: If limit <= 0, totalPages results in Infinity or NaN (if total is 0).
    // If page <= 0, startIndex results in a negative offset for slice.
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedData = result.slice(startIndex, startIndex + limit).map((t) => ({ ...t }));

    return {
      data: paginatedData,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Find a specific task by its unique ID.
   */
  public getById(id: string): Task | null {
    const task = this.tasks.get(id);
    return task ? { ...task } : null;
  }

  /**
   * Create and persist a new task with defaults.
   */
  public create(dto: CreateTaskDTO): Task {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: uuidv4(),
      title: dto.title.trim(),
      description: dto.description?.trim() ?? '',
      status: dto.status ?? 'todo',
      priority: dto.priority ?? 'medium',
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.set(newTask.id, newTask);
    return { ...newTask };
  }

  /**
   * Update an existing task by ID.
   */
  public update(id: string, dto: UpdateTaskDTO): Task | null {
    const existingTask = this.tasks.get(id);
    if (!existingTask) {
      return null;
    }

    const updatedTask: Task = {
      ...existingTask,
      ...(dto.title !== undefined && { title: dto.title.trim() }),
      ...(dto.description !== undefined && { description: dto.description.trim() }),
      ...(dto.status !== undefined && { status: dto.status }),
      ...(dto.priority !== undefined && { priority: dto.priority }),
      updatedAt: new Date().toISOString(),
    };

    this.tasks.set(id, updatedTask);
    return { ...updatedTask };
  }

  /**
   * Delete a task by ID.
   */
  public delete(id: string): boolean {
    return this.tasks.delete(id);
  }
}

// Export singleton instance for application use
export const taskService = new TaskService();
