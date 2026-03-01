// Mock message bus simulation
// In a real implementation, this would connect to RabbitMQ or Kafka

import { Task } from '../models/Task';
import { Agent } from '../models/Agent';

interface Message {
  id: string;
  type: string;
  payload: any;
  timestamp: string;
}

const subscribers: Map<string, ((message: Message) => void)[]> = new Map();
const messageQueue: Message[] = [];

export const messageBus = {
  // Subscribe to message types
  subscribe: (messageType: string, callback: (message: Message) => void) => {
    if (!subscribers.has(messageType)) {
      subscribers.set(messageType, []);
    }
    subscribers.get(messageType)!.push(callback);
  },

  // Publish a message
  publish: (messageType: string, payload: any) => {
    const message: Message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      type: messageType,
      payload,
      timestamp: new Date().toISOString(),
    };

    messageQueue.push(message);

    // Notify subscribers
    const handlers = subscribers.get(messageType) || [];
    handlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        console.error('Error in message handler:', error);
      }
    });
  },

  // Agent polling simulation
  startAgentPolling: (agents: Agent[], tasks: Task[]) => {
    setInterval(() => {
      agents.forEach(agent => {
        if (agent.status === 'idle') {
          // Find tasks that match agent's subscriptions
          const eligibleTasks = tasks.filter(task => 
            task.status === 'backlog' &&
            agent.subscribedTaskTypes.includes(task.type)
          );

          if (eligibleTasks.length > 0) {
            const task = eligibleTasks[0];
            messageBus.publish('task.assigned', {
              taskId: task.id,
              agentId: agent.id,
            });
          }
        }
      });
    }, 5000); // Poll every 5 seconds
  },
};

