'use client';

import { CodeDiff } from '@/types/task';
import { CodeEditor } from '@/components/shared/CodeEditor';

interface DiffViewerProps {
  diff: CodeDiff;
}

export function DiffViewer({ diff }: DiffViewerProps) {
  // Generate unified diff format
  const generateUnifiedDiff = () => {
    let output = '';
    diff.hunks.forEach(hunk => {
      output += `@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@\n`;
      hunk.lines.forEach(line => {
        if (line.type === 'add') {
          output += `+${line.content}\n`;
        } else if (line.type === 'delete') {
          output += `-${line.content}\n`;
        } else {
          output += ` ${line.content}\n`;
        }
      });
    });
    return output;
  };

  const diffContent = generateUnifiedDiff();

  return (
    <div className="h-96 overflow-hidden">
      <CodeEditor
        value={diffContent}
        language="diff"
        readOnly={true}
      />
    </div>
  );
}

