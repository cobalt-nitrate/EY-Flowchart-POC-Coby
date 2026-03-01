'use client';

import { saveAs } from 'file-saver';
import { Download } from 'lucide-react';
import { DiagramGraph } from '@/types/flowchart';

interface ExportControlsProps {
  graph: DiagramGraph | null;
}

function diagramToMermaid(graph: DiagramGraph): string {
  const lines: string[] = [];

  if (graph.type === 'decision_tree' || graph.type === 'process_flow') {
    lines.push('flowchart TD');
  } else {
    lines.push('flowchart LR');
  }

  for (const node of graph.nodes) {
    const label = node.label.replace(/"/g, "'");
    if (node.type === 'decision') {
      lines.push(`  ${node.id}{{"${label}"}}`);
    } else if (node.type === 'start' || node.type === 'end') {
      lines.push(`  ${node.id}(("${label}"))`);
    } else if (node.type === 'database') {
      lines.push(`  ${node.id}[("${label}")]`);
    } else {
      lines.push(`  ${node.id}["${label}"]`);
    }
  }

  for (const edge of graph.edges) {
    const lbl = edge.label ? `|"${edge.label}"|` : '';
    lines.push(`  ${edge.source} -->${lbl} ${edge.target}`);
  }

  return lines.join('\n');
}

async function exportAsPNG(title: string) {
  const { default: html2canvas } = await import('html2canvas');
  const el = document.querySelector('.react-flow') as HTMLElement;
  if (!el) return;
  const canvas = await html2canvas(el, { backgroundColor: '#030712', scale: 2 });
  canvas.toBlob((blob) => { if (blob) saveAs(blob, `${title}.png`); });
}

export default function ExportControls({ graph }: ExportControlsProps) {
  const title = graph?.title || 'flowchart';

  const exportJSON = () => {
    if (!graph) return;
    const blob = new Blob([JSON.stringify(graph, null, 2)], { type: 'application/json' });
    saveAs(blob, `${title}.json`);
  };

  const exportMermaid = () => {
    if (!graph) return;
    const mmd = diagramToMermaid(graph);
    const blob = new Blob([mmd], { type: 'text/plain' });
    saveAs(blob, `${title}.mmd`);
  };

  const disabled = !graph;

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-gray-400 mr-1 flex items-center gap-1">
        <Download size={12} /> Export:
      </span>
      {[
        { label: 'PNG', onClick: () => exportAsPNG(title) },
        { label: 'JSON', onClick: exportJSON },
        { label: 'Mermaid', onClick: exportMermaid },
      ].map(({ label, onClick }) => (
        <button
          key={label}
          onClick={onClick}
          disabled={disabled}
          className="px-2 py-1 text-xs rounded bg-gray-700 hover:bg-gray-600 text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
