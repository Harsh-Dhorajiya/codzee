import { Request, Response, NextFunction } from 'express';
import { taskService, TaskService } from '../services/task.service';
import {
  CreateTaskDTO,
  UpdateTaskDTO,
  VALID_PRIORITIES,
  VALID_STATUSES,
} from '../types/task.types';

export class TaskController {
  constructor(private readonly service: TaskService = taskService) {}

  /**
   * GET /api/v1/tasks
   * Retrieve all tasks.
   */
  public getAllTasks = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const tasks = this.service.getAll();
      res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/tasks/:id
   * Retrieve a single task by ID.
   */
  public getTaskById = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = req.params.id as string;
      const task = this.service.getById(id);

      if (!task) {
        res.status(404).json({
          success: false,
          message: `Task with id '${id}' not found`,
        });
        return;
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
   * Create a new task.
   */
  public createTask = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { title, description, status, priority } = req.body;

      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        res.status(400).json({
          success: false,
          message: 'Field "title" is required and must be a non-empty string',
        });
        return;
      }

      if (status !== undefined && !VALID_STATUSES.includes(status)) {
        res.status(400).json({
          success: false,
          message: `Invalid status '${status}'. Allowed values: ${VALID_STATUSES.join(', ')}`,
        });
        return;
      }

      if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
        res.status(400).json({
          success: false,
          message: `Invalid priority '${priority}'. Allowed values: ${VALID_PRIORITIES.join(', ')}`,
        });
        return;
      }

      const dto: CreateTaskDTO = {
        title,
        description,
        status,
        priority,
      };

      const created = this.service.create(dto);
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
   * Update an existing task.
   */
  public updateTask = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = req.params.id as string;
      const { title, description, status, priority } = req.body;

      if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
        res.status(400).json({
          success: false,
          message: 'Field "title" must be a non-empty string when provided',
        });
        return;
      }

      if (status !== undefined && !VALID_STATUSES.includes(status)) {
        res.status(400).json({
          success: false,
          message: `Invalid status '${status}'. Allowed values: ${VALID_STATUSES.join(', ')}`,
        });
        return;
      }

      if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
        res.status(400).json({
          success: false,
          message: `Invalid priority '${priority}'. Allowed values: ${VALID_PRIORITIES.join(', ')}`,
        });
        return;
      }

      const dto: UpdateTaskDTO = {
        title,
        description,
        status,
        priority,
      };

      const updated = this.service.update(id, dto);

      if (!updated) {
        res.status(404).json({
          success: false,
          message: `Task with id '${id}' not found`,
        });
        return;
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
  public deleteTask = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = req.params.id as string;
      const deleted = this.service.delete(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: `Task with id '${id}' not found`,
        });
        return;
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export const taskController = new TaskController();
