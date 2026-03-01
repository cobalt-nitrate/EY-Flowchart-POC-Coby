'use client';

import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Node,
  Edge,
  BackgroundVariant,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { DiagramGraph, DiagramNode, DiagramEdge } from '@/types/flowchart';
import { nodeTypes } from './nodes/CustomNodes';
import ExportControls from './ExportControls';

interface DiagramCanvasProps {
  graph: DiagramGraph | null;
  streamingGraph?: { nodes: DiagramNode[]; edges: DiagramEdge[] } | null;
}

/** How long (ms) to wait before revealing each successive streaming node. */
const REVEAL_DELAY_MS = 400;

const EDGE_STYLE = {
  type: 'smoothstep',
  markerEnd: { type: MarkerType.ArrowClosed, color: '#6b7280' },
  style: { stroke: '#6b7280' },
  labelStyle: { fill: '#d1d5db', fontSize: 11 },
  labelBgStyle: { fill: '#1f2937' },
} as const;

// ── Layout helpers ────────────────────────────────────────────────────────────

function autoLayout(graph: DiagramGraph): { nodes: Node[]; edges: Edge[] } {
  const LAYER_HEIGHT = 120;
  const NODE_WIDTH = 160;

  const inDegree: Record<string, number> = {};
  const adjList: Record<string, string[]> = {};
  for (const node of graph.nodes) { inDegree[node.id] = 0; adjList[node.id] = []; }
  for (const edge of graph.edges) {
    inDegree[edge.target] = (inDegree[edge.target] || 0) + 1;
    adjList[edge.source].push(edge.target);
  }

  const layers: string[][] = [];
  const visited = new Set<string>();
  let queue = graph.nodes.filter((n) => inDegree[n.id] === 0).map((n) => n.id);
  if (queue.length === 0) queue = [graph.nodes[0]?.id].filter(Boolean);

  while (queue.length > 0) {
    layers.push([...queue]);
    queue.forEach((id) => visited.add(id));
    const next: string[] = [];
    for (const id of queue)
      for (const child of adjList[id] || [])
        if (!visited.has(child)) next.push(child);
    queue = [...new Set(next)];
  }

  const unvisited = graph.nodes.filter((n) => !visited.has(n.id)).map((n) => n.id);
  if (unvisited.length > 0) layers.push(unvisited);

  const positionMap: Record<string, { x: number; y: number }> = {};
  layers.forEach((layer, li) => {
    const startX = -(layer.length * NODE_WIDTH) / 2;
    layer.forEach((id, i) => {
      positionMap[id] = { x: startX + i * NODE_WIDTH + NODE_WIDTH / 2, y: li * LAYER_HEIGHT };
    });
  });

  return {
    nodes: graph.nodes.map((n) => ({
      id: n.id,
      type: n.type,
      position: n.position || positionMap[n.id] || { x: 0, y: 0 },
      data: { label: n.label },
      style: n.style,
    })),
    edges: graph.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
      animated: e.type === 'data_flow',
      ...EDGE_STYLE,
    })),
  };
}

function streamingLayout(
  visibleNodes: DiagramNode[],
  allEdges: DiagramEdge[]
): { nodes: Node[]; edges: Edge[] } {
  const idSet = new Set(visibleNodes.map((n) => n.id));
  return {
    nodes: visibleNodes.map((n, i) => ({
      id: n.id,
      type: n.type,
      position: { x: 0, y: i * 110 },
      data: { label: n.label },
      style: n.style,
    })),
    edges: allEdges
      .filter((e) => idSet.has(e.source) && idSet.has(e.target))
      .map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
        animated: true,
        ...EDGE_STYLE,
        style: { stroke: '#3b82f6', strokeDasharray: '5 3' },
      })),
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function DiagramCanvas({ graph, streamingGraph }: DiagramCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  /** How many streaming nodes have been revealed so far. */
  const [revealedCount, setRevealedCount] = useState(0);
  const { fitView } = useReactFlow();

  // ── Slow-reveal timer ───────────────────────────────────────────────────────
  // Schedule one new node reveal every REVEAL_DELAY_MS while streaming nodes
  // are available but not yet shown.
  useEffect(() => {
    if (!streamingGraph || streamingGraph.nodes.length === 0) {
      setRevealedCount(0);
      return;
    }
    // All currently parsed nodes are already visible — wait for more to arrive.
    if (revealedCount >= streamingGraph.nodes.length) return;

    const t = setTimeout(() => setRevealedCount((c) => c + 1), REVEAL_DELAY_MS);
    return () => clearTimeout(t);
  }, [revealedCount, streamingGraph?.nodes.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Apply layout to React Flow ──────────────────────────────────────────────
  useEffect(() => {
    if (graph) {
      // Complete graph arrived — reset streaming count, render full layout.
      setRevealedCount(0);
      const { nodes: n, edges: e } = autoLayout(graph);
      setNodes(n);
      setEdges(e);
    } else if (streamingGraph && revealedCount > 0) {
      const visible = streamingGraph.nodes.slice(0, revealedCount);
      const { nodes: n, edges: e } = streamingLayout(visible, streamingGraph.edges);
      setNodes(n);
      setEdges(e);
    } else if (!graph && !streamingGraph) {
      setNodes([]);
      setEdges([]);
    }
  }, [graph, streamingGraph, revealedCount, setNodes, setEdges]);

  // ── Auto-fit whenever node count changes ────────────────────────────────────
  // During streaming: quick fit (300 ms) so the camera follows each new node.
  // After completion: a longer, smoother fit (700 ms) for the final layout.
  useEffect(() => {
    if (nodes.length === 0) return;
    const isStreaming = !graph && !!streamingGraph;
    const t = setTimeout(
      () => fitView({ duration: isStreaming ? 300 : 700, padding: 0.25 }),
      40
    );
    return () => clearTimeout(t);
  }, [nodes.length, fitView, graph, streamingGraph]);

  const isStreaming = !graph && !!streamingGraph && streamingGraph.nodes.length > 0;

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (!graph && !isStreaming) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-950 text-gray-500">
        <div className="text-center space-y-3">
          <div className="text-5xl">⬡</div>
          <p className="text-lg font-medium text-gray-400">No diagram yet</p>
          <p className="text-sm">Describe a process in the chat to generate your first flowchart</p>
        </div>
      </div>
    );
  }

  const title = graph?.title ?? 'Building diagram…';
  const version = graph?.metadata.version;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-medium text-gray-200 truncate max-w-[200px]" title={title}>
            {title}
          </span>
          {version !== undefined && (
            <span className="text-xs text-gray-500 font-normal shrink-0">v{version}</span>
          )}
          {isStreaming && (
            <span className="text-xs text-blue-400 animate-pulse shrink-0">
              {revealedCount}/{streamingGraph!.nodes.length} nodes…
            </span>
          )}
        </div>
        {graph && <ExportControls graph={graph} />}
      </div>

      {/* Canvas */}
      <div className="flex-1 min-h-0">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-950"
          defaultEdgeOptions={{ type: 'smoothstep' }}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#374151" />
          <Controls className="!bg-gray-800 !border-gray-700 !shadow-none" />
          <MiniMap
            className="!bg-gray-800 !border-gray-700"
            nodeColor="#3b82f6"
            maskColor="rgba(0,0,0,0.6)"
          />
        </ReactFlow>
      </div>
    </div>
  );
}
