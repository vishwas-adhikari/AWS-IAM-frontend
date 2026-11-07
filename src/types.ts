// One step of a path stored in a finding's details.hops
export interface FindingHop {
  from: string;          // GraphNode.node_id
  to: string;            // GraphNode.node_id
  from_label?: string;
  to_label?: string;
  edge: string;          // edge label, e.g. "CAN_ASSUME"
  techniques?: string[];
}

// Rule-specific structured data attached to a finding
export interface FindingDetails {
  hops?: FindingHop[];
  [key: string]: unknown;
}

// Matches the Django 'FindingSerializer' output
export interface APIFinding {
  id: number;
  rule_id: string;
  category: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  affected_resource: string;
  remediation: string;
  details: FindingDetails;
}

// Matches GraphNode.TYPE_CHOICES in the Django model
export type GraphNodeType =
  | 'USER'
  | 'GROUP'
  | 'ROLE'
  | 'POLICY'
  | 'ACCOUNT_ROOT'
  | 'EXTERNAL_ACCOUNT'
  | 'PUBLIC'
  | 'SERVICE'
  | 'FEDERATED'
  | 'ADMIN'
  | 'UNKNOWN';

// Matches the Django 'GraphNodeSerializer' output
export interface APIGraphNode {
  id: number;
  node_id: string;
  label: string;
  type: GraphNodeType;
  risk_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

// Matches the Django 'GraphEdgeSerializer' output
export interface APIGraphEdge {
  id: number;
  source: string;
  target: string;
  label: string;
}

// Matches the Django 'ScanSerializer' output EXACTLY
export interface APIScanResult {
  id: number;
  account_id: string;
  account_alias: string;
  scan_time: string;
  risk_score: number;

  // Flat fields (No 'stats' object)
  total_users: number;
  total_roles: number;
  total_policies: number;
  critical_count: number;
  high_count: number;
  medium_count: number;

  findings: APIFinding[];
  graph_data: {
    nodes: APIGraphNode[];
    edges: APIGraphEdge[];
  };
}
