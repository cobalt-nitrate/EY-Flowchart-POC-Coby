'use client';

import { Handle, Position, NodeProps } from 'reactflow';

interface NodeData {
  label: string;
}

export function ProcessNode({ data, selected }: NodeProps<NodeData>) {
  return (
    <div className={`px-4 py-2 min-w-[120px] text-center rounded bg-blue-600 text-white text-sm border-2 ${selected ? 'border-blue-300' : 'border-blue-700'}`}>
      <Handle type="target" position={Position.Top} className="!bg-blue-300" />
      <span>{data.label}</span>
      <Handle type="source" position={Position.Bottom} className="!bg-blue-300" />
    </div>
  );
}

export function DecisionNode({ data, selected }: NodeProps<NodeData>) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 140, height: 70 }}>
      <Handle type="target" position={Position.Top} className="!bg-yellow-300" />
      <div
        className={`absolute inset-0 bg-yellow-500 border-2 ${selected ? 'border-yellow-200' : 'border-yellow-600'}`}
        style={{ transform: 'rotate(45deg)', borderRadius: 4 }}
      />
      <span className="relative z-10 text-xs text-white font-semibold text-center px-2 leading-tight">
        {data.label}
      </span>
      <Handle type="source" position={Position.Bottom} className="!bg-yellow-300" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-yellow-300" />
    </div>
  );
}

export function StartNode({ data, selected }: NodeProps<NodeData>) {
  return (
    <div className={`px-5 py-2 rounded-full bg-green-600 text-white text-sm border-2 ${selected ? 'border-green-300' : 'border-green-700'}`}>
      <Handle type="source" position={Position.Bottom} className="!bg-green-300" />
      <span>{data.label}</span>
    </div>
  );
}

export function EndNode({ data, selected }: NodeProps<NodeData>) {
  return (
    <div className={`px-5 py-2 rounded-full bg-red-600 text-white text-sm border-4 ${selected ? 'border-red-300' : 'border-red-800'}`}>
      <Handle type="target" position={Position.Top} className="!bg-red-300" />
      <span>{data.label}</span>
    </div>
  );
}

export function IONode({ data, selected }: NodeProps<NodeData>) {
  return (
    <div className="relative" style={{ width: 140, height: 50 }}>
      <Handle type="target" position={Position.Top} className="!bg-purple-300" />
      <div
        className={`absolute inset-0 bg-purple-600 border-2 ${selected ? 'border-purple-300' : 'border-purple-700'}`}
        style={{ clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)', borderRadius: 2 }}
      />
      <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium px-4">
        {data.label}
      </span>
      <Handle type="source" position={Position.Bottom} className="!bg-purple-300" />
    </div>
  );
}

export function DatabaseNode({ data, selected }: NodeProps<NodeData>) {
  return (
    <div className={`px-4 py-2 min-w-[120px] text-center bg-cyan-700 text-white text-sm border-2 rounded-sm ${selected ? 'border-cyan-300' : 'border-cyan-800'}`}
      style={{ borderRadius: '50% / 10px' }}>
      <Handle type="target" position={Position.Top} className="!bg-cyan-300" />
      <span>{data.label}</span>
      <Handle type="source" position={Position.Bottom} className="!bg-cyan-300" />
    </div>
  );
}

export function ExternalNode({ data, selected }: NodeProps<NodeData>) {
  return (
    <div className={`px-4 py-2 min-w-[120px] text-center bg-gray-600 text-white text-sm border-2 ${selected ? 'border-gray-300' : 'border-gray-700'}`}>
      <Handle type="target" position={Position.Top} className="!bg-gray-300" />
      <span>{data.label}</span>
      <Handle type="source" position={Position.Bottom} className="!bg-gray-300" />
    </div>
  );
}

export const nodeTypes = {
  process: ProcessNode,
  decision: DecisionNode,
  start: StartNode,
  end: EndNode,
  io: IONode,
  database: DatabaseNode,
  external: ExternalNode,
  swimlane_header: ProcessNode,
};
