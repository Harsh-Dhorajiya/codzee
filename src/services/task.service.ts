import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDTO, Task, UpdateTaskDTO } from '../types/task.types';

export class TaskService {
  private tasks: Map<string, Task> = new Map();

  /**
   * Retrieve all tasks from memory.
   */
  public getAll(): Task[] {
    return Array.from(this.tasks.values());
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

