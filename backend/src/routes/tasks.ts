import { Router } from 'express';
import { taskService } from '../services/taskService';

const router = Router();

router.get('/', (req, res) => {
  const tasks = taskService.getAll();
  res.json(tasks);
});

router.get('/:id', (req, res) => {
  const task = taskService.getById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

router.post('/', (req, res) => {
  const task = taskService.create(req.body);
  res.status(201).json(task);
});

router.patch('/:id', (req, res) => {
  const task = taskService.update(req.params.id, req.body);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

router.delete('/:id', (req, res) => {
  const deleted = taskService.delete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.status(204).send();
});

export default router;

