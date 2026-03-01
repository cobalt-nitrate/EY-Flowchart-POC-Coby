import { DiagramNode, DiagramEdge } from '@/types/flowchart';

/** Extract all balanced-brace JSON objects from a partial array string. */
function extractObjects<T>(arrayContent: string): T[] {
  const objects: T[] = [];
  let depth = 0;
  let objStart = -1;

  for (let i = 0; i < arrayContent.length; i++) {
    const ch = arrayContent[i];
    if (ch === '{') {
      if (depth === 0) objStart = i;
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0 && objStart !== -1) {
        try {
          objects.push(JSON.parse(arrayContent.slice(objStart, i + 1)) as T);
        } catch {
          // Skip malformed partial objects
        }
        objStart = -1;
      }
    }
  }

  return objects;
}

/** Find the content that starts after `"key":[` in the buffer. */
function sliceAfterArrayStart(buffer: string, key: string): string | null {
  const pattern = new RegExp(`"${key}"\\s*:\\s*\\[`);
  const match = pattern.exec(buffer);
  if (!match) return null;
  return buffer.slice(match.index + match[0].length);
}

/**
 * Given a partial JSON buffer of a DiagramGraph being streamed,
 * return all complete node and edge objects parsed so far.
 */
export function parsePartialGraph(buffer: string): {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
} {
  const nodesContent = sliceAfterArrayStart(buffer, 'nodes');
  const edgesContent = sliceAfterArrayStart(buffer, 'edges');

  return {
    nodes: nodesContent ? extractObjects<DiagramNode>(nodesContent) : [],
    edges: edgesContent ? extractObjects<DiagramEdge>(edgesContent) : [],
  };
}
