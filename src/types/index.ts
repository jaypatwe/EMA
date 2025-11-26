export type ClaimStatus = 'intake' | 'analyzing' | 'review_required' | 'approved' | 'rejected' | 'processing';

export interface AgentAction {
  id?: string; // Made optional to simplify call sites
  agentName: string;
  action: string;
  timestamp?: Date; // Made optional, defaults to now() in context
  details: string;
  status: 'pending' | 'success' | 'warning' | 'error';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string; // Changed to string to match usage
  type?: 'text' | 'image_request' | 'image_upload';
  imageUrl?: string;
}

export interface PolicyContext {
  policyNumber: string;
  policyHolder: string;
  vehicle: string;
  vin?: string;
  coverage: string;
  deductible?: number;
  claimHistory: number; // Renamed from pastClaims
  limits?: {
    propertyDamage: number;
    bodilyInjury: number;
  };
  tenure?: string;
}

export interface FraudChecks {
  weatherConsistent: boolean;
  gpsMatch: boolean;
  claimsFrequency: 'low' | 'medium' | 'high';
  damageNarrativeMatch: boolean;
  repairShopRisk: 'low' | 'high';
}

export interface ClaimData {
  id: string;
  status: ClaimStatus;
  policy: PolicyContext;
  description?: string;
  chatHistory: ChatMessage[];
  extractedData: {
    incidentDate?: string;
    location?: string;
    vehicleDetails?: string;
    driverName?: string;
    damageDescription?: string;
    weather?: string;
  };
  analysis: {
    severityScore?: number; // 0-1
    damageSeverity?: 'minor' | 'moderate' | 'severe' | 'total_loss';
    estimatedRepairCost?: number;
    fraudRiskScore?: number; // 0-1
    fraudChecks?: FraudChecks;
    liabilityAssessment?: string;
    liabilityConfidence?: number; // 0-1
    recommendedPayout?: number;
    decisionReasoning?: string[];
  };
  logs: AgentAction[];
}
