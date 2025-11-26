import { useState, useRef, useEffect } from 'react';
import { useClaim } from '../contexts/ClaimContext';
import { Send, Loader2, Upload, UserCog } from 'lucide-react';
import { cn } from '../lib/utils';

export const ChatInterface = () => {
  const { claim, addChatMessage, addLog, setClaim, updateStatus, isHumanTakeover } = useClaim();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [claim.chatHistory]);

  const simulateAgentResponse = async (userText: string) => {
    // If human has taken over, the AI does NOT respond.
    if (isHumanTakeover) return;

    setIsTyping(true);
    
    // 1. Parse intent/entities (Simulated)
    // Simple keyword matching for demo purposes
    let extractedUpdates: any = {};
    if (userText.toLowerCase().includes('rear-end') || userText.toLowerCase().includes('rear ended')) {
      extractedUpdates.damageDescription = 'Rear-end collision';
    }
    if (userText.toLowerCase().includes('highway') || userText.toLowerCase().includes('st') || userText.toLowerCase().includes('ave')) {
      extractedUpdates.location = 'Extracted from chat context';
    }
    if (userText.toLowerCase().includes('yesterday') || userText.toLowerCase().includes('today')) {
      extractedUpdates.incidentDate = '2023-11-25'; // Mock
    }

    if (Object.keys(extractedUpdates).length > 0) {
      setClaim(prev => ({
        ...prev,
        extractedData: { ...prev.extractedData, ...extractedUpdates }
      }));
      addLog({ 
        agentName: 'Intake Agent', 
        action: 'Extracted Entity', 
        details: `Found: ${Object.keys(extractedUpdates).join(', ')}`, 
        status: 'success' 
      });
    }

    // 2. Decide response based on state
    await new Promise(r => setTimeout(r, 1500)); // Typing delay

    const historyCount = claim.chatHistory.filter(m => m.role === 'user').length;
    let responseText = '';
    let nextAction: 'text' | 'image_request' = 'text';

    if (historyCount === 1) {
      responseText = "I'm sorry to hear that. To make sure everyone is safe, were there any injuries to you or any passengers?";
    } else if (historyCount === 2) {
      responseText = "Thanks for confirming. Could you please share a photo of the damage to your vehicle? This helps us assess the repair costs instantly.";
      nextAction = 'image_request';
    } else {
      responseText = "I've received the details. Let me process this information for you.";
    }

    addChatMessage('agent', responseText, nextAction);
    setIsTyping(false);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userText = input;
    
    // Add message
    addChatMessage('user', userText);
    setInput('');
    
    // Simulate Agent OR do nothing if Human Takeover
    if (!isHumanTakeover) {
      simulateAgentResponse(userText);
    }
  };

  const handleImageUpload = async () => {
    // Simulate upload
    addChatMessage('user', '', 'image_upload', 'https://images.unsplash.com/photo-1599256872237-5dcc0fbe9668?auto=format&fit=crop&q=80&w=300&h=200'); // Mock crash image
    setIsTyping(true);

    // Trigger Analysis Pipeline
    addLog({ agentName: 'System', action: 'Image Uploaded', details: 'Processing computer vision analysis...', status: 'pending' });
    updateStatus('analyzing');
    
    await new Promise(r => setTimeout(r, 2000));
    
    // Simulation Logic
    const isHighSeverity = claim.chatHistory.some(m => m.content.toLowerCase().includes('total') || m.content.toLowerCase().includes('bad'));
    
    const severityScore = isHighSeverity ? 0.85 : 0.3;
    const fraudScore = 0.12; 

    setClaim(prev => ({
      ...prev,
      analysis: {
        severityScore,
        damageSeverity: severityScore > 0.5 ? 'severe' : 'minor',
        estimatedRepairCost: severityScore > 0.5 ? 12500 : 1200,
        fraudRiskScore: fraudScore,
        fraudChecks: {
          weatherConsistent: true,
          gpsMatch: true,
          claimsFrequency: 'low',
          damageNarrativeMatch: true,
          repairShopRisk: 'low'
        },
        liabilityAssessment: '100% Not At Fault',
        liabilityConfidence: 0.95,
        recommendedPayout: severityScore > 0.5 ? undefined : 1200 - 500 // Deductible logic
      }
    }));

    addLog({ agentName: 'Vision Agent', action: 'Analysis Complete', details: `Severity: ${severityScore.toFixed(2)} | Fraud Risk: ${fraudScore.toFixed(2)}`, status: 'success' });
    
    setIsTyping(false);
    
    if (severityScore < 0.5 && fraudScore < 0.4) {
      addChatMessage('agent', "Good news. Based on our analysis, the damage appears minor and consistent with your description. We can fast-track your approval.");
      updateStatus('approved');
    } else {
      addChatMessage('agent', "I've analyzed the damage. Due to the severity or complexity of the incident, I'm forwarding this to a specialist adjuster for a quick review. They will contact you shortly.");
      updateStatus('review_required');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800">
      <div className={cn(
        "p-4 border-b border-slate-800 backdrop-blur transition-colors duration-500",
        isHumanTakeover ? "bg-amber-900/20" : "bg-slate-900/50"
      )}>
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          {isHumanTakeover ? (
             <div className="flex items-center gap-2">
                <UserCog className="w-5 h-5 text-amber-500" />
                <span className="text-amber-400">Adjuster Live Chat</span>
             </div>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Ema Assistant
            </>
          )}
        </h2>
        <p className="text-xs text-slate-400">{isHumanTakeover ? "You are speaking directly to the customer." : "AI Automated Intake & Support"}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {claim.chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex w-full",
              // Adjuster View: Customer (User) on Left, AI/Agent on Right
              msg.role === 'user' ? "justify-start" : "justify-end"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-2xl p-4 text-sm",
                msg.role === 'user' 
                  ? "bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700" // Customer
                  : "bg-blue-600 text-white rounded-br-none" // AI/Agent
              )}
            >
              {msg.role === 'agent' && <div className="text-[10px] text-slate-400 mb-1 font-mono uppercase">AI Assistant</div>}
              {msg.role === 'system' && <div className="text-[10px] text-amber-400 mb-1 font-mono uppercase">Human Adjuster</div>} {/* We can use 'system' role for human agent for now, or just 'agent' with a flag */}
              
              {msg.content && <p>{msg.content}</p>}
              
              {msg.type === 'image_request' && (
                <button 
                  onClick={handleImageUpload}
                  disabled={claim.chatHistory.some(m => m.type === 'image_upload')}
                  className="mt-3 flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg transition-colors w-full justify-center border border-slate-600 border-dashed"
                >
                  <Upload className="w-4 h-4" /> Upload Damage Photo
                </button>
              )}

              {msg.type === 'image_upload' && msg.imageUrl && (
                <div className="mt-2 rounded-lg overflow-hidden border border-slate-600">
                  <img src={msg.imageUrl} alt="Uploaded damage" className="w-full h-32 object-cover" />
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-end">
            <div className="bg-blue-600/50 rounded-2xl rounded-br-none p-4 border border-blue-500/50">
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={cn(
        "p-4 border-t border-slate-800",
        isHumanTakeover ? "bg-amber-900/10" : "bg-slate-900"
      )}>
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isHumanTakeover ? "Type message as Adjuster..." : "Type your message..."}
            disabled={(!isHumanTakeover && (claim.status === 'analyzing' || claim.status === 'approved' || claim.status === 'review_required'))}
            className="w-full bg-slate-800 border border-slate-700 rounded-full py-3 px-4 pr-12 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || (!isHumanTakeover && claim.status === 'analyzing')}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-500 rounded-full text-white transition-colors disabled:opacity-0 disabled:cursor-default"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
