'use client';

import { useState } from 'react';
import { reviewAPI } from '@/lib/api';
import { CheckCircle, XCircle, AlertCircle, MessageSquare } from 'lucide-react';

interface ApprovalControlsProps {
  reviewId: string;
  taskId: string;
}

export function ApprovalControls({ reviewId, taskId }: ApprovalControlsProps) {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await reviewAPI.approve(taskId, reviewId);
      // Refresh task data
      window.location.reload();
    } catch (error) {
      console.error('Failed to approve:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestChanges = async () => {
    if (!comment.trim()) {
      alert('Please provide a comment explaining what changes are needed.');
      return;
    }
    setIsSubmitting(true);
    try {
      await reviewAPI.requestChanges(taskId, reviewId, [comment]);
      window.location.reload();
    } catch (error) {
      console.error('Failed to request changes:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlock = async () => {
    if (!comment.trim()) {
      alert('Please provide a reason for blocking.');
      return;
    }
    setIsSubmitting(true);
    try {
      await reviewAPI.block(taskId, reviewId, comment);
      window.location.reload();
    } catch (error) {
      console.error('Failed to block:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Comment Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Add Comment (optional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add your comments here..."
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
          rows={3}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleApprove}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm text-white"
        >
          <CheckCircle className="w-4 h-4" />
          Approve
        </button>
        <button
          onClick={handleRequestChanges}
          disabled={isSubmitting || !comment.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm text-white"
        >
          <AlertCircle className="w-4 h-4" />
          Request Changes
        </button>
        <button
          onClick={handleBlock}
          disabled={isSubmitting || !comment.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm text-white"
        >
          <XCircle className="w-4 h-4" />
          Block
        </button>
      </div>
    </div>
  );
}

