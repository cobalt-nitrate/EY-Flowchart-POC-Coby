'use client';

import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  language?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}

export function CodeEditor({ value, language = 'typescript', onChange, readOnly = false }: CodeEditorProps) {
  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        language={language}
        value={value}
        theme="vs-dark"
        onChange={(val) => onChange?.(val || '')}
        options={{
          readOnly,
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
        }}
      />
    </div>
  );
}

