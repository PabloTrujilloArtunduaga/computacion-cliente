import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js"
import { getTask, 
        getTasks,
        createTask,
        deleteTask,
        updateTask, 
        
    } from "../controllers/tasks.controller.js";

import { validateSchema } from '../middlewares/validator.middlewares.js'
import { createTaskSchema } from '../schema/task.schema.js'
const router = Router();

router.get('/tasks', authRequired, getTasks)
router.get('/tasks/:id', authRequired, getTasks)
router.post('/tasks', authRequired, validateSchema(createTaskSchema), createTask)
router.delete('/tasks/:id', authRequired, deleteTask)
router.put('/tasks/:id', authRequired, updateTask)
export default router