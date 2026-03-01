import { Router } from 'express';
import { sessionService } from '../services/sessionService';

const router = Router();

router.get('/', (req, res) => {
  const sessions = sessionService.getAll();
  res.json(sessions);
});

router.get('/:id', (req, res) => {
  const session = sessionService.getById(req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json(session);
});

router.post('/:id/attach', (req, res) => {
  const { userId } = req.body;
  const session = sessionService.attach(req.params.id, userId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json(session);
});

router.post('/:id/detach', (req, res) => {
  const { userId } = req.body;
  const session = sessionService.detach(req.params.id, userId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json(session);
});

router.patch('/:id/mode', (req, res) => {
  const { mode } = req.body;
  const session = sessionService.setMode(req.params.id, mode);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json(session);
});

router.post('/:id/command', (req, res) => {
  const { command } = req.body;
  const result = sessionService.sendCommand(req.params.id, command);
  if (!result) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json(result);
});

export default router;

