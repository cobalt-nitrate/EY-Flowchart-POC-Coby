import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/tasks';
import agentRoutes from './routes/agents';
import sessionRoutes from './routes/sessions';
import flowchartRoutes from './routes/flowchart';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/flowchart', flowchartRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

