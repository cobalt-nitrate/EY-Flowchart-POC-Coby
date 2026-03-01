'use client';

import { Review } from '@/types/task';
import { DiffViewer } from './DiffViewer';
import { ApprovalControls } from './ApprovalControls';
import { CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';

interface ReviewPanelProps {
  review: Review;
  taskId: string;
}

export function ReviewPanel({ review, taskId }: ReviewPanelProps) {
  const statusIcons = {
    pending: <AlertCircle className="w-5 h-5 text-yellow-400" />,
    approved: <CheckCircle className="w-5 h-5 text-green-400" />,
    changes_requested: <AlertCircle className="w-5 h-5 text-orange-400" />,
    blocked: <XCircle className="w-5 h-5 text-red-400" />,
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-700 p-4 bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {statusIcons[review.status]}
            <div>
              <h2 className="text-lg font-semibold text-gray-100">
                Review {review.status.replace('_', ' ').toUpperCase()}
              </h2>
              <p className="text-xs text-gray-400">
                Created {new Date(review.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Summary */}
        {review.summary && (
          <div className="bg-gray-800 rounded border border-gray-700 p-4">
            <h3 className="text-sm font-semibold text-gray-200 mb-2">Agent Summary</h3>
            <p className="text-sm text-gray-300">{review.summary}</p>
          </div>
        )}

        {/* Diffs */}
        {review.diffs.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-200 mb-3">Code Changes</h3>
            <div className="space-y-4">
              {review.diffs.map(diff => (
                <div key={diff.id} className="bg-gray-800 rounded border border-gray-700">
                  <div className="p-3 border-b border-gray-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">{diff.filePath}</span>
                  </div>
                  <DiffViewer diff={diff} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Test Results */}
        {review.testResults && (
          <div className="bg-gray-800 rounded border border-gray-700 p-4">
            <h3 className="text-sm font-semibold text-gray-200 mb-3">Test Results</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-semibold text-green-400">
                  {review.testResults.passed}
                </div>
                <div className="text-xs text-gray-400">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-red-400">
                  {review.testResults.failed}
                </div>
                <div className="text-xs text-gray-400">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-gray-300">
                  {review.testResults.total}
                </div>
                <div className="text-xs text-gray-400">Total</div>
              </div>
            </div>
            <div className="space-y-2">
              {review.testResults.details.map((test, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded text-sm ${
                    test.status === 'passed' ? 'bg-green-500/10 text-green-400' :
                    test.status === 'failed' ? 'bg-red-500/10 text-red-400' :
                    'bg-gray-700 text-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{test.name}</span>
                    <span className="text-xs">{test.duration}ms</span>
                  </div>
                  {test.message && (
                    <div className="text-xs mt-1 opacity-75">{test.message}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        {review.comments.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-200 mb-3">Comments</h3>
            <div className="space-y-2">
              {review.comments.map(comment => (
                <div
                  key={comment.id}
                  className="bg-gray-800 rounded border border-gray-700 p-3"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-300">
                      {comment.authorId}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Approval Controls */}
      {review.status === 'pending' && (
        <div className="border-t border-gray-700 p-4 bg-gray-800">
          <ApprovalControls reviewId={review.id} taskId={taskId} />
        </div>
      )}
    </div>
  );
}

