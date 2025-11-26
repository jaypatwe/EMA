import { useClaim } from '../contexts/ClaimContext';
import { 
  Shield, CheckCircle, Car, MapPin, Calendar, Activity, UserCog, Bot, AlertTriangle
} from 'lucide-react';
import { cn } from '../lib/utils';

export const DecisionPanel = () => {
  const { claim, isHumanTakeover, toggleHumanTakeover } = useClaim();
  const { policy, extractedData, analysis, status } = claim;

  return (
    <div className="h-full overflow-y-auto bg-slate-950 p-6 space-y-6">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Live Decision Intelligence</h1>
          <p className="text-slate-400 text-sm">Real-time analysis stream</p>
        </div>
        <button 
          onClick={toggleHumanTakeover}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all border",
            isHumanTakeover 
              ? "bg-amber-600 text-white border-amber-500 hover:bg-amber-700 shadow-[0_0_15px_rgba(245,158,11,0.4)]" 
              : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
          )}
        >
          <UserCog className="w-4 h-4" />
          {isHumanTakeover ? "Release Control to AI" : "Human Takeover"}
        </button>
      </header>

      {/* 1. Context Card */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
        <h3 className="text-xs font-semibold uppercase text-slate-500 mb-3 flex items-center gap-2">
          <Shield className="w-3 h-3" /> Policy Context
        </h3>
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
          <div>
            <span className="text-slate-500 block text-xs">Policy Holder</span>
            <span className="text-slate-200">{policy.policyHolder}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-xs">Vehicle</span>
            <span className="text-slate-200">{policy.vehicle}</span>
          </div>
          <div className="col-span-2">
            <span className="text-slate-500 block text-xs">Coverage</span>
            <span className="text-emerald-400 text-xs">{policy.coverage}</span>
          </div>
        </div>
      </section>

      {/* 2. Extracted Data Stream */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 relative overflow-hidden">
         <div className="flex justify-between items-start mb-3">
            <h3 className="text-xs font-semibold uppercase text-slate-500 flex items-center gap-2">
              <Bot className="w-3 h-3 text-blue-400" /> Intake Agent
            </h3>
            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">Active Listening</span>
         </div>
        
        <div className="space-y-2">
           {!extractedData.incidentDate && !extractedData.damageDescription ? (
             <div className="text-xs text-slate-600 italic">Waiting for structured data...</div>
           ) : (
             <>
                {extractedData.incidentDate && (
                  <div className="flex items-center gap-2 text-sm text-slate-300 animate-in fade-in slide-in-from-left-2">
                    <Calendar className="w-4 h-4 text-blue-500" /> 
                    <span>Date: {extractedData.incidentDate}</span>
                  </div>
                )}
                {extractedData.location && (
                  <div className="flex items-center gap-2 text-sm text-slate-300 animate-in fade-in slide-in-from-left-2">
                    <MapPin className="w-4 h-4 text-blue-500" /> 
                    <span>Location: {extractedData.location}</span>
                  </div>
                )}
                {extractedData.damageDescription && (
                  <div className="flex items-center gap-2 text-sm text-slate-300 animate-in fade-in slide-in-from-left-2">
                    <Car className="w-4 h-4 text-blue-500" /> 
                    <span>Impact: {extractedData.damageDescription}</span>
                  </div>
                )}
             </>
           )}
        </div>
      </section>

      {/* 3. Analysis Results */}
      {(status === 'analyzing' || analysis.severityScore !== undefined) && (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
          
          {/* Severity & Cost */}
          <section className="bg-slate-900 border border-slate-700 rounded-xl p-4 relative overflow-hidden group hover:border-orange-500/50 transition-colors">
             {status === 'analyzing' && <div className="absolute inset-0 bg-slate-900/80 z-10 flex items-center justify-center backdrop-blur-sm"><span className="text-blue-400 animate-pulse text-sm">Vision Agent Processing...</span></div>}
             <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-orange-500"/> Damage Analysis Agent
                </h3>
                <span className={cn("px-2 py-0.5 rounded text-xs font-mono", analysis.severityScore && analysis.severityScore > 0.5 ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400")}>
                  SEVERITY: {analysis.severityScore?.toFixed(2)}
                </span>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 p-3 rounded">
                   <span className="text-slate-500 text-xs uppercase">Est. Cost</span>
                   <p className="text-xl font-bold text-white">
                     {analysis.estimatedRepairCost ? `$${analysis.estimatedRepairCost.toLocaleString()}` : '---'}
                   </p>
                </div>
                <div className="bg-slate-800 p-3 rounded">
                   <span className="text-slate-500 text-xs uppercase">Severity</span>
                   <p className="text-lg font-medium text-white capitalize">{analysis.damageSeverity || '---'}</p>
                </div>
             </div>
          </section>

          {/* Fraud Checks */}
          <section className="bg-slate-900 border border-slate-700 rounded-xl p-4 relative overflow-hidden group hover:border-purple-500/50 transition-colors">
             {status === 'analyzing' && <div className="absolute inset-0 bg-slate-900/80 z-10 flex items-center justify-center backdrop-blur-sm"><span className="text-purple-400 animate-pulse text-sm">SIU Agent Cross-Referencing...</span></div>}
             <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-500"/> Fraud Screening Agent
                </h3>
                <span className={cn("px-2 py-0.5 rounded text-xs font-mono", analysis.fraudRiskScore && analysis.fraudRiskScore > 0.4 ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400")}>
                  RISK SCORE: {analysis.fraudRiskScore?.toFixed(2)}
                </span>
             </div>
             {analysis.fraudChecks && (
               <ul className="space-y-2 text-xs text-slate-300">
                 <li className="flex items-center justify-between">
                   <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500"/> Weather Consistency</span>
                   <span className={analysis.fraudChecks.weatherConsistent ? "text-green-400" : "text-red-400"}>
                     {analysis.fraudChecks.weatherConsistent ? "Matched" : "Mismatch"}
                   </span>
                 </li>
                 <li className="flex items-center justify-between">
                   <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500"/> Location vs GPS</span>
                   <span className={analysis.fraudChecks.gpsMatch ? "text-green-400" : "text-red-400"}>
                     {analysis.fraudChecks.gpsMatch ? "Matched" : "Mismatch"}
                   </span>
                 </li>
                 <li className="flex items-center justify-between">
                   <span className="flex items-center gap-1"><Activity className="w-3 h-3 text-blue-500"/> Claim Frequency</span>
                   <span className="text-slate-500 capitalize">{analysis.fraudChecks.claimsFrequency}</span>
                 </li>
               </ul>
             )}
          </section>

          {/* Final Outcome */}
          <section className={cn(
            "rounded-xl p-5 border-2 transition-all duration-500",
            status === 'approved' ? "bg-emerald-950/30 border-emerald-500/50" : 
            status === 'review_required' ? "bg-amber-950/30 border-amber-500/50" :
            "bg-slate-900 border-slate-800"
          )}>
            {status === 'analyzing' ? (
              <div className="text-center py-8 text-slate-500 animate-pulse">Computing Final Decision...</div>
            ) : status === 'approved' ? (
              <div className="text-center">
                 <div className="mx-auto w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-3">
                   <CheckCircle className="w-6 h-6 text-emerald-500" />
                 </div>
                 <h3 className="text-lg font-bold text-white mb-1">Claim Auto-Approved</h3>
                 <p className="text-sm text-slate-400 mb-4">Settlement Agent Recommendation</p>
                 <div className="bg-emerald-900/40 p-3 rounded-lg border border-emerald-500/20 mb-4">
                   <span className="text-emerald-200 text-xs uppercase tracking-wider">Approved Amount</span>
                   <div className="text-2xl font-bold text-white">${analysis.recommendedPayout?.toLocaleString()}</div>
                 </div>
                 <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded-lg transition-colors">
                   Accept & Close Claim
                 </button>
              </div>
            ) : status === 'review_required' ? (
              <div className="text-center">
                 <div className="mx-auto w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mb-3">
                   <AlertTriangle className="w-6 h-6 text-amber-500" />
                 </div>
                 <h3 className="text-lg font-bold text-white mb-1">Human Review Required</h3>
                 <p className="text-sm text-slate-400 mb-2">
                   Flagged for: <span className="text-amber-400 font-semibold">
                     {analysis.severityScore && analysis.severityScore > 0.5 ? "High Severity" : "Risk Factors"}
                   </span>
                 </p>
                 {analysis.estimatedRepairCost && (
                   <div className="mb-4 text-xs text-slate-500">
                     Est. Exposure: <span className="text-slate-300 font-mono">${analysis.estimatedRepairCost.toLocaleString()}</span>
                   </div>
                 )}
                 <div className="bg-slate-900/50 p-3 rounded text-xs text-slate-400 border border-slate-800">
                   Adjuster notified. Please use the 'Human Takeover' button to intervene if necessary.
                 </div>
              </div>
            ) : null}
          </section>

        </div>
      )}
    </div>
  );
};
