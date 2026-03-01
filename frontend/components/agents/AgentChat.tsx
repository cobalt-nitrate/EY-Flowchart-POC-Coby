'use client';

import { useState } from 'react';
import { useAgentStore } from '@/store/agentStore';
import { Send, Bot, User } from 'lucide-react';

interface AgentChatProps {
  agentId: string;
}

export function AgentChat({ agentId }: AgentChatProps) {
  const { messages, addMessage } = useAgentStore();
  const [input, setInput] = useState('');
  const agentMessages = messages.get(agentId) || [];

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      agentId,
      role: 'human' as const,
      content: input,
      timestamp: new Date().toISOString(),
    };

    addMessage(agentId, newMessage);
    setInput('');

    // Simulate agent response
    setTimeout(() => {
      const agentResponse = {
        id: `msg-${Date.now()}`,
        agentId,
        role: 'agent' as const,
        content: `I understand. I'll work on that.`,
        timestamp: new Date().toISOString(),
      };
      addMessage(agentId, agentResponse);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {agentMessages.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-8">
            No messages yet. Start a conversation with the agent.
          </div>
        ) : (
          agentMessages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.role === 'human' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'agent' && (
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-blue-400" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.role === 'human'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-200'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
              {msg.role === 'human' && (
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-300" />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-700 p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

