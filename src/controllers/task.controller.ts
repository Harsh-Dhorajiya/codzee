import { Request, Response, NextFunction } from 'express';
import { taskService, TaskService } from '../services/task.service';
import { NotFoundError } from '../errors/app.error';
import { CreateTaskInput, TaskQueryInput, UpdateTaskInput } from '../schemas/task.schema';

export class TaskController {
  constructor(private readonly service: TaskService = taskService) {}

  /**
   * GET /api/v1/tasks
   * Retrieve tasks with filtering, search, and pagination.
   */
  public getAllTasks = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const filters = req.query as unknown as TaskQueryInput;
      const result = this.service.getAll(filters);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/tasks/:id
   * Retrieve a single task by ID.
   */
  public getTaskById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      const task = this.service.getById(id);

      if (!task) {
        throw new NotFoundError(`Task with id '${id}' not found`);
      }

      res.status(200).json({
        success: true,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/tasks
   * Create a new task with validated payload.
   */
  public createTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const input = req.body as CreateTaskInput;
      const created = this.service.create(input);

      res.status(201).json({
        success: true,
        data: created,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/v1/tasks/:id
   * Update an existing task with validated payload.
   */
  public updateTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      const input = req.body as UpdateTaskInput;
      const updated = this.service.update(id, input);

      if (!updated) {
        throw new NotFoundError(`Task with id '${id}' not found`);
      }

      res.status(200).json({
        success: true,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/v1/tasks/:id
   * Remove a task by ID.
   */
  public deleteTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      const deleted = this.service.delete(id);

      if (!deleted) {
        throw new NotFoundError(`Task with id '${id}' not found`);
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export const taskController = new TaskController();
