// Matches the Django 'ScanSerializer' output
export interface APIFinding {
  id: number;
  category: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  affected_resource: string;
  remediation: string;
}

export interface APIGraphNode {
  id: number;
  node_id: string;
  label: string;
  type: 'USER' | 'GROUP' | 'ROLE' | 'POLICY';
  risk_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface APIGraphEdge {
  id: number;
  source: string;
  target: string;
  label: string;
}

export interface APIScanResult {
  id: number;
  account_id: string;
  account_alias: string;
  scan_time: string;
  risk_score: number;
  stats: {
    users: number; // Mapped from total_users
    roles: number; // Mapped from total_roles
    policies: number; // Mapped from total_policies
    critical_risks: number; // Mapped from critical_count
    high_risks: number; // Mapped from high_count
    medium_risks: number; // Mapped from medium_count
  };
  findings: APIFinding[];
  graph_data: {
    nodes: APIGraphNode[];
    edges: APIGraphEdge[];
  };
}