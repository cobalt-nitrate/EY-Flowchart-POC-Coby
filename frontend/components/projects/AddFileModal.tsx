'use client';

import { useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { X, File, Folder } from 'lucide-react';

interface AddFileModalProps {
  projectId: string;
  onClose: () => void;
  parentPath?: string;
}

export function AddFileModal({ projectId, onClose, parentPath = '/' }: AddFileModalProps) {
  const { addFile } = useProjectStore();
  const [fileType, setFileType] = useState<'file' | 'folder'>('file');
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;

    const fullPath = parentPath === '/' ? `/${fileName}` : `${parentPath}/${fileName}`;
    addFile(projectId, {
      path: fullPath,
      name: fileName,
      type: fileType,
      content: fileType === 'file' ? fileContent : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div
        className="bg-gray-800 rounded-lg w-full max-w-md mx-4 border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-gray-100">Add {fileType === 'file' ? 'File' : 'Folder'}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFileType('file')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded border transition-colors ${
                  fileType === 'file'
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <File className="w-4 h-4" />
                File
              </button>
              <button
                type="button"
                onClick={() => setFileType('folder')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded border transition-colors ${
                  fileType === 'folder'
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Folder className="w-4 h-4" />
                Folder
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {fileType === 'file' ? 'File' : 'Folder'} Name *
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-200 focus:outline-none focus:border-blue-500"
              placeholder={fileType === 'file' ? 'example.tsx' : 'folder-name'}
              required
            />
          </div>

          {/* Content (only for files) */}
          {fileType === 'file' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Content (optional)
              </label>
              <textarea
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-200 focus:outline-none focus:border-blue-500 font-mono text-sm"
                rows={8}
                placeholder="// File content..."
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm text-white"
            >
              Create {fileType === 'file' ? 'File' : 'Folder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

