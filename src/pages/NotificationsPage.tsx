import { ShieldAlert, FileText, UserPlus, CheckCircle } from 'lucide-react';

export const NotificationsPage = () => {
  const notifications = [
    {
      id: 1,
      title: "High Risk Claim Flagged",
      message: "Claim #CLM-9921 (Sarah Connor) flagged for potential location mismatch.",
      time: "10 mins ago",
      type: "alert",
      icon: ShieldAlert,
      color: "text-[#e32a0d]",
      bg: "bg-[#e32a0d]/10"
    },
    {
      id: 2,
      title: "Settlement Approved",
      message: "Auto-approval executed for Claim #CLM-7742. Payment of $2,400 released.",
      time: "1 hour ago",
      type: "success",
      icon: CheckCircle,
      color: "text-[#22c55e]",
      bg: "bg-[#22c55e]/10"
    },
    {
      id: 3,
      title: "New Document Uploaded",
      message: "Police Report added to Claim #CLM-8832 by claimant.",
      time: "2 hours ago",
      type: "info",
      icon: FileText,
      color: "text-[#003399]",
      bg: "bg-[#003399]/10"
    },
    {
      id: 4,
      title: "Adjuster Assignment",
      message: "You have been assigned 3 new complex claims for manual review.",
      time: "4 hours ago",
      type: "neutral",
      icon: UserPlus,
      color: "text-purple-600",
      bg: "bg-purple-100"
    }
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto h-full overflow-y-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#111111] mb-2">Notifications</h1>
        <p className="text-[#6c757d]">Recent system alerts and updates.</p>
      </header>

      <div className="space-y-4">
        {notifications.map((notif) => (
          <div key={notif.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer shadow-sm">
            <div className={`p-3 rounded-lg ${notif.bg}`}>
              <notif.icon className={`w-6 h-6 ${notif.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-[#111111]">{notif.title}</h3>
                <span className="text-xs text-[#6c757d]">{notif.time}</span>
              </div>
              <p className="text-[#6c757d] text-sm mt-1">{notif.message}</p>
            </div>
            <div className="self-center">
                <div className="w-2 h-2 rounded-full bg-[#003399]"></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <button className="text-sm text-[#6c757d] hover:text-[#003399] transition-colors font-medium">
          Mark all as read
        </button>
      </div>
    </div>
  );
};

