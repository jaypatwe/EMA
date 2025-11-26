import { useParams } from 'react-router-dom';
import { CaseFileLeftPanel } from '../components/CaseFileLeftPanel';
import { AIReasoningPanel } from '../components/AIReasoningPanel';
import { ScenarioController } from '../components/ScenarioController';
import { ArrowLeft, Settings2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useClaim } from '../contexts/ClaimContext';

export const ClaimDetailPage = () => {
  const { id } = useParams();
  const { resetClaim } = useClaim();

  return (
    <div className="flex flex-col h-full relative bg-[#f8f9fc] text-[#111111]">
      <ScenarioController />
      {/* Workbench Header */}
      <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm z-20">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-[#003399] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[#111111] flex items-center gap-2">
              Claim #{id || 'NEW'}
              <span className="px-2 py-0.5 rounded bg-[#003399]/10 text-[#003399] text-xs font-mono">LIVE SESSION</span>
            </h1>
            <p className="text-xs text-[#6c757d]">Adjuster Workbench • Monitoring Mode</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <button 
             onClick={resetClaim}
             className="text-xs text-[#6c757d] hover:text-[#003399] px-3 py-2 hover:bg-slate-100 rounded transition-colors"
           >
             Reset Simulation
           </button>
           <div className="h-6 w-px bg-slate-200"></div>
           <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded text-[#111111] text-xs hover:bg-slate-50 shadow-sm">
             <Settings2 className="w-3 h-3 text-[#6c757d]" /> Configure Agents
           </button>
        </div>
      </header>

      {/* Split View Content */}
      <div className="flex-1 flex min-w-0 overflow-hidden">
         {/* Left Panel: Case File (Metadata, Policy, Evidence, Transcript) */}
         <div className="w-[500px] flex-none z-10 shadow-xl shadow-slate-200/50 flex flex-col border-r border-slate-200 bg-white">
           <div className="bg-slate-50 p-2 text-center text-[10px] font-mono text-[#6c757d] uppercase tracking-wider border-b border-slate-200">
             Case File & Intake Data
           </div>
           <CaseFileLeftPanel />
         </div>

         {/* Right Panel: AI Reasoning & Assessment */}
         <div className="flex-1 min-w-0 bg-[#f8f9fc] relative flex flex-col">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-50"></div>
            
            <div className="relative z-10 h-full">
              <AIReasoningPanel />
            </div>
         </div>
      </div>
    </div>
  );
};
