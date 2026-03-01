'use client';

import { useEffect, useRef, useState } from 'react';
import { Brain, Hexagon, ChevronDown, ChevronRight } from 'lucide-react';

export interface StreamingState {
  phase: 'thinking' | 'building';
  thinkingText: string;
  nodeCount: number;
  isEdit: boolean;
}

interface StreamingMessageProps {
  state: StreamingState;
}

// Contextual status messages that rotate during each phase
const THINKING_LABELS = [
  'Analyzing your request…',
  'Understanding the process flow…',
  'Identifying decision points…',
  'Planning the diagram structure…',
  'Mapping relationships and paths…',
];

const THINKING_LABELS_EDIT = [
  'Reading your edit instruction…',
  'Locating the affected nodes…',
  'Planning the minimal change…',
  'Preserving existing structure…',
];

const BUILDING_LABELS = [
  'Mapping process nodes…',
  'Connecting decision paths…',
  'Structuring the workflow…',
  'Organizing node hierarchy…',
  'Linking edges and flows…',
  'Finalizing diagram schema…',
];

const BUILDING_LABELS_EDIT = [
  'Applying the surgical edit…',
  'Updating affected nodes…',
  'Recalculating connections…',
  'Preserving node IDs…',
  'Finalizing updated diagram…',
];

function useRotatingLabel(labels: string[], intervalMs = 2200): string {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % labels.length), intervalMs);
    return () => clearInterval(t);
  }, [labels, intervalMs]);
  return labels[idx];
}

export default function StreamingMessage({ state }: StreamingMessageProps) {
  const { phase, thinkingText, nodeCount, isEdit } = state;
  const [reasoningOpen, setReasoningOpen] = useState(true);
  const reasoningRef = useRef<HTMLDivElement>(null);

  const thinkingLabel = useRotatingLabel(isEdit ? THINKING_LABELS_EDIT : THINKING_LABELS);
  const buildingLabel = useRotatingLabel(isEdit ? BUILDING_LABELS_EDIT : BUILDING_LABELS);

  // Auto-scroll reasoning pane as text streams in
  useEffect(() => {
    if (reasoningRef.current) {
      reasoningRef.current.scrollTop = reasoningRef.current.scrollHeight;
    }
  }, [thinkingText]);

  return (
    <div className="space-y-2 max-w-[85%]">
      {/* ── Thinking phase block ─────────────────────────────── */}
      {(phase === 'thinking' || thinkingText) && (
        <div className="rounded-lg border border-violet-800/50 bg-violet-950/40 overflow-hidden">
          {/* Header */}
          <button
            onClick={() => setReasoningOpen((o) => !o)}
            className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-violet-900/20 transition-colors"
          >
            <Brain
              size={13}
              className={`text-violet-400 shrink-0 ${phase === 'thinking' ? 'animate-pulse' : ''}`}
            />
            <span className="text-xs font-medium text-violet-300 flex-1 truncate">
              {phase === 'thinking' ? thinkingLabel : (isEdit ? 'Edit reasoning' : 'Diagram reasoning')}
            </span>
            {reasoningOpen ? (
              <ChevronDown size={12} className="text-violet-500 shrink-0" />
            ) : (
              <ChevronRight size={12} className="text-violet-500 shrink-0" />
            )}
          </button>

          {/* Reasoning text */}
          {reasoningOpen && thinkingText && (
            <div
              ref={reasoningRef}
              className="px-3 pb-3 max-h-[140px] overflow-y-auto"
            >
              <p className="text-[11px] text-violet-300/70 leading-relaxed whitespace-pre-wrap font-mono">
                {thinkingText}
                {phase === 'thinking' && (
                  <span className="inline-block w-1.5 h-3 bg-violet-400 ml-0.5 animate-pulse align-middle" />
                )}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Building phase block ──────────────────────────────── */}
      {phase === 'building' && (
        <div className="rounded-lg border border-blue-800/50 bg-blue-950/40 px-3 py-2.5 flex items-start gap-2.5">
          <Hexagon
            size={14}
            className="text-blue-400 shrink-0 mt-0.5"
            style={{ animation: 'spin 3s linear infinite' }}
          />
          <div className="space-y-1">
            <p className="text-xs font-medium text-blue-300">
              {isEdit ? 'Updating your diagram' : 'Building your flowchart'}
            </p>
            <p className="text-[11px] text-blue-400/70">{buildingLabel}</p>
            {nodeCount > 0 && (
              <p className="text-[11px] text-blue-500/60">
                {nodeCount} element{nodeCount !== 1 ? 's' : ''} detected so far…
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
