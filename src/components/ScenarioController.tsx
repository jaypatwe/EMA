import { useState, useRef, useEffect } from "react";
import { ShieldAlert, CheckCircle2, RefreshCcw, AlertTriangle, ChevronDown, Move } from "lucide-react";
import { useClaim } from "../contexts/ClaimContext";
import minorDamageImg from '../assets/scenarios/minor.webp';
import severeDamageImg from '../assets/scenarios/severe.jpg';
import fraudRiskImg from '../assets/scenarios/fraud.jpg';

export const ScenarioController = () => {
  const { setClaim, addLog, updateStatus, addChatMessage, resetClaim, updateAgentStatus } = useClaim();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Draggable logic
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Will be set on mount
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial position: bottom-right
    if (typeof window !== 'undefined') {
        setPosition({
            x: window.innerWidth - 300, 
            y: window.innerHeight - 350
        });
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMove = (event: PointerEvent) => {
      if (!isDragging) return;
      
      const newX = event.clientX - dragOffset.current.x;
      const newY = event.clientY - dragOffset.current.y;

      // Simple bounds check (optional, but good UX)
      const maxX = window.innerWidth - 50;
      const maxY = window.innerHeight - 50;

      setPosition({
        x: Math.min(Math.max(0, newX), maxX),
        y: Math.min(Math.max(0, newY), maxY)
      });
    };

    const handleUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [isDragging]);

  const startDrag = (event: React.PointerEvent) => {
    // Only drag from the header area
    setIsDragging(true);
    dragOffset.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y
    };
  };

  const stepAgent = async (agent: Parameters<typeof updateAgentStatus>[0], outcome: 'completed' | 'failed' | 'escalated' = 'completed', delay = 450) => {
    updateAgentStatus(agent, 'running');
    await new Promise(r => setTimeout(r, delay));
    updateAgentStatus(agent, outcome);
  };

  const runAgentSequence = async (type: 'happy' | 'fraud' | 'complex') => {
    await stepAgent('intake');
    await stepAgent('damageAnalysis');
    await stepAgent('weatherVerification', type === 'fraud' ? 'failed' : 'completed');
    await stepAgent('locationMatching', type === 'fraud' ? 'failed' : 'completed');
    await stepAgent('fraudDetection', type === 'fraud' ? 'failed' : 'completed');

    if (type === 'happy') {
      await stepAgent('adjudication');
      await stepAgent('settlement');
    } else {
      await stepAgent('adjudication', 'escalated');
      updateAgentStatus('settlement', 'waiting');
    }
  };

  const triggerScenario = async (type: 'happy' | 'fraud' | 'complex') => {
    resetClaim();
    await new Promise(r => setTimeout(r, 100));

    addChatMessage('user', type === 'complex' ? 'I had a really bad accident.' : 'I was involved in an accident.');
    await new Promise(r => setTimeout(r, 400));
    addChatMessage('agent', "I'm sorry to hear that. Were there any injuries to you or passengers?", 'text');
    await new Promise(r => setTimeout(r, 400));
    addChatMessage('user', type === 'complex' ? 'My neck hurts a bit, but mostly okay.' : 'No injuries, thankfully.');
    await new Promise(r => setTimeout(r, 400));
    addChatMessage('agent', type === 'complex' ? 'Understood—since there might be injuries please share a photo of the damage when you can.' : 'Thanks for confirming. Could you share a photo of the damage?', 'image_request');

    runAgentSequence(type);

    if (type === 'happy') {
      addChatMessage('user', '', 'image_upload', minorDamageImg);
      addLog({ agentName: 'Vision Agent', action: 'Damage assessed', details: 'Minor cosmetic impact detected', status: 'success' });
      await new Promise(r => setTimeout(r, 1200));
      setClaim(prev => ({
        ...prev,
        extractedData: { ...prev.extractedData, incidentDate: '2023-11-25', damageDescription: 'Minor bumper scratch' },
        analysis: {
          severityScore: 0.15,
          damageSeverity: 'minor',
          estimatedRepairCost: 850,
          fraudRiskScore: 0.05,
          fraudChecks: { weatherConsistent: true, gpsMatch: true, claimsFrequency: 'low', damageNarrativeMatch: true, repairShopRisk: 'low' },
          recommendedPayout: 350,
          liabilityAssessment: 'Not At Fault (0%)',
          liabilityConfidence: 0.99
        }
      }));
      updateStatus('approved');
      addChatMessage('agent', 'All set. The claim was auto-approved and funds will be released shortly.');
    } else if (type === 'fraud') {
      addChatMessage('user', '', 'image_upload', fraudRiskImg);
      addLog({ agentName: 'SIU Agent', action: 'Risk flagged', details: 'GPS + weather mismatch', status: 'error' });
      await new Promise(r => setTimeout(r, 1200));
      setClaim(prev => ({
        ...prev,
        extractedData: { ...prev.extractedData, incidentDate: '2023-11-25', damageDescription: 'Frontal impact' },
        analysis: {
          severityScore: 0.4,
          damageSeverity: 'moderate',
          estimatedRepairCost: 2200,
          fraudRiskScore: 0.88,
          fraudChecks: { weatherConsistent: false, gpsMatch: false, claimsFrequency: 'high', damageNarrativeMatch: false, repairShopRisk: 'high' },
          liabilityAssessment: 'Under Investigation',
          liabilityConfidence: 0.5
        }
      }));
      updateStatus('review_required');
      addChatMessage('agent', 'Thanks for the info. Our senior investigation team will follow up shortly.');
    } else {
      addChatMessage('user', '', 'image_upload', severeDamageImg);
      addLog({ agentName: 'Vision Agent', action: 'Critical damage', details: 'Frame deformation detected', status: 'warning' });
      await new Promise(r => setTimeout(r, 1200));
      setClaim(prev => ({
        ...prev,
        extractedData: { ...prev.extractedData, incidentDate: '2023-11-25', damageDescription: 'Major front-end collision' },
        analysis: {
          severityScore: 0.89,
          damageSeverity: 'severe',
          estimatedRepairCost: 18500,
          fraudRiskScore: 0.12,
          fraudChecks: { weatherConsistent: true, gpsMatch: true, claimsFrequency: 'low', damageNarrativeMatch: true, repairShopRisk: 'low' },
          liabilityAssessment: 'At Fault (100%)',
          liabilityConfidence: 0.95
        }
      }));
      updateStatus('review_required');
      addChatMessage('agent', 'Escalating to a senior adjuster immediately. We’ll keep you posted.');
    }
  };

  if (isCollapsed) {
    return (
      <button 
        onClick={() => setIsCollapsed(false)} 
        className="fixed z-50 px-3 py-2 rounded-full bg-[#003399] text-white text-xs font-semibold shadow-lg hover:bg-[#002b80] cursor-pointer" 
        style={{ left: position.x + 200, top: position.y + 20 }} // Approximate pos when collapsed
        aria-label="Open demo controls"
      >
        Open Demo Controls
      </button>
    );
  }

  return (
    <div 
      ref={panelRef}
      className="fixed z-50 w-64 bg-white border border-slate-200 rounded-xl shadow-2xl p-3 space-y-2 select-none"
      style={{ left: position.x, top: position.y }}
    >
      <div 
        className="flex items-center justify-between text-[10px] font-mono text-[#6c757d] uppercase cursor-move p-1 -m-1 mb-1 rounded hover:bg-slate-50"
        onPointerDown={startDrag}
      >
        <span className="flex items-center gap-1"><Move className="w-3 h-3" /> Drag to move</span>
        <button 
          onClick={(e) => { e.stopPropagation(); setIsCollapsed(true); }} 
          className="text-[#003399] hover:text-[#002b80] text-[10px] font-semibold p-1"
        >
          Hide <ChevronDown className="w-3 h-3 inline" />
        </button>
      </div>
      <button onClick={() => triggerScenario('happy')} className="flex items-center gap-2 px-3 py-2 bg-[#22c55e]/10 hover:bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30 rounded text-xs transition-colors text-left w-full">
        <CheckCircle2 className="w-3 h-3" /> Simulate: Auto-Approve
      </button>
      <button onClick={() => triggerScenario('complex')} className="flex items-center gap-2 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded text-xs transition-colors text-left w-full">
        <AlertTriangle className="w-3 h-3" /> Simulate: High Severity
      </button>
      <button onClick={() => triggerScenario('fraud')} className="flex items-center gap-2 px-3 py-2 bg-[#e32a0d]/10 hover:bg-[#e32a0d]/20 text-[#e32a0d] border border-[#e32a0d]/30 rounded text-xs transition-colors text-left w-full">
        <ShieldAlert className="w-3 h-3" /> Simulate: Fraud Flag
      </button>
      <button onClick={resetClaim} className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-[#111111] border border-slate-200 rounded text-xs transition-colors text-left w-full">
        <RefreshCcw className="w-3 h-3" /> Reset State
      </button>
    </div>
  );
};
