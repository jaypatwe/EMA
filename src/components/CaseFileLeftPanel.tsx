import { useClaim } from '../contexts/ClaimContext';
import { 
  FileText, Shield, Clock, CheckCircle2, AlertTriangle, Loader2, Image as ImageIcon, MessageSquare 
} from 'lucide-react';
import { cn } from '../lib/utils';
import type { AgentStatus } from '../contexts/ClaimContext';

// --- Modern Enterprise Components ---

const InfoRow = ({ label, value, subtext }: { label: string, value: string, subtext?: string }) => (
  <div className="py-3 border-b border-slate-100 last:border-0">
    <span className="text-[10px] uppercase tracking-wider text-[#6c757d] font-semibold block mb-1">{label}</span>
    <div className="flex items-baseline gap-2">
      <span className="text-sm font-medium text-[#111111]">{value}</span>
      {subtext && <span className="text-[10px] text-[#6c757d]">{subtext}</span>}
    </div>
  </div>
);

const AgentStatusRow = ({ status, label }: { status: AgentStatus; label: string }) => {
  const getStatusStyles = (s: AgentStatus) => {
    switch(s) {
      case 'waiting': return { icon: Clock, color: "text-slate-400", bg: "bg-slate-50" };
      case 'running': return { icon: Loader2, color: "text-[#003399]", bg: "bg-blue-50", animate: true };
      case 'completed': return { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" };
      case 'escalated': return { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" };
      case 'failed': return { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" };
      default: return { icon: Clock, color: "text-slate-400", bg: "bg-slate-50" };
    }
  };

  const style = getStatusStyles(status);
  const Icon = style.icon;

  return (
    <div className="flex items-center justify-between py-2 group">
      <span className={cn("text-xs font-medium transition-colors", status === 'running' ? "text-[#003399]" : "text-[#6c757d] group-hover:text-[#111111]")}>
        {label}
      </span>
      <div className={cn("p-1.5 rounded-md transition-all", style.bg)}>
        <Icon className={cn("w-3.5 h-3.5", style.color, style.animate && "animate-spin")} />
      </div>
    </div>
  );
};

export const CaseFileLeftPanel = () => {
  const { claim, agentWorkflow } = useClaim();
  const { policy, extractedData, chatHistory } = claim;

  return (
    <div className="h-full overflow-y-auto bg-white flex flex-col">
      
      {/* 1. Header: Claim Metadata */}
      <header className="px-6 py-5 border-b border-slate-100 bg-white">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
               <FileText className="w-5 h-5 text-[#003399]" />
             </div>
             <div>
               <h2 className="text-base font-bold text-[#111111] leading-tight">Case #{claim.id}</h2>
               <p className="text-[10px] text-[#6c757d] uppercase tracking-wide font-medium mt-0.5">High Priority • Auto</p>
             </div>
          </div>
          <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-mono text-[#6c757d]">
             {policy.policyNumber}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6">
           <InfoRow label="Policyholder" value={policy.policyHolder} subtext="12yr Tenure" />
           <InfoRow label="Vehicle" value={policy.vehicle} subtext={policy.vin} />
        </div>
      </header>

      <div className="p-6 space-y-8 flex-1">

        {/* 2. Policy Info */}
        <section>
           <h3 className="text-[11px] font-bold uppercase text-[#6c757d] tracking-wider mb-3 flex items-center gap-2">
             <Shield className="w-3.5 h-3.5" /> Policy Coverage
           </h3>
           <div className="bg-[#f8f9fc] border border-slate-100 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <span className="text-[10px] text-[#6c757d] uppercase block mb-1">Type</span>
                  <span className="text-xs font-semibold text-[#003399] block">{policy.coverage}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6c757d] uppercase block mb-1">Deductible</span>
                  <span className="text-xs font-semibold text-[#111111] block">${policy.deductible}</span>
                </div>
                <div className="col-span-2 pt-3 border-t border-slate-200/50">
                  <span className="text-[10px] text-[#6c757d] uppercase block mb-1">Coverage Limits</span>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#111111]">Bodily Injury</span>
                    <span className="font-mono text-[#6c757d]">${policy.limits?.bodilyInjury.toLocaleString()}</span>
                  </div>
                </div>
              </div>
           </div>
        </section>

        {/* 3. Evidence / Extracted Data */}
        <section>
           <h3 className="text-[11px] font-bold uppercase text-[#6c757d] tracking-wider mb-3 flex items-center gap-2">
             <ImageIcon className="w-3.5 h-3.5" /> Evidence Locker
           </h3>
           
           {/* Extracted Facts Grid */}
           <div className="mb-4 grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between p-2 bg-white border border-slate-100 rounded text-xs">
                <span className="text-[#6c757d]">Incident Date</span>
                <span className="font-medium text-[#111111]">{extractedData.incidentDate || '---'}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white border border-slate-100 rounded text-xs">
                <span className="text-[#6c757d]">Location</span>
                <span className="font-medium text-[#111111]">{extractedData.location || '---'}</span>
              </div>
           </div>

           {/* Image Thumbnails */}
           <div className="grid grid-cols-3 gap-2">
              {chatHistory.filter(m => m.type === 'image_upload').map((msg, idx) => (
                  <div key={idx} className="aspect-square bg-slate-50 rounded-lg overflow-hidden border border-slate-200 relative group cursor-pointer hover:ring-2 hover:ring-[#003399] hover:shadow-md transition-all">
                     <img src={msg.imageUrl} alt="Evidence" className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
              ))}
              {chatHistory.filter(m => m.type === 'image_upload').length === 0 && (
                 <div className="col-span-3 py-4 text-center border border-dashed border-slate-200 rounded-lg">
                    <span className="text-[10px] text-[#6c757d]">No images uploaded</span>
                 </div>
              )}
           </div>
        </section>

        {/* 4. Conversation Transcript (Collapsed/Compact) */}
        <section className="flex-1 flex flex-col">
            <h3 className="text-[11px] font-bold uppercase text-[#6c757d] tracking-wider mb-3 flex items-center gap-2">
             <MessageSquare className="w-3.5 h-3.5" /> Intake Transcript
           </h3>
           <div className="bg-[#f8f9fc] border border-slate-100 rounded-lg p-3 h-40 overflow-y-auto space-y-3">
              {chatHistory.map(msg => (
                  <div key={msg.id} className={cn("flex flex-col gap-1", msg.role === 'agent' ? "items-end" : "items-start")}>
                      <div className={cn(
                          "px-3 py-2 rounded-lg max-w-[90%] text-[11px] leading-relaxed shadow-sm", 
                          msg.role === 'agent' ? "bg-white text-[#111111] border border-slate-200 rounded-br-none" : "bg-blue-50 text-[#003399] border border-blue-100 rounded-bl-none"
                      )}>
                          {msg.type === 'image_upload' ? <span className="italic opacity-70 flex items-center gap-1"><ImageIcon className="w-3 h-3"/> Image Attachment</span> : msg.content}
                      </div>
                      <span className="text-[9px] text-slate-400 px-1">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
              ))}
           </div>
        </section>

        {/* 5. Agent Workflow Status */}
        <section>
           <h3 className="text-[11px] font-bold uppercase text-[#6c757d] tracking-wider mb-3 flex items-center gap-2">
             <Loader2 className="w-3.5 h-3.5" /> Processing Pipeline
           </h3>
           <div className="space-y-0 bg-white border border-slate-100 rounded-lg p-3 shadow-sm">
              <AgentStatusRow label="Intake Agent" status={agentWorkflow.intake} />
              <AgentStatusRow label="Vision Analysis" status={agentWorkflow.damageAnalysis} />
              <AgentStatusRow label="Weather API" status={agentWorkflow.weatherVerification} />
              <AgentStatusRow label="Geospatial Check" status={agentWorkflow.locationMatching} />
              <AgentStatusRow label="Fraud Detection" status={agentWorkflow.fraudDetection} />
              <AgentStatusRow label="Adjudication Logic" status={agentWorkflow.adjudication} />
              <AgentStatusRow label="Settlement Engine" status={agentWorkflow.settlement} />
           </div>
        </section>

      </div>
    </div>
  );
};
