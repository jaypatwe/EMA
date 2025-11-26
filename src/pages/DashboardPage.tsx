import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Users, AlertTriangle, CheckCircle, 
  ArrowRight, Clock, Car 
} from 'lucide-react';

export const DashboardPage = () => {
  const navigate = useNavigate();

  const metrics = [
    { label: 'Pending Review', value: '12', change: '+2', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Auto-Approved', value: '45', change: '+18%', icon: CheckCircle, color: 'text-[#22c55e]', bg: 'bg-[#22c55e]/10' },
    { label: 'Fraud Flags', value: '3', change: '-1', icon: AlertTriangle, color: 'text-[#e32a0d]', bg: 'bg-[#e32a0d]/10' },
    { label: 'Avg. Settlement', value: '$2.4k', change: '+5%', icon: TrendingUp, color: 'text-[#003399]', bg: 'bg-[#003399]/10' },
  ];

  const recentClaims = [
    { id: 'CLM-8832', policyHolder: 'Alex Morgan', vehicle: '2022 Tesla Model Y', status: 'In Progress', risk: 'Low', time: '2m ago' },
    { id: 'CLM-9921', policyHolder: 'Sarah Connor', vehicle: '2019 Ford F-150', status: 'Review Needed', risk: 'High', time: '15m ago' },
    { id: 'CLM-7742', policyHolder: 'James Bond', vehicle: '2023 Aston Martin', status: 'Approved', risk: 'Medium', time: '1h ago' },
  ];

  return (
    <div className="p-8 space-y-8 overflow-y-auto h-full bg-[#f8f9fc]">
      <header>
        <h1 className="text-3xl font-bold text-[#111111]">Claims Overview</h1>
        <p className="text-[#6c757d]">Welcome back, Sarah. Here's what's happening today.</p>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className={`p-2 rounded-lg ${metric.bg}`}>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <span className="text-xs font-medium text-[#6c757d] bg-slate-50 px-2 py-1 rounded">
                {metric.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-[#111111]">{metric.value}</div>
            <div className="text-sm text-[#6c757d]">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Active Queue */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#111111] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#003399]" />
            Priority Queue
          </h2>
          <button className="text-sm text-[#003399] hover:text-[#4066b3] font-medium">View All</button>
        </div>
        <div className="divide-y divide-slate-100">
          {recentClaims.map((claim) => (
            <div 
              key={claim.id} 
              className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between group"
              onClick={() => navigate(`/claims/${claim.id}`)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#6c757d] group-hover:bg-[#003399]/10 group-hover:text-[#003399] transition-colors">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium text-[#111111]">{claim.policyHolder}</div>
                  <div className="text-xs text-[#6c757d]">{claim.id} • {claim.vehicle}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                    claim.risk === 'High' ? 'bg-[#e32a0d]/10 text-[#e32a0d]' : 
                    claim.risk === 'Medium' ? 'bg-amber-50 text-amber-600' : 
                    'bg-[#22c55e]/10 text-[#22c55e]'
                  }`}>
                    {claim.risk} Risk
                  </div>
                </div>
                <div className="text-sm text-[#6c757d] flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {claim.time}
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#003399] transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
