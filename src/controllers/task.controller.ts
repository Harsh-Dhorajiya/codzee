import { Request, Response, NextFunction } from 'express';
import { taskService, TaskService } from '../services/task.service';
import { CreateTaskInput, TaskQueryInput, UpdateTaskInput } from '../schemas/task.schema';

export class TaskController {
  constructor(private readonly service: TaskService = taskService) {}

  /**
   * GET /api/v1/tasks
   * Retrieve tasks belonging to the authenticated user.
   */
  public getAllTasks = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const filters = req.query as unknown as TaskQueryInput;
      const result = this.service.getAll(filters, userId);

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
   * Retrieve a single task by ID (scoped to owner).
   */
  public getTaskById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const task = this.service.getById(id, userId);

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
   * Create a new task assigned to the authenticated user.
   */
  public createTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const input = req.body as CreateTaskInput;
      const created = this.service.create(input, userId);

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
   * Update an existing task ensuring caller ownership.
   */
  public updateTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const input = req.body as UpdateTaskInput;
      const updated = this.service.update(id, input, userId);

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
   * Remove a task ensuring caller ownership.
   */
  public deleteTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      this.service.delete(id, userId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export const taskController = new TaskController();
