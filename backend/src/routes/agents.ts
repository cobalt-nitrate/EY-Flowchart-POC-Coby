import { Router } from 'express';
import { agentService } from '../services/agentService';

const router = Router();

router.get('/', (req, res) => {
  const agents = agentService.getAll();
  res.json(agents);
});

router.get('/:id', (req, res) => {
  const agent = agentService.getById(req.params.id);
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  res.json(agent);
});

router.post('/spawn', (req, res) => {
  const agent = agentService.spawn(req.body);
  res.status(201).json(agent);
});

router.patch('/:id', (req, res) => {
  const agent = agentService.update(req.params.id, req.body);
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  res.json(agent);
});

export default router;

