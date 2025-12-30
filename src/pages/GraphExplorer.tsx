import { useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  MarkerType, // <--- 1. ADD THIS IMPORT
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useScan } from '../context/ScanContext';
import { User, Users, Shield, FileText } from 'lucide-react';

const GraphExplorer = () => {
  const { scanData } = useScan();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const nodeTypes = { custom: CustomNode };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'CRITICAL': return { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400' };
      case 'HIGH': return { bg: 'bg-orange-500/20', border: 'border-orange-500', text: 'text-orange-400' };
      case 'MEDIUM': return { bg: 'bg-yellow-500/20', border: 'border-yellow-500', text: 'text-yellow-400' };
      default: return { bg: 'bg-emerald-500/20', border: 'border-emerald-500', text: 'text-emerald-400' };
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'USER': return User;
      case 'GROUP': return Users;
      case 'ROLE': return Shield;
      case 'POLICY': return FileText;
      default: return Shield;
    }
  };

  useEffect(() => {
    if (!scanData) return;

    const apiNodes: Node[] = scanData.graph_data.nodes.map((node, index) => {
      const colors = getRiskColor(node.risk_level);
      const Icon = getNodeIcon(node.type);
      const x = (index % 3) * 300; // Increased spacing slightly
      const y = Math.floor(index / 3) * 150;

      return {
        id: node.node_id,
        type: 'custom',
        position: { x, y },
        data: {
          label: node.label,
          type: node.type,
          risk: node.risk_level,
          icon: Icon,
          colors,
        },
      };
    });

    const apiEdges: Edge[] = scanData.graph_data.edges.map((edge) => ({
      id: `e-${edge.id}`,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      animated: true,
      style: { stroke: '#22d3ee', strokeWidth: 2 },
      labelStyle: { fill: '#94a3b8', fontSize: 12, fontWeight: 600 },
      labelBgStyle: { fill: '#0f172a', fillOpacity: 0.8 },
      // --- 2. ADD ARROWHEAD CONFIGURATION HERE ---
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#22d3ee',
      },
      // -------------------------------------------
    }));

    setNodes(apiNodes);
    setEdges(apiEdges);
  }, [scanData, setNodes, setEdges]);

  if (!scanData) return <div className="text-white p-10">Loading Graph...</div>;

  return (
    <div className="space-y-6 h-full">
      {/* ... (Keep the rest of your JSX exactly the same) ... */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">IAM Relationship Graph</h1>
        <p className="text-slate-400">Visualize the connections between IAM entities</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
         {/* Legend (Keep same) */}
        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full" /><span className="text-sm text-slate-400">Critical</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded-full" /><span className="text-sm text-slate-400">High</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded-full" /><span className="text-sm text-slate-400">Medium</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full" /><span className="text-sm text-slate-400">Low</span></div>
        </div>

        <div className="h-[600px] bg-slate-950 rounded-lg border border-slate-800">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            className="bg-slate-950"
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#1e293b" />
            <Controls className="bg-slate-800 border-slate-700" />
            <MiniMap className="bg-slate-900 border border-slate-700" />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

// ... (Keep CustomNode function same) ...
function CustomNode({ data }: { data: any }) {
  const Icon = data.icon;
  const { colors } = data;
  return (
    <div className={`px-4 py-3 border-2 ${colors.border} ${colors.bg} rounded-lg backdrop-blur-sm min-w-[160px]`}>
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${colors.text}`} />
        <div>
          <div className="text-sm font-semibold text-white">{data.label}</div>
          <div className="text-xs text-slate-400">{data.type}</div>
        </div>
      </div>
    </div>
  );
}

export default GraphExplorer;