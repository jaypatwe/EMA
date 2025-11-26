import { useState, useEffect } from 'react';
import { useClaim } from '../contexts/ClaimContext';
import { useToast } from '../contexts/ToastContext';
import { 
  Shield, CheckCircle, Car, AlertTriangle, AlertOctagon, Scale, FileCheck, MessageSquare, ChevronDown, AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// --- Modern Enterprise Components ---

const SkeletonRow = () => (
  <div className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0 animate-pulse">
    <div className="h-3 w-24 bg-slate-100 rounded"></div>
    <div className="h-3 w-32 bg-slate-100 rounded"></div>
  </div>
);

const DataRow = ({ label, value, highlight = false, valueColor = "text-[#111111]" }: { label: string, value: string | React.ReactNode, highlight?: boolean, valueColor?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0"
  >
    <span className="text-xs text-[#6c757d] font-medium">{label}</span>
    <span className={cn("text-sm font-medium", valueColor, highlight && "font-semibold")}>{value}</span>
  </motion.div>
);

const StatusBadge = ({ status, text }: { status: 'success' | 'warning' | 'danger' | 'neutral', text: string }) => {
  const colors = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
    danger: "bg-red-50 text-red-700 border-red-100",
    neutral: "bg-slate-50 text-slate-600 border-slate-100"
  };
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border", colors[status])}>
      {text}
    </span>
  );
};

const ConfidenceMeter = ({ value, label }: { value: number, label: string }) => (
  <div className="flex items-center gap-3 py-1">
    <div className="flex-1">
      <div className="flex justify-between text-[10px] mb-1">
        <span className="text-[#6c757d] font-medium">{label}</span>
        <span className="text-[#111111] font-mono">{Math.round(value * 100)}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full rounded-full", value > 0.8 ? "bg-[#003399]" : value > 0.5 ? "bg-amber-500" : "bg-[#e32a0d]")} 
        />
      </div>
    </div>
  </div>
);

const SectionHeader = ({ icon: Icon, title, rightElement, isOpen, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors group"
  >
    <div className="flex items-center gap-3">
      <div className="p-1.5 rounded-md bg-white shadow-sm border border-slate-100 group-hover:border-blue-100 transition-colors">
        <Icon className="w-4 h-4 text-[#003399]" />
      </div>
      <span className="font-semibold text-[#111111] text-sm tracking-tight">{title}</span>
    </div>
    <div className="flex items-center gap-3">
      {rightElement}
      <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-200", isOpen && "rotate-180")} />
    </div>
  </button>
);

const AgentInsight = ({ children }: { children: React.ReactNode }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    className="mt-3 bg-blue-50/50 border border-blue-100 rounded-lg p-3 flex gap-3 items-start"
  >
    <div className="bg-white p-1 rounded-full shadow-sm border border-blue-50 mt-0.5">
      <MessageSquare className="w-3 h-3 text-[#003399]" />
    </div>
    <p className="text-xs text-[#4066b3] leading-relaxed">
      <span className="font-semibold block text-[#003399] mb-0.5">Agent Reasoning</span>
      {children}
    </p>
  </motion.div>
);

export const AIReasoningPanel = () => {
  const { claim } = useClaim();
  const { analysis, status } = claim;
  const { toast } = useToast();
  const [expandedSection, setExpandedSection] = useState<string | null>('damage');

  // Trigger toast on status change
  useEffect(() => {
    if (status === 'approved') {
      toast('Claim automatically approved by Agent', 'success');
    } else if (status === 'review_required') {
      toast('Claim escalated for manual review', 'info');
    }
  }, [status, toast]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="h-full overflow-y-auto bg-[#f8f9fc] px-6 py-8">
      
      {/* Header Section */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-xl font-bold text-[#111111] tracking-tight">Analysis Engine</h2>
          <div className="flex items-center gap-2 mt-1 text-xs text-[#6c757d]">
            <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-emerald-500" /> System Operational</span>
            <span>•</span>
            <span>Latency: 45ms</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-medium text-[#6c757d] uppercase tracking-wider mb-1">Current Status</div>
          <StatusBadge 
            status={status === 'approved' ? 'success' : status === 'rejected' ? 'danger' : status === 'review_required' ? 'warning' : 'neutral'} 
            text={status.replace('_', ' ')} 
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="space-y-4">

        {/* 1. Damage Assessment Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <SectionHeader 
            icon={Car} 
            title="Damage Assessment" 
            isOpen={expandedSection === 'damage'} 
            onClick={() => toggleSection('damage')}
            rightElement={analysis.severityScore && <StatusBadge status={analysis.severityScore > 0.5 ? 'warning' : 'success'} text={`Severity ${(analysis.severityScore * 10).toFixed(1)}/10`} />}
          />
          
          <AnimatePresence>
            {expandedSection === 'damage' && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 border-t border-slate-50">
                  {analysis.severityScore !== undefined ? (
                    <div className="pt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-[#6c757d] uppercase">Estimated Cost</p>
                          <p className="text-2xl font-bold text-[#111111] tracking-tight">
                            ${analysis.estimatedRepairCost?.toLocaleString()}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-[#6c757d] uppercase">Damage Class</p>
                          <p className="text-lg font-medium text-[#111111] capitalize">
                            {analysis.damageSeverity?.replace('_', ' ')}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1 pt-2">
                        <ConfidenceMeter value={0.94} label="Visual Analysis Confidence" />
                        <ConfidenceMeter value={0.89} label="Cost Model Accuracy" />
                      </div>

                      <AgentInsight>
                        Vision transformers detected distinct impact patterns on the front bumper. Lack of A-pillar deformation suggests structural integrity is intact, classifying this as <span className="font-medium">{analysis.damageSeverity}</span>.
                      </AgentInsight>
                    </div>
                  ) : (
                    <div className="pt-4 space-y-3">
                      <SkeletonRow />
                      <SkeletonRow />
                      <SkeletonRow />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. Fraud Analysis Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <SectionHeader 
            icon={Shield} 
            title="Fraud & Risk Intelligence" 
            isOpen={expandedSection === 'fraud'} 
            onClick={() => toggleSection('fraud')}
            rightElement={analysis.fraudRiskScore && <StatusBadge status={analysis.fraudRiskScore > 0.4 ? 'danger' : 'success'} text={analysis.fraudRiskScore > 0.4 ? 'High Risk' : 'Low Risk'} />}
          />
          
          <AnimatePresence>
            {expandedSection === 'fraud' && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 border-t border-slate-50">
                  {analysis.fraudChecks ? (
                    <div className="pt-4">
                      <div className="flex items-center justify-between mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <span className="text-xs font-semibold text-[#6c757d] uppercase">Composite Risk Score</span>
                        <span className={cn("text-xl font-bold font-mono", analysis.fraudRiskScore && analysis.fraudRiskScore > 0.4 ? "text-[#e32a0d]" : "text-[#22c55e]")}>
                          {analysis.fraudRiskScore?.toFixed(2)} <span className="text-xs font-normal text-slate-400">/ 1.00</span>
                        </span>
                      </div>

                      <div className="space-y-0">
                        <DataRow 
                          label="GPS Location Verification" 
                          value={analysis.fraudChecks.gpsMatch ? <span className="flex items-center gap-1.5 text-emerald-700"><CheckCircle className="w-3 h-3" /> Verified On-Site</span> : <span className="flex items-center gap-1.5 text-red-600"><AlertTriangle className="w-3 h-3" /> Location Mismatch</span>} 
                        />
                        <DataRow 
                          label="Weather Consistency" 
                          value={analysis.fraudChecks.weatherConsistent ? <span className="flex items-center gap-1.5 text-emerald-700"><CheckCircle className="w-3 h-3" /> Matches Reports</span> : <span className="flex items-center gap-1.5 text-amber-600"><AlertCircle className="w-3 h-3" /> Inconsistent</span>} 
                        />
                        <DataRow 
                          label="Claim History Velocity" 
                          value={<span className="capitalize text-[#111111]">{analysis.fraudChecks.claimsFrequency} Frequency</span>} 
                        />
                      </div>

                      <AgentInsight>
                        {analysis.fraudRiskScore && analysis.fraudRiskScore > 0.4 
                          ? "Anomalies detected in geolocation data relative to the reported incident site. Recommended for SIU review." 
                          : "Cross-referenced data points align with the claimant's narrative. No fraud indicators flagged."}
                      </AgentInsight>
                    </div>
                  ) : (
                    <div className="pt-4 space-y-3">
                      <SkeletonRow />
                      <SkeletonRow />
                      <SkeletonRow />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. Liability & Settlement Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <SectionHeader 
            icon={Scale} 
            title="Liability & Settlement" 
            isOpen={expandedSection === 'liability'} 
            onClick={() => toggleSection('liability')}
          />
          
          <AnimatePresence>
            {expandedSection === 'liability' && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 border-t border-slate-50">
                  {analysis.recommendedPayout || status === 'review_required' ? (
                    <div className="pt-4 space-y-6">
                      
                      {/* Liability Section */}
                      <div>
                        <h4 className="text-[10px] font-bold text-[#6c757d] uppercase tracking-wider mb-3">Liability Determination</h4>
                        {status === 'review_required' ? (
                          <div className="relative">
                            <select 
                              className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm font-medium text-[#111111] appearance-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                              defaultValue={analysis.liabilityAssessment || "Under Investigation"}
                            >
                              <option value="Under Investigation">Under Investigation</option>
                              <option value="At Fault (100%)">At Fault (100%)</option>
                              <option value="Not At Fault (0%)">Not At Fault (0%)</option>
                              <option value="Comparative (50/50)">Comparative (50/50)</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          </div>
                        ) : (
                          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex justify-between items-center">
                            <span className="text-sm font-medium text-[#111111]">{analysis.liabilityAssessment}</span>
                            <span className="text-xs font-mono text-[#003399] bg-blue-50 px-2 py-1 rounded border border-blue-100">{(analysis.liabilityConfidence || 0) * 100}% Conf.</span>
                          </div>
                        )}
                      </div>

                      {/* Financial Breakdown */}
                      <div>
                        <h4 className="text-[10px] font-bold text-[#6c757d] uppercase tracking-wider mb-3">Settlement Calculation</h4>
                        {analysis.recommendedPayout ? (
                          <div className="space-y-0 text-sm">
                            <div className="flex justify-between py-1">
                              <span className="text-[#6c757d]">Gross Damages</span>
                              <span className="text-[#111111]">${analysis.estimatedRepairCost?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between py-1">
                              <span className="text-[#6c757d]">Deductible</span>
                              <span className="text-[#e32a0d]">- ${claim.policy.deductible}</span>
                            </div>
                            <div className="flex justify-between py-2 border-t border-slate-100 mt-1 font-bold text-base">
                              <span className="text-[#111111]">Net Payout</span>
                              <span className="text-[#003399]">${analysis.recommendedPayout.toLocaleString()}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                            <div className="flex justify-between py-1 text-sm">
                                <span className="text-[#6c757d]">Est. Repair Cost</span>
                                <span className="text-[#111111] font-medium">${analysis.estimatedRepairCost?.toLocaleString() ?? '---'}</span>
                            </div>
                            <div className="flex justify-between py-1 text-sm">
                                <span className="text-[#6c757d]">Policy Deductible</span>
                                <span className="text-[#e32a0d]">- ${claim.policy.deductible}</span>
                            </div>
                            <div className="pt-2 border-t border-slate-200">
                                <label className="text-[10px] font-bold text-[#6c757d] uppercase tracking-wider block mb-1.5">Adjuster Proposed Settlement</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">$</span>
                                    <input 
                                        type="number" 
                                        className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-[#111111] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                                        placeholder="0.00" 
                                    />
                                </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Adjuster Controls */}
                      <div className="pt-4 border-t border-slate-100">
                        <label className="text-[10px] font-bold text-[#6c757d] uppercase tracking-wider block mb-2">Adjuster Override / Notes</label>
                        <textarea 
                          className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs text-[#111111] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none h-20 placeholder:text-slate-300"
                          placeholder="Enter rationale for decision..."
                        ></textarea>
                        
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <button className="flex items-center justify-center gap-2 bg-[#003399] hover:bg-[#002b80] text-white text-xs font-semibold py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95">
                            <FileCheck className="w-3.5 h-3.5" /> Approve Settlement
                          </button>
                          <button className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#111111] border border-slate-200 text-xs font-semibold py-2.5 rounded-lg transition-all shadow-sm hover:border-slate-300 active:scale-95">
                            <AlertOctagon className="w-3.5 h-3.5 text-amber-600" /> Escalate Case
                          </button>
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="pt-4 space-y-3">
                      <SkeletonRow />
                      <SkeletonRow />
                      <SkeletonRow />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
