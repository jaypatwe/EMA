import { Bot, Shield, Sliders, ToggleRight } from 'lucide-react';

export const SettingsPage = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#111111] mb-2">System Configuration</h1>
        <p className="text-[#6c757d]">Manage autonomous agent thresholds and permissions.</p>
      </header>

      <div className="grid gap-6">
        
        {/* Agent Autonomy Levels */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#111111] mb-4 flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#003399]" /> Agent Autonomy
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-[#111111] font-medium">Straight-Through Processing (STP)</h3>
                <p className="text-sm text-[#6c757d]">Automatically approve claims with low risk scores.</p>
              </div>
              <ToggleRight className="w-10 h-10 text-[#22c55e] cursor-pointer" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-[#111111]">Max Auto-Approval Limit</label>
                <span className="text-sm font-mono text-[#003399]">$5,000</span>
              </div>
              <input type="range" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#003399]" />
            </div>
          </div>
        </section>

        {/* Risk Thresholds */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#111111] mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" /> Risk Thresholds
          </h2>
          
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <span className="text-[#111111]">Fraud Score Trigger</span>
                <div className="flex items-center gap-3">
                   <span className="text-xs text-[#6c757d]">Review if score &gt;</span>
                   <span className="bg-slate-100 px-3 py-1 rounded text-[#111111] border border-slate-200 font-mono">40</span>
                </div>
             </div>
             <div className="flex items-center justify-between">
                <span className="text-[#111111]">Severity Trigger</span>
                <div className="flex items-center gap-3">
                   <span className="text-xs text-[#6c757d]">Review if severity &gt;</span>
                   <span className="bg-slate-100 px-3 py-1 rounded text-[#111111] border border-slate-200 font-mono">0.5</span>
                </div>
             </div>
          </div>
        </section>

        {/* Agent Personality */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 opacity-75 shadow-sm">
           <h2 className="text-xl font-semibold text-[#111111] mb-4 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#6c757d]" /> Model Parameters
          </h2>
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-50 p-4 rounded border border-slate-200">
                <span className="text-xs uppercase text-[#6c757d] block mb-1">Intake Agent Tone</span>
                <span className="text-[#111111] font-medium">Empathetic & Professional</span>
             </div>
             <div className="bg-slate-50 p-4 rounded border border-slate-200">
                <span className="text-xs uppercase text-[#6c757d] block mb-1">Vision Model Version</span>
                <span className="text-[#111111] font-medium">v4.2 (Beta)</span>
             </div>
          </div>
        </section>

      </div>
    </div>
  );
};

