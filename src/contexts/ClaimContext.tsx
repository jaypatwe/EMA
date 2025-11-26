import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { ClaimData, ClaimStatus, ChatMessage, PolicyContext, AgentAction } from '../types';

// Extended types for Agent Workflow
export type AgentStatus = 'waiting' | 'running' | 'completed' | 'escalated' | 'failed';

export interface AgentWorkflowState {
  intake: AgentStatus;
  damageAnalysis: AgentStatus;
  weatherVerification: AgentStatus;
  locationMatching: AgentStatus;
  fraudDetection: AgentStatus;
  adjudication: AgentStatus;
  settlement: AgentStatus;
}

interface ClaimContextType {
  claim: ClaimData;
  agentWorkflow: AgentWorkflowState;
  setClaim: React.Dispatch<React.SetStateAction<ClaimData>>;
  addChatMessage: (role: 'user' | 'agent', content: string, type?: 'text' | 'image_request' | 'image_upload', imageUrl?: string) => void;
  updateStatus: (status: ClaimStatus) => void;
  updateAgentStatus: (agent: keyof AgentWorkflowState, status: AgentStatus) => void;
  addLog: (log: AgentAction) => void;
  resetClaim: () => void;
  // Deprecated but kept for compatibility until full cleanup
  isHumanTakeover: boolean;
  toggleHumanTakeover: () => void;
}

const ClaimContext = createContext<ClaimContextType | undefined>(undefined);

const initialPolicy: PolicyContext = {
  policyNumber: "POL-88392102",
  policyHolder: "Sarah Connor",
  coverage: "Comprehensive + Collision",
  deductible: 500,
  vehicle: "2021 Tesla Model 3",
  vin: "5YJ3E1EA1MF123456",
  claimHistory: 0,
  limits: {
    propertyDamage: 50000,
    bodilyInjury: 100000
  }
};

const initialClaim: ClaimData = {
  id: "CLM-2024-001",
  status: 'processing',
  policy: initialPolicy,
  extractedData: {},
  chatHistory: [
    { id: '1', role: 'agent', content: "Hi Sarah, I'm your claims assistant. I see you've started a new claim. I hope you're safe. Could you tell me what happened?", timestamp: new Date().toISOString() }
  ],
  logs: [],
  analysis: {}
};

const initialWorkflow: AgentWorkflowState = {
  intake: 'waiting',
  damageAnalysis: 'waiting',
  weatherVerification: 'waiting',
  locationMatching: 'waiting',
  fraudDetection: 'waiting',
  adjudication: 'waiting',
  settlement: 'waiting'
};

export const ClaimProvider = ({ children }: { children: ReactNode }) => {
  const [claim, setClaim] = useState<ClaimData>(initialClaim);
  const [agentWorkflow, setAgentWorkflow] = useState<AgentWorkflowState>(initialWorkflow);
  const [isHumanTakeover, setIsHumanTakeover] = useState(false);

  const addChatMessage = (role: 'user' | 'agent', content: string, type: 'text' | 'image_request' | 'image_upload' = 'text', imageUrl?: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role,
      content,
      type,
      imageUrl,
      timestamp: new Date().toISOString()
    };
    
    setClaim(prev => ({
      ...prev,
      chatHistory: [...prev.chatHistory, newMessage]
    }));
  };

  const updateStatus = (status: ClaimStatus) => {
    setClaim(prev => ({ ...prev, status }));
  };

  const updateAgentStatus = (agent: keyof AgentWorkflowState, status: AgentStatus) => {
    setAgentWorkflow(prev => ({ ...prev, [agent]: status }));
  };

  const addLog = (log: AgentAction) => {
    setClaim(prev => ({
      ...prev,
      logs: [{ ...log, id: Date.now().toString(), timestamp: new Date() }, ...prev.logs]
    }));
  };

  const toggleHumanTakeover = () => setIsHumanTakeover(prev => !prev);

  const resetClaim = () => {
    setClaim({
      ...initialClaim,
      chatHistory: [
         { id: Date.now().toString(), role: 'agent', content: "Hi Sarah, I'm Ema, your claims assistant. I see you've started a new claim. I hope you're safe. Could you tell me what happened?", timestamp: new Date().toISOString() }
      ]
    });
    setAgentWorkflow(initialWorkflow);
    setIsHumanTakeover(false);
  };

  return (
    <ClaimContext.Provider value={{ 
      claim, 
      agentWorkflow, 
      setClaim, 
      addChatMessage, 
      updateStatus, 
      updateAgentStatus, 
      addLog, 
      resetClaim,
      isHumanTakeover,
      toggleHumanTakeover
    }}>
      {children}
    </ClaimContext.Provider>
  );
};

export const useClaim = () => {
  const context = useContext(ClaimContext);
  if (context === undefined) {
    throw new Error('useClaim must be used within a ClaimProvider');
  }
  return context;
};
