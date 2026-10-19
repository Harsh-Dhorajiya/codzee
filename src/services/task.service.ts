import { v4 as uuidv4 } from 'uuid';
import { ForbiddenError, NotFoundError } from '../errors/app.error';
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
   * Retrieve tasks belonging to the authenticated user with optional filtering and pagination.
   */
  public getAll(filters: TaskQueryFilters | undefined, ownerId: string): PaginatedTasksResult {
    // Multi-tenant scoping: Strictly isolate to current user's tasks
    let result = Array.from(this.tasks.values()).filter((task) => task.ownerId === ownerId);

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

    // 4. Sort newest first
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = result.length;

    // 5. Pagination
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;

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
   * Find a task by ID ensuring it belongs to the authenticated user (IDOR prevention).
   */
  public getById(id: string, ownerId: string): Task {
    const task = this.tasks.get(id);

    if (!task) {
      throw new NotFoundError(`Task with id '${id}' not found`);
    }

    if (task.ownerId !== ownerId) {
      throw new ForbiddenError('You do not have permission to access this task');
    }

    return { ...task };
  }

  /**
   * Create and persist a new task scoped to the authenticated user.
   */
  public create(dto: CreateTaskDTO, ownerId: string): Task {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: uuidv4(),
      title: dto.title.trim(),
      description: dto.description?.trim() ?? '',
      status: dto.status ?? 'todo',
      priority: dto.priority ?? 'medium',
      ownerId,
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.set(newTask.id, newTask);
    return { ...newTask };
  }

  /**
   * Update an existing task ensuring ownership verification (IDOR prevention).
   */
  public update(id: string, dto: UpdateTaskDTO, ownerId: string): Task {
    const existingTask = this.tasks.get(id);

    if (!existingTask) {
      throw new NotFoundError(`Task with id '${id}' not found`);
    }

    if (existingTask.ownerId !== ownerId) {
      throw new ForbiddenError('You do not have permission to modify this task');
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
   * Delete a task ensuring ownership verification (IDOR prevention).
   */
  public delete(id: string, ownerId: string): boolean {
    const existingTask = this.tasks.get(id);

    if (!existingTask) {
      throw new NotFoundError(`Task with id '${id}' not found`);
    }

    if (existingTask.ownerId !== ownerId) {
      throw new ForbiddenError('You do not have permission to delete this task');
    }

    return this.tasks.delete(id);
  }
}

// Export singleton instance for application use
export const taskService = new TaskService();
