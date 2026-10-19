import { Router } from 'express';
import { taskController } from '../controllers/task.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import {
  createTaskSchema,
  taskIdParamSchema,
  taskQuerySchema,
  updateTaskSchema,
} from '../schemas/task.schema';

const router = Router();

// Protect all task endpoints with JWT authentication
router.use(authenticate);

router.get('/', validate(taskQuerySchema, 'query'), taskController.getAllTasks);

router.get('/:id', validate(taskIdParamSchema, 'params'), taskController.getTaskById);

router.post('/', validate(createTaskSchema, 'body'), taskController.createTask);

router.put(
  '/:id',
  validate(taskIdParamSchema, 'params'),
  validate(updateTaskSchema, 'body'),
  taskController.updateTask
);

router.delete('/:id', validate(taskIdParamSchema, 'params'), taskController.deleteTask);

export default router;
