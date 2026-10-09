"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  CheckCircle2, FileText, Target, Users, Languages, 
  MessageSquare, ShieldCheck, Sparkles, ArrowRight, AlertCircle, Check
} from "lucide-react";

import { analyzeCampaignBrief, AnalysisResult, ClarificationQuestion } from "./clarificationEngine";
import { analyzeAudience, AudienceStrategy } from "./audienceEngine";
import { generateCampaignStrategy, CampaignStrategy } from "./strategyEngine";

type CampaignBrief = {
  id: string;
  businessName: string;
  businessType: string;
  location: string;
  roughIdea: string;
  campaignGoal: string[];
  targetAudience: string;
  offer: string;
  languages: string[];
  channels: string[];
  brandTone: string[];
  exactOfferDetails?: string;
  offerValidity?: string;
  conditions?: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "ready_for_clarification";
};

type OfferFacts = {
  businessName: string;
  businessType: string;
  location: string;
  offer: string;
  offerAppliesTo: string;
  eligibleCustomers: string;
  validity: string;
  conditions: string;
  campaignGoal: string;
};

type LockedOfferFacts = {
  id: string;
  facts: OfferFacts;
  lockedAt: string;
  lockedBy: "business_owner";
  version: number;
  status: "locked";
};

type CampaignVersion = {
  id: string;
  versionNumber: number;
  createdAt: string;
  createdBy: "business_owner";
  facts: OfferFacts;
  status: "draft" | "locked";
  changeSummary?: string;
};

export default function CampaignWorkspace() {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10>(1);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  
  const [lockedFacts, setLockedFacts] = useState<LockedOfferFacts | null>(null);
  const [versions, setVersions] = useState<CampaignVersion[]>([]);
  const [lockCheckbox, setLockCheckbox] = useState(false);

  const [audienceStrategy, setAudienceStrategy] = useState<AudienceStrategy | null>(null);
  const [campaignStrategy, setCampaignStrategy] = useState<CampaignStrategy | null>(null);

  const [brief, setBrief] = useState<Partial<CampaignBrief>>({
    languages: ["English", "Kannada"],
    channels: ["Instagram", "WhatsApp"],
    campaignGoal: [],
    brandTone: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [isGenerating, setIsGenerating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationComplete, setValidationComplete] = useState(false);
  
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionComplete, setPredictionComplete] = useState(false);
  
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationComplete, setOptimizationComplete] = useState(false);
  
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentComplete, setDeploymentComplete] = useState(false);

  const simulateProcess = (setLoading, setComplete) => {
    setLoading(true);
    setComplete(false);
    setTimeout(() => {
      setLoading(false);
      setComplete(true);
    }, 2000);
  };

  const [generatedCampaign, setGeneratedCampaign] = useState<any>(null);

  const handleGenerateCampaign = async () => {
    setIsGenerating(true);
    setGeneratedCampaign(null);
    try {
      const res = await fetch("/api/campaign/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignInput: brief,
          lockedFacts: lockedFacts
        })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedCampaign(data);
      } else {
        alert(data.error || "Failed to generate campaign");
      }
    } catch (e) {
      alert("Network error generating campaign.");
    } finally {
      setIsGenerating(false);
    }
  };


  const handleDemoBrief = (type: number = 1) => {
    if (type === 1) {
      setBrief({
        businessName: "Namma Brew",
        businessType: "Café",
        location: "Koramangala, Bengaluru, Karnataka, India",
        roughIdea: "I want to attract more college students this weekend.\nGive them 20% off on Cappuccino and promote it on Instagram and WhatsApp.",
        campaignGoal: ["Increase Weekend Footfall"],
        targetAudience: "College Students",
        offer: "20% OFF",
        exactOfferDetails: "Cappuccino",
        conditions: "Valid Student ID Required",
        offerValidity: "Saturday & Sunday",
        languages: ["English", "Kannada"],
        channels: ["Instagram", "WhatsApp"],
        brandTone: ["Friendly", "Youthful"]
      });
    } else if (type === 2) {
      setBrief({
        businessName: "Namma Brew",
        businessType: "Café",
        location: "Koramangala, Bengaluru",
        roughIdea: "Special weekend offer for customers.",
        campaignGoal: [],
        targetAudience: "",
        offer: "Special offer",
        languages: ["English", "Kannada"],
        channels: ["Instagram", "WhatsApp"],
        brandTone: ["Friendly"]
      });
    } else if (type === 4) {
      setBrief({
        businessName: "Namma Brew",
        businessType: "Café",
        location: "Koramangala, Bengaluru",
        roughIdea: "30% off everything",
        campaignGoal: [],
        targetAudience: "Everyone",
        offer: "20% off coffee",
        languages: ["English"],
        channels: ["Instagram"],
        brandTone: ["Friendly"]
      });
    }
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!brief.businessName) newErrors.businessName = "Business name is required.";
    if (!brief.businessType) newErrors.businessType = "Business type is required.";
    if (!brief.location) newErrors.location = "Location is required.";
    if (!brief.roughIdea) newErrors.roughIdea = "Tell us what you're trying to promote.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      const result = analyzeCampaignBrief(brief);
      setAnalysis(result);
      setActiveStep(2);
      window.scrollTo(0, 0);
    }
  };

  const toggleArrayItem = (field: "campaignGoal" | "languages" | "channels" | "brandTone", value: string) => {
    const current = brief[field] || [];
    if (current.includes(value)) {
      setBrief({ ...brief, [field]: current.filter(item => item !== value) });
    } else {
      setBrief({ ...brief, [field]: [...current, value] });
    }
  };

  const getLockedBusinessFacts = (): OfferFacts => {
    return {
      businessName: brief.businessName || "Not specified",
      businessType: brief.businessType || "Not specified",
      location: brief.location || "Not specified",
      offer: brief.offer || "Not specified",
      offerAppliesTo: brief.exactOfferDetails ? brief.exactOfferDetails : "Not specified", 
      eligibleCustomers: brief.targetAudience || "Not specified",
      validity: brief.offerValidity || (brief.roughIdea && brief.roughIdea.toLowerCase().includes("weekend") ? "Saturday & Sunday" : "Not specified"),
      conditions: brief.conditions || "Not specified",
      campaignGoal: brief.campaignGoal && brief.campaignGoal.length > 0 ? brief.campaignGoal.join(", ") : "Not specified",
    };
  };

  const handleLockFacts = () => {
    if (!lockCheckbox) return;
    const newFacts: LockedOfferFacts = {
      id: "locked-" + Date.now(),
      facts: getLockedBusinessFacts(),
      lockedAt: new Date().toISOString(),
      lockedBy: "business_owner",
      version: versions.length + 1,
      status: "locked"
    };
    setLockedFacts(newFacts);
    setVersions([...versions, {
      id: "ver-" + Date.now(),
      versionNumber: versions.length + 1,
      createdAt: new Date().toISOString(),
      createdBy: "business_owner",
      facts: newFacts.facts,
      status: "locked"
    }]);
    window.scrollTo(0, 0);
  };

  const handleRequestChange = () => {
    const confirmChange = window.confirm("Changing approved business facts will create a new campaign version.\nYour existing campaign remains preserved. The updated facts will need to be reviewed and locked again.\n\nCreate New Version?");
    if (confirmChange) {
      setLockedFacts(null);
      setLockCheckbox(false);
      setActiveStep(1);
    }
  };

  const goals = ["Increase sales", "Increase footfall", "Promote an offer", "Launch a product", "Increase awareness", "Engage existing customers", "Other"];
  const audienceChips = ["Students", "Young Professionals", "Families", "Local Customers", "Existing Customers", "Tourists"];
  const languageOptions = ["English", "Kannada", "Hindi", "Tamil", "Telugu"];
  const channelOptions = ["Instagram", "WhatsApp", "Facebook"];
  const toneOptions = ["Friendly", "Professional", "Playful", "Premium", "Local", "Youthful", "Minimal"];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3E2723] flex flex-col md:flex-row font-sans selection:bg-[#2E4F4F] selection:text-white">
      
      {/* Sidebar */}
      <aside className="w-full md:w-72 lg:w-80 bg-white border-r border-[#3E2723]/10 flex flex-col shrink-0 md:h-screen sticky top-0 overflow-y-auto">
        <div className="p-6 border-b border-[#3E2723]/10 bg-white sticky top-0 z-20">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 text-sm font-bold text-[#3E2723]/50 hover:text-[#3E2723] transition-colors">
            ← Back to Namma Brew
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-7 h-7 text-[#2E4F4F]" />
            <h1 className="font-bold text-xl tracking-tight">CampaignGuard AI</h1>
          </div>
          <p className="text-xs text-[#3E2723]/70 font-medium leading-relaxed">Turn your idea into a campaign you can trust.</p>
        </div>
        
        <div className="p-6 flex-1">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#3E2723]/40 mb-4">Workflow</h2>
          <nav className="space-y-1">
            <StepItem number="01" label="Business Brief" active={activeStep === 1} completed={activeStep > 1} />
            <StepItem number="02" label="Clarifications" active={activeStep === 2} upcoming={activeStep < 2} completed={activeStep > 2} />
            <StepItem number="03" label="Offer Lock" active={activeStep === 3} upcoming={activeStep < 3} completed={activeStep > 3 || !!lockedFacts} />
            <StepItem number="04" label="Audience" active={activeStep === 4} upcoming={activeStep < 4} completed={activeStep > 4} />
            <StepItem number="05" label="Strategy" active={activeStep === 5} upcoming={activeStep < 5} completed={activeStep > 5} />
            <StepItem number="06" label="Content" active={activeStep === 6} upcoming={activeStep < 6} completed={activeStep > 6} />
            <StepItem number="07" label="Validation" active={activeStep === 7} upcoming={activeStep < 7} completed={activeStep > 7} />
            <StepItem number="08" label="Prediction" active={activeStep === 8} upcoming={activeStep < 8} completed={activeStep > 8} />
            <StepItem number="09" label="Optimization" active={activeStep === 9} upcoming={activeStep < 9} completed={activeStep > 9} />
            <StepItem number="10" label="Approval" active={activeStep === 10} upcoming={activeStep < 10} completed={activeStep > 10} />
          </nav>
        </div>

        <div className="p-6 border-t border-[#3E2723]/10 bg-[#FDFBF7]">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#2E4F4F] mb-4 flex items-center gap-2"><Sparkles className="w-3.5 h-3.5" /> CampaignGuard Activity</h2>
          <div className="space-y-3">
             {activeStep >= 2 && <ActivityItem label="Business brief received" completed />}
             {activeStep >= 3 && <ActivityItem label="Required details verified" completed />}
             {activeStep === 3 && !lockedFacts && (
               <>
                 <ActivityItem label="Offer identified" completed />
                 <ActivityItem label="Product specificity verified" completed />
                 <ActivityItem label="Business intent protected" completed />
                 <ActivityItem label="Offer ready to lock" active />
               </>
             )}
             {lockedFacts && (
               <>
                 <ActivityItem label="Business offer locked" completed />
                 <ActivityItem label="Source of truth created" completed />
                 <ActivityItem label={`Version ${lockedFacts.version} created`} completed />
                 <ActivityItem label="Validation rules prepared" completed />
               </>
             )}
             {activeStep === 4 && (
               <>
                 <ActivityItem label="Analyzing audience" active={!audienceStrategy} completed={!!audienceStrategy} />
                 {audienceStrategy && (
                   <>
                     <ActivityItem label="Building audience strategy" completed />
                     <ActivityItem label="Recommending channels" completed />
                     <ActivityItem label="Preparing campaign strategy" completed />
                   </>
                 )}
               </>
             )}
             {activeStep === 5 && (
               <>
                 <ActivityItem label="Defining campaign objective" completed={!!campaignStrategy} active={!campaignStrategy} />
                 {campaignStrategy && (
                   <>
                     <ActivityItem label="Building message hierarchy" completed />
                     <ActivityItem label="Mapping channels" completed />
                     <ActivityItem label="Designing language strategy" completed />
                     <ActivityItem label="Creating content plan" completed />
                     <ActivityItem label="Validating campaign consistency" completed />
                     <ActivityItem label="Campaign strategy ready" active />
                   </>
                 )}
               </>
             )}
             {activeStep > 5 && <ActivityItem label="Campaign strategy ready" completed />}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative scroll-smooth">
        <header className="bg-white/80 backdrop-blur-md px-6 lg:px-10 py-6 border-b border-[#3E2723]/10 flex items-center justify-between sticky top-0 z-20">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-1 block">Campaign Workspace</span>
            <h2 className="text-2xl font-bold text-[#3E2723]">Tell us what you have in mind.</h2>
            <p className="text-[#3E2723]/70 text-sm mt-1 max-w-xl">Start with a rough idea. CampaignGuard will help turn it into a campaign without changing what your business actually means.</p>
          </div>
          <div className="hidden xl:flex items-center gap-2 px-4 py-2 bg-[#2E4F4F]/5 text-[#2E4F4F] rounded-full text-xs font-bold border border-[#2E4F4F]/10">
            <ShieldCheck className="w-4 h-4" />
            Your business intent stays protected.
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-10 flex flex-col xl:flex-row gap-10 items-start pb-32">
          
          {/* Main Area */}
          <div className="flex-1 w-full max-w-3xl space-y-12">
            
            {activeStep === 1 && (
              <>
                 <div className="flex justify-end gap-2">
                   <button type="button" onClick={() => handleDemoBrief(4)} className="text-xs font-bold text-red-700 bg-red-100 px-3 py-1.5 rounded-full">Conflict Demo</button>
                   <button type="button" onClick={() => handleDemoBrief(2)} className="text-xs font-bold text-orange-700 bg-orange-100 px-3 py-1.5 rounded-full">Missing Demo</button>
                   <button type="button" onClick={() => handleDemoBrief(1)} className="text-xs font-bold text-[#2E4F4F] bg-[#2E4F4F]/10 px-5 py-2.5 rounded-full hover:bg-[#2E4F4F]/20 transition-colors shadow-sm">
                     Fill Demo Brief
                   </button>
                 </div>

                 {/* Section 1 - Business */}
                 <section className="space-y-5 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[#3E2723]/5">
                   <h3 className="font-bold text-lg flex items-center gap-2 pb-2"><FileText className="w-5 h-5 text-[#D4AF37]" /> 1. Business Details</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                     <InputGroup label="Business Name *" error={errors.businessName}>
                       <input type="text" className={`w-full bg-[#FDFBF7] border ${errors.businessName ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-[#3E2723]/10 focus:border-[#2E4F4F] focus:ring-[#2E4F4F]/20'} rounded-xl px-4 py-3 outline-none focus:ring-2 transition-all`} placeholder="Namma Brew" value={brief.businessName || ""} onChange={e => setBrief({...brief, businessName: e.target.value})} />
                     </InputGroup>
                     <InputGroup label="Business Type *" error={errors.businessType}>
                       <input type="text" className={`w-full bg-[#FDFBF7] border ${errors.businessType ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-[#3E2723]/10 focus:border-[#2E4F4F] focus:ring-[#2E4F4F]/20'} rounded-xl px-4 py-3 outline-none focus:ring-2 transition-all`} placeholder="Café, restaurant, salon..." value={brief.businessType || ""} onChange={e => setBrief({...brief, businessType: e.target.value})} />
                     </InputGroup>
                     <div className="md:col-span-2">
                       <InputGroup label="Business Location *" error={errors.location}>
                         <input type="text" className={`w-full bg-[#FDFBF7] border ${errors.location ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-[#3E2723]/10 focus:border-[#2E4F4F] focus:ring-[#2E4F4F]/20'} rounded-xl px-4 py-3 outline-none focus:ring-2 transition-all`} placeholder="Koramangala, Bengaluru" value={brief.location || ""} onChange={e => setBrief({...brief, location: e.target.value})} />
                       </InputGroup>
                     </div>
                   </div>
                 </section>

                 {/* Section 2 - Rough Idea */}
                 <section className="space-y-5 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[#3E2723]/5">
                   <h3 className="font-bold text-lg flex items-center gap-2 pb-2"><Sparkles className="w-5 h-5 text-[#D4AF37]" /> 2. Your Idea</h3>
                   <InputGroup label="What are you trying to promote? *" error={errors.roughIdea}>
                     <p className="text-xs text-[#3E2723]/60 mb-3 font-medium">Don't worry about writing a perfect brief. Just describe your idea.</p>
                     <textarea 
                       className={`w-full bg-[#FDFBF7] border ${errors.roughIdea ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-[#3E2723]/10 focus:border-[#2E4F4F] focus:ring-[#2E4F4F]/20'} rounded-xl px-4 py-4 outline-none focus:ring-2 transition-all min-h-[160px] resize-y text-base`} 
                       placeholder="Example:&#10;I want to attract more college students this weekend.&#10;Give them 20% off on coffee and promote it on Instagram and WhatsApp."
                       value={brief.roughIdea || ""}
                       onChange={e => setBrief({...brief, roughIdea: e.target.value})}
                     ></textarea>
                   </InputGroup>
                 </section>

                 {/* Section 3 - Goal */}
                 <section className="space-y-5 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[#3E2723]/5">
                   <h3 className="font-bold text-lg flex items-center gap-2 pb-2"><Target className="w-5 h-5 text-[#D4AF37]" /> 3. Campaign Goal</h3>
                   <InputGroup label="What do you want to achieve?">
                     <div className="flex flex-wrap gap-2 mt-2">
                       {goals.map(goal => (
                         <SelectableChip 
                           key={goal} 
                           label={goal} 
                           selected={(brief.campaignGoal || []).includes(goal)} 
                           onClick={() => toggleArrayItem("campaignGoal", goal)} 
                         />
                       ))}
                     </div>
                   </InputGroup>
                 </section>

                 {/* Section 4 - Audience */}
                 <section className="space-y-5 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[#3E2723]/5">
                   <h3 className="font-bold text-lg flex items-center gap-2 pb-2"><Users className="w-5 h-5 text-[#D4AF37]" /> 4. Target Audience</h3>
                   <InputGroup label="Who are you trying to reach?">
                     <input type="text" className="w-full bg-[#FDFBF7] border border-[#3E2723]/10 rounded-xl px-4 py-3 outline-none focus:border-[#2E4F4F] focus:ring-2 focus:ring-[#2E4F4F]/20 transition-all mb-4" placeholder="College students, young professionals, families..." value={brief.targetAudience || ""} onChange={e => setBrief({...brief, targetAudience: e.target.value})} />
                     <div className="flex flex-wrap gap-2">
                       {audienceChips.map(chip => (
                         <button type="button" 
                           key={chip}
                           onClick={(e) => {
                              e.preventDefault();
                              const current = brief.targetAudience || "";
                             if (!current.includes(chip)) {
                               setBrief({...brief, targetAudience: current ? `${current}, ${chip}` : chip});
                             }
                           }}
                           className="px-3 py-1.5 bg-[#F5F0E6] text-[#3E2723]/80 rounded-lg text-xs font-medium hover:bg-[#E8DFD1] transition-colors"
                         >
                           + {chip}
                         </button>
                       ))}
                     </div>
                   </InputGroup>
                 </section>

                 {/* Section 5 - Offer */}
                 <section className="space-y-5 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[#3E2723]/5">
                   <h3 className="font-bold text-lg flex items-center gap-2 pb-2"><ShieldCheck className="w-5 h-5 text-[#D4AF37]" /> 5. Offer / Promotion</h3>
                   <div className="grid grid-cols-1 gap-6">
                     <InputGroup label="What is the exact offer?">
                       <input type="text" className="w-full bg-[#FDFBF7] border border-[#3E2723]/10 rounded-xl px-4 py-3 outline-none focus:border-[#2E4F4F] focus:ring-2 focus:ring-[#2E4F4F]/20 transition-all" placeholder="e.g. 20% OFF" value={brief.offer || ""} onChange={e => setBrief({...brief, offer: e.target.value})} />
                     </InputGroup>
                     <InputGroup label="What product/service does it apply to?">
                       <input type="text" className="w-full bg-[#FDFBF7] border border-[#3E2723]/10 rounded-xl px-4 py-3 outline-none focus:border-[#2E4F4F] focus:ring-2 focus:ring-[#2E4F4F]/20 transition-all" placeholder="e.g. Cappuccino" value={brief.exactOfferDetails || ""} onChange={e => setBrief({...brief, exactOfferDetails: e.target.value})} />
                     </InputGroup>
                     <InputGroup label="When is it valid?">
                       <input type="text" className="w-full bg-[#FDFBF7] border border-[#3E2723]/10 rounded-xl px-4 py-3 outline-none focus:border-[#2E4F4F] focus:ring-2 focus:ring-[#2E4F4F]/20 transition-all" placeholder="e.g. Saturday & Sunday" value={brief.offerValidity || ""} onChange={e => setBrief({...brief, offerValidity: e.target.value})} />
                     </InputGroup>
                     <InputGroup label="Any conditions? (Optional)">
                       <input type="text" className="w-full bg-[#FDFBF7] border border-[#3E2723]/10 rounded-xl px-4 py-3 outline-none focus:border-[#2E4F4F] focus:ring-2 focus:ring-[#2E4F4F]/20 transition-all" placeholder="e.g. Valid Student ID Required" value={brief.conditions || ""} onChange={e => setBrief({...brief, conditions: e.target.value})} />
                     </InputGroup>
                   </div>
                   <div className="flex items-start gap-2 mt-4 p-3 bg-[#D4AF37]/10 rounded-lg border border-[#D4AF37]/20">
                     <AlertCircle className="w-4 h-4 text-[#b5952f] shrink-0 mt-0.5" />
                     <p className="text-xs text-[#3E2723]/80 leading-relaxed">
                       <span className="font-bold block mb-1">Important:</span>
                       Do NOT automatically invent discount percentages, prices, or dates. If you leave them empty, CampaignGuard will ask for clarification.
                     </p>
                   </div>
                 </section>

                 {/* Section 6 & 7 - Language & Channels */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <section className="space-y-5 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[#3E2723]/5">
                     <h3 className="font-bold text-lg flex items-center gap-2 pb-2"><Languages className="w-5 h-5 text-[#D4AF37]" /> 6. Language</h3>
                     <InputGroup label="Which languages should the campaign use?">
                       <div className="flex flex-wrap gap-2 mt-2">
                         {languageOptions.map(opt => (
                           <SelectableChip key={opt} label={opt} selected={(brief.languages || []).includes(opt)} onClick={() => toggleArrayItem("languages", opt)} />
                         ))}
                       </div>
                     </InputGroup>
                   </section>

                   <section className="space-y-5 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[#3E2723]/5">
                     <h3 className="font-bold text-lg flex items-center gap-2 pb-2"><MessageSquare className="w-5 h-5 text-[#D4AF37]" /> 7. Channels</h3>
                     <InputGroup label="Where do you want to reach customers?">
                       <div className="flex flex-wrap gap-2 mt-2">
                         {channelOptions.map(opt => (
                           <SelectableChip key={opt} label={opt} selected={(brief.channels || []).includes(opt)} onClick={() => toggleArrayItem("channels", opt)} />
                         ))}
                       </div>
                     </InputGroup>
                   </section>
                 </div>

                 {/* Section 8 - Tone */}
                 <section className="space-y-5 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[#3E2723]/5">
                   <h3 className="font-bold text-lg flex items-center gap-2 pb-2"><MessageSquare className="w-5 h-5 text-[#D4AF37]" /> 8. Brand Tone</h3>
                   <InputGroup label="How should the campaign sound?">
                     <div className="flex flex-wrap gap-2 mt-2">
                       {toneOptions.map(opt => (
                         <SelectableChip key={opt} label={opt} selected={(brief.brandTone || []).includes(opt)} onClick={() => toggleArrayItem("brandTone", opt)} />
                       ))}
                     </div>
                   </InputGroup>
                 </section>
              </>
            )}

            {activeStep === 2 && analysis && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header for Clarification */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#3E2723]/5">
                   <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2 block">Campaign Clarification</span>
                   <h2 className="text-3xl font-bold text-[#3E2723] mb-3">Let's make sure we understood you correctly.</h2>
                   <p className="text-[#3E2723]/70">We'll identify anything important that's missing before creating your campaign. You stay in control of what your business promises.</p>
                   <div className="mt-6 flex items-center gap-2 px-4 py-2.5 bg-[#2E4F4F]/5 text-[#2E4F4F] rounded-full text-xs font-bold border border-[#2E4F4F]/10 w-fit">
                     <ShieldCheck className="w-4 h-4" />
                     Critical business facts will never be guessed.
                   </div>
                </div>

                {analysis.status === "has_conflicts" && (
                  <div className="bg-red-50 border border-red-200 p-8 rounded-3xl">
                    <h3 className="text-red-800 font-bold text-xl flex items-center gap-2 mb-4"><AlertCircle className="w-6 h-6" /> INFORMATION CONFLICT</h3>
                    <p className="text-red-700 font-medium mb-6">{analysis.conflicts[0].message}</p>
                    <div className="flex flex-col md:flex-row gap-4">
                      <button type="button" 
                        onClick={() => {
                          const newBrief = {...brief, [analysis.conflicts[0].field]: analysis.conflicts[0].versionA};
                          setBrief(newBrief);
                          setAnalysis(analyzeCampaignBrief(newBrief));
                        }}
                        className="flex-1 bg-white border-2 border-red-200 p-4 rounded-2xl hover:border-red-400 transition-colors text-left"
                      >
                        <span className="block text-xs font-bold text-red-400 mb-1">Version A</span>
                        <span className="block font-medium text-red-900">{analysis.conflicts[0].versionA}</span>
                      </button>
                      <button type="button" 
                        onClick={() => {
                          const newBrief = {...brief, [analysis.conflicts[0].field]: analysis.conflicts[0].versionB};
                          setBrief(newBrief);
                          setAnalysis(analyzeCampaignBrief(newBrief));
                        }}
                        className="flex-1 bg-white border-2 border-red-200 p-4 rounded-2xl hover:border-red-400 transition-colors text-left"
                      >
                        <span className="block text-xs font-bold text-red-400 mb-1">Version B</span>
                        <span className="block font-medium text-red-900">{analysis.conflicts[0].versionB}</span>
                      </button>
                    </div>
                  </div>
                )}

                {analysis.status === "needs_clarification" && analysis.questions.filter(q => q.status === "current").map(q => (
                  <div key={q.id} className="bg-white p-8 rounded-3xl shadow-sm border border-[#3E2723]/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#D4AF37]"></div>
                    <div className="flex items-center gap-2 mb-4 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                      <MessageSquare className="w-4 h-4" /> AI Needs Clarification
                    </div>
                    <h3 className="text-2xl font-bold text-[#3E2723] mb-3">{q.question}</h3>
                    <p className="text-[#3E2723]/60 text-sm mb-8 bg-[#F5F0E6] p-4 rounded-xl italic">Reason: {q.reason}</p>
                    
                    <div className="space-y-4">
                      {q.type === "text" && (
                        <textarea 
                           className="w-full bg-[#FDFBF7] border border-[#3E2723]/20 rounded-xl px-4 py-4 outline-none focus:border-[#2E4F4F] focus:ring-2 focus:ring-[#2E4F4F]/20 transition-all min-h-[120px]" 
                           placeholder="Type your answer here..."
                           onChange={e => q.answer = e.target.value}
                        ></textarea>
                      )}
                      {q.type === "single-select" && q.options && (
                         <div className="flex flex-col gap-3">
                           {q.options.map(opt => (
                             <label key={opt} className="flex items-center gap-3 p-4 rounded-xl border border-[#3E2723]/10 hover:bg-[#F5F0E6] cursor-pointer transition-colors">
                               <input type="radio" name={q.id} value={opt} onChange={e => q.answer = e.target.value} className="w-4 h-4 text-[#2E4F4F] focus:ring-[#2E4F4F]" />
                               <span className="font-medium text-[#3E2723]">{opt}</span>
                             </label>
                           ))}
                         </div>
                      )}
                      
                      <button type="button" 
                        onClick={() => {
                          if (!q.answer) return alert("Please provide an answer.");
                          const newBrief = { ...brief, [q.field]: q.answer };
                          setBrief(newBrief);
                          setAnalysis(analyzeCampaignBrief(newBrief));
                        }}
                        className="mt-6 px-8 py-3 bg-[#3E2723] text-white rounded-full font-bold hover:bg-[#2a1a17] transition-colors shadow-md"
                      >
                        Confirm Answer
                      </button>
                    </div>
                  </div>
                ))}

                {analysis.status === "ready_for_offer_lock" && (
                  <div className="bg-[#2E4F4F] text-white p-10 rounded-3xl shadow-xl text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-8 h-8 text-[#D4AF37]" />
                    </div>
                    <h3 className="text-3xl font-bold mb-3">Clarification Complete</h3>
                    <p className="text-white/80 text-lg max-w-lg mb-8">Your campaign brief is clear enough to continue. Your business facts are ready to be locked.</p>
                  </div>
                )}
              </div>
            )}
            
            {activeStep === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header for Offer Lock */}
                <div className="bg-[#1C1917] p-10 rounded-[32px] shadow-xl text-white relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-10">
                     <ShieldCheck className="w-64 h-64" />
                   </div>
                   <div className="relative z-10">
                     <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-3 block">Business Offer — Source of Truth</span>
                     <h2 className="text-4xl font-bold mb-4">Lock what must never change.</h2>
                     <p className="text-white/70 max-w-xl text-lg mb-8">Review and lock the exact business facts that AI must preserve across every campaign.</p>
                     <div className="inline-flex items-center gap-2 px-5 py-3 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full text-sm font-bold border border-[#D4AF37]/20 backdrop-blur-sm">
                       <ShieldCheck className="w-5 h-5" />
                       BUSINESS INTENT PROTECTION
                     </div>
                   </div>
                </div>

                {!lockedFacts ? (
                  <div className="space-y-6">
                    {/* Business Context Card */}
                    <div className="bg-white rounded-[24px] shadow-sm border border-[#3E2723]/10 overflow-hidden">
                      <div className="p-5 border-b border-[#3E2723]/5 bg-[#FDFBF7]">
                        <h3 className="font-bold text-[#3E2723] uppercase tracking-wider text-xs">Business Context</h3>
                      </div>
                      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div><span className="block text-[10px] uppercase font-bold text-[#3E2723]/40 mb-1">Business</span><span className="font-medium text-[#3E2723]">{getLockedBusinessFacts().businessName}</span></div>
                        <div><span className="block text-[10px] uppercase font-bold text-[#3E2723]/40 mb-1">Business Type</span><span className="font-medium text-[#3E2723]">{getLockedBusinessFacts().businessType}</span></div>
                        <div><span className="block text-[10px] uppercase font-bold text-[#3E2723]/40 mb-1">Location</span><span className="font-medium text-[#3E2723]">{getLockedBusinessFacts().location}</span></div>
                      </div>
                    </div>

                    {/* Offer Details Card - VISUALLY DOMINANT */}
                    <div className="bg-[#2E4F4F] rounded-[24px] shadow-lg text-white overflow-hidden border border-[#2E4F4F]">
                      <div className="p-5 border-b border-white/10 bg-white/5 flex justify-between items-center">
                        <h3 className="font-bold uppercase tracking-wider text-xs text-white/80">Offer Details</h3>
                        <div className="flex items-center gap-2 px-3 py-1 bg-yellow-400/20 text-yellow-300 rounded-full text-[10px] font-bold tracking-wider uppercase">
                          <AlertCircle className="w-3.5 h-3.5" /> Review Required
                        </div>
                      </div>
                      <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10 bg-gradient-to-br from-[#2E4F4F] to-[#1f3636]">
                        <div className="space-y-8">
                          <div>
                            <span className="block text-xs uppercase font-bold text-white/50 mb-2 tracking-widest">Offer</span>
                            <span className="text-5xl font-black text-[#D4AF37] drop-shadow-md">{getLockedBusinessFacts().offer}</span>
                          </div>
                          <div>
                            <span className="block text-xs uppercase font-bold text-white/50 mb-2 tracking-widest">Applies To</span>
                            <span className="text-3xl font-bold bg-white text-[#2E4F4F] px-4 py-2 rounded-xl inline-block shadow-sm">{getLockedBusinessFacts().offerAppliesTo}</span>
                          </div>
                        </div>
                        <div className="space-y-6">
                          <div><span className="block text-xs uppercase font-bold text-white/50 mb-1 tracking-widest">Eligible Customers</span><span className="text-xl font-medium">{getLockedBusinessFacts().eligibleCustomers}</span></div>
                          <div><span className="block text-xs uppercase font-bold text-white/50 mb-1 tracking-widest">Validity</span><span className="text-xl font-medium">{getLockedBusinessFacts().validity}</span></div>
                          <div><span className="block text-xs uppercase font-bold text-white/50 mb-1 tracking-widest">Condition</span><span className="text-lg font-medium text-white/80 bg-white/10 px-3 py-1.5 rounded-lg inline-block">{getLockedBusinessFacts().conditions}</span></div>
                        </div>
                      </div>
                      <div className="p-6 bg-[#1f3636] flex items-center justify-between border-t border-white/10">
                         <p className="text-white font-medium italic">"{getLockedBusinessFacts().eligibleCustomers} get {getLockedBusinessFacts().offer} on {getLockedBusinessFacts().offerAppliesTo} every {getLockedBusinessFacts().validity} with a {getLockedBusinessFacts().conditions}."</p>
                         <span className="shrink-0 ml-4 px-3 py-1 bg-white/10 text-white/80 rounded-full text-[10px] font-bold uppercase tracking-wider">✓ AI-readable business rule</span>
                      </div>
                    </div>

                    {/* What AI Can and Cannot Change */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white rounded-[24px] p-8 border border-[#3E2723]/10">
                         <h4 className="font-bold text-[#3E2723] mb-6 flex items-center gap-2"><Sparkles className="w-5 h-5 text-[#2E4F4F]" /> AI CAN ADAPT</h4>
                         <ul className="space-y-3 text-sm font-medium text-[#3E2723]/70">
                           <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Language & Tone</li>
                           <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Headlines and hooks</li>
                           <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Message length</li>
                           <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> CTA wording</li>
                           <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Cultural phrasing</li>
                         </ul>
                         <div className="mt-8 p-4 bg-[#F5F0E6] rounded-xl border border-[#3E2723]/10">
                           <p className="text-xs text-[#3E2723]/60 mb-2 font-bold uppercase tracking-wider">AI May Transform This Into:</p>
                           <p className="text-[#3E2723] font-medium italic">"ಕಾಲೇಜ್ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ Cappuccino ಮೇಲೆ 20% OFF!"</p>
                         </div>
                      </div>
                      
                      <div className="bg-white rounded-[24px] p-8 border border-red-100 shadow-[inset_0_0_40px_rgba(254,226,226,0.2)]">
                         <h4 className="font-bold text-[#3E2723] mb-6 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-red-600" /> AI CANNOT CHANGE</h4>
                         <ul className="space-y-3 text-sm font-medium text-[#3E2723]/70">
                           <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> Offer percentage</li>
                           <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> Product</li>
                           <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> Eligible customers</li>
                           <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> Validity & Conditions</li>
                           <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> Business name & Location</li>
                         </ul>
                         <div className="mt-8 p-4 bg-red-50 rounded-xl border border-red-100">
                           <p className="text-xs text-red-800/60 mb-2 font-bold uppercase tracking-wider">AI Must NEVER Transform Into:</p>
                           <p className="text-red-800 font-medium italic line-through mb-1">"20% OFF on Coffee"</p>
                           <p className="text-red-800 font-medium italic line-through">"30% OFF on Cappuccino"</p>
                         </div>
                      </div>
                    </div>
                    
                    {/* Review Before Locking */}
                    <div className="p-8 bg-white rounded-[24px] border border-[#3E2723]/20 shadow-sm mt-8">
                      <h4 className="font-bold text-[#3E2723] mb-4 text-xl">Review before locking</h4>
                      
                      <label className="flex items-start gap-4 cursor-pointer group mb-8 p-4 bg-[#FDFBF7] border border-[#3E2723]/10 rounded-xl hover:border-[#2E4F4F]/50 transition-colors">
                        <input type="checkbox" checked={lockCheckbox} onChange={e => setLockCheckbox(e.target.checked)} className="mt-1 w-6 h-6 text-[#2E4F4F] rounded border-[#3E2723]/20 focus:ring-[#2E4F4F]" />
                        <span className="font-medium text-[#3E2723] text-lg group-hover:text-[#2E4F4F] transition-colors">I confirm that these details accurately represent the business offer.</span>
                      </label>
                      
                      <div className="flex gap-4">
                        <button type="button" onClick={() => setActiveStep(2)} className="px-8 py-4 bg-[#F5F0E6] text-[#3E2723] rounded-full font-bold hover:bg-[#E8DFD1] transition-colors">
                          Go Back
                        </button>
                        <button type="button" 
                          onClick={handleLockFacts}
                          disabled={!lockCheckbox} 
                          className={`px-10 py-4 rounded-full font-bold flex items-center gap-3 transition-all text-lg ${lockCheckbox ? 'bg-[#1C1917] text-white shadow-xl hover:-translate-y-1' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                        >
                          <ShieldCheck className="w-5 h-5" /> Lock Business Offer
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Locked State Header */}
                    <div className="bg-[#1C1917] p-8 rounded-[24px] text-white flex items-center justify-between border border-[#D4AF37]/30 shadow-[0_0_40px_rgba(212,175,55,0.15)]">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                          <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
                        </div>
                        <div>
                          <h3 className="font-black text-2xl text-[#D4AF37] uppercase tracking-wide">Business Intent Protected</h3>
                          <p className="text-white/80 font-medium mt-1">Offer Locked Successfully</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-sm font-bold border border-white/10 mb-1">
                          Version {lockedFacts.version} • Locked
                        </div>
                        <p className="text-[10px] text-white/50 uppercase tracking-wider">{new Date(lockedFacts.lockedAt).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    {/* Locked Facts Display */}
                    <div className="bg-white rounded-[24px] border border-[#3E2723]/10 p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 shadow-sm">
                      <div><span className="block text-[10px] uppercase font-bold text-[#3E2723]/40 mb-2">Offer</span><span className="text-3xl font-black text-[#2E4F4F]">{lockedFacts.facts.offer}</span></div>
                      <div><span className="block text-[10px] uppercase font-bold text-[#3E2723]/40 mb-2">Applies To</span><span className="text-2xl font-bold text-[#3E2723]">{lockedFacts.facts.offerAppliesTo}</span></div>
                      <div><span className="block text-[10px] uppercase font-bold text-[#3E2723]/40 mb-2">Eligible Customers</span><span className="text-xl font-medium text-[#3E2723]">{lockedFacts.facts.eligibleCustomers}</span></div>
                      <div><span className="block text-[10px] uppercase font-bold text-[#3E2723]/40 mb-2">Validity</span><span className="text-lg font-medium text-[#3E2723]">{lockedFacts.facts.validity}</span></div>
                      <div><span className="block text-[10px] uppercase font-bold text-[#3E2723]/40 mb-2">Condition</span><span className="text-lg font-medium text-[#3E2723]">{lockedFacts.facts.conditions}</span></div>
                      <div className="flex items-end justify-end">
                         <button type="button" onClick={handleRequestChange} className="px-6 py-3 bg-red-50 text-red-700 hover:bg-red-100 rounded-full font-bold text-sm transition-colors border border-red-200">
                           Request Change
                         </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeStep === 4 && audienceStrategy && lockedFacts && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header for Audience Strategy */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#3E2723]/5">
                   <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2 block">Audience Intelligence</span>
                   <h2 className="text-3xl font-bold text-[#3E2723] mb-3">Who should this campaign speak to?</h2>
                   <p className="text-[#3E2723]/70">CampaignGuard identifies the people most relevant to your campaign and recommends how to communicate with them.</p>
                   <div className="mt-6 flex items-center gap-2 px-4 py-2.5 bg-[#2E4F4F]/5 text-[#2E4F4F] rounded-full text-xs font-bold border border-[#2E4F4F]/10 w-fit">
                     <ShieldCheck className="w-4 h-4" />
                     Audience insights never change your approved business facts.
                   </div>
                </div>
                
                {/* Locked Context Panel */}
                <div className="bg-[#F5F0E6] p-6 rounded-3xl shadow-inner border border-[#3E2723]/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-[#3E2723] uppercase tracking-wider flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> LOCKED BUSINESS CONTEXT</h3>
                    <button type="button" onClick={() => setActiveStep(3)} className="text-xs font-bold text-[#2E4F4F] underline">View Locked Facts</button>
                  </div>
                  <div className="flex flex-wrap gap-x-8 gap-y-3">
                    <div className="flex flex-col"><span className="text-[10px] uppercase text-[#3E2723]/50 font-bold">Business</span><span className="text-sm font-medium">{lockedFacts.facts.businessName}</span></div>
                    <div className="flex flex-col"><span className="text-[10px] uppercase text-[#3E2723]/50 font-bold">Offer</span><span className="text-sm font-medium">{lockedFacts.facts.offer}</span></div>
                    <div className="flex flex-col"><span className="text-[10px] uppercase text-[#3E2723]/50 font-bold">Product</span><span className="text-sm font-medium">{lockedFacts.facts.productOrService}</span></div>
                    <div className="flex flex-col"><span className="text-[10px] uppercase text-[#3E2723]/50 font-bold">Validity</span><span className="text-sm font-medium">{lockedFacts.facts.validity}</span></div>
                    <div className="flex flex-col"><span className="text-[10px] uppercase text-[#3E2723]/50 font-bold">Location</span><span className="text-sm font-medium">{lockedFacts.facts.location}</span></div>
                  </div>
                </div>

                {/* Offer-Audience Consistency */}
                {audienceStrategy.alignmentWarning ? (
                  <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-3xl flex items-start gap-4">
                     <AlertCircle className="w-6 h-6 text-yellow-600 shrink-0 mt-0.5" />
                     <div>
                       <h4 className="font-bold text-yellow-800">Potential Mismatch</h4>
                       <p className="text-yellow-700 text-sm mt-1">{audienceStrategy.alignmentWarning}</p>
                     </div>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 p-4 rounded-2xl flex items-center gap-3">
                     <CheckCircle2 className="w-5 h-5 text-green-600" />
                     <span className="font-medium text-green-800 text-sm">Audience aligns perfectly with the locked offer.</span>
                  </div>
                )}

                {/* Primary Audience */}
                {audienceStrategy.primaryAudience && (
                  <div className="bg-white rounded-3xl shadow-sm border border-[#3E2723]/10 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#D4AF37]"></div>
                    <div className="p-6 border-b border-[#3E2723]/5 flex justify-between items-center">
                       <div>
                         <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] mb-1 block">Primary Audience</span>
                         <h3 className="text-2xl font-bold text-[#3E2723]">{audienceStrategy.primaryAudience.name}</h3>
                       </div>
                       <div className="px-3 py-1 bg-[#2E4F4F]/10 text-[#2E4F4F] rounded-full text-xs font-bold">High Relevance</div>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FDFBF7]">
                       <div>
                         <h4 className="text-xs font-bold text-[#3E2723]/40 uppercase tracking-wider mb-1">Motivation</h4>
                         <p className="text-sm font-medium text-[#3E2723]">{audienceStrategy.primaryAudience.motivation}</p>
                       </div>
                       <div>
                         <h4 className="text-xs font-bold text-[#3E2723]/40 uppercase tracking-wider mb-1">Likely Need</h4>
                         <p className="text-sm font-medium text-[#3E2723]">{audienceStrategy.primaryAudience.needs}</p>
                       </div>
                       <div>
                         <h4 className="text-xs font-bold text-[#3E2723]/40 uppercase tracking-wider mb-1">Messaging Preference</h4>
                         <p className="text-sm font-medium text-[#3E2723]">{audienceStrategy.primaryAudience.messagingPreference}</p>
                       </div>
                       <div>
                         <h4 className="text-xs font-bold text-[#3E2723]/40 uppercase tracking-wider mb-1">Recommended Tone</h4>
                         <p className="text-sm font-medium text-[#3E2723]">{audienceStrategy.primaryAudience.recommendedTone}</p>
                       </div>
                    </div>
                    <div className="p-6 bg-white border-t border-[#3E2723]/5">
                      <h4 className="text-xs font-bold text-[#3E2723]/40 uppercase tracking-wider mb-2">Message Angle</h4>
                      <p className="text-lg font-bold text-[#2E4F4F]">"{audienceStrategy.primaryAudience.messageAngle}"</p>
                    </div>
                  </div>
                )}

                {/* Secondary & Suggested Audiences */}
                {(audienceStrategy.secondaryAudiences.length > 0 || audienceStrategy.suggestedAudiences.length > 0) && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg text-[#3E2723]">Other Potential Audiences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {audienceStrategy.secondaryAudiences.map(aud => (
                        <div key={aud.id} className="bg-white p-5 rounded-2xl shadow-sm border border-[#3E2723]/10">
                          <div className="flex justify-between items-start mb-2">
                             <h4 className="font-bold text-[#3E2723]">{aud.name}</h4>
                             <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-1 rounded">Secondary</span>
                          </div>
                          <p className="text-xs text-[#3E2723]/70 mb-3">{aud.motivation}</p>
                          <div className="text-xs font-medium text-[#2E4F4F]">Angle: "{aud.messageAngle}"</div>
                        </div>
                      ))}
                      {audienceStrategy.suggestedAudiences.map(aud => (
                        <div key={aud.id} className="bg-white p-5 rounded-2xl shadow-sm border border-[#3E2723]/10 border-dashed">
                          <div className="flex justify-between items-start mb-2">
                             <h4 className="font-bold text-[#3E2723]">{aud.name}</h4>
                             <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 px-2 py-1 rounded">Suggested</span>
                          </div>
                          <p className="text-xs text-[#3E2723]/70 mb-3">{aud.motivation}</p>
                          <div className="text-xs font-medium text-[#2E4F4F]">Angle: "{aud.messageAngle}"</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strategy Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Channels */}
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#3E2723]/5">
                    <h3 className="font-bold text-lg mb-4 text-[#3E2723]">Recommended Channels</h3>
                    <div className="space-y-4">
                      {audienceStrategy.recommendedChannels.map(ch => (
                        <div key={ch.name} className="flex flex-col gap-1 border-b border-[#3E2723]/5 pb-3 last:border-0 last:pb-0">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[#3E2723]">{ch.name}</span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${ch.relevance === 'High' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{ch.relevance}</span>
                          </div>
                          <p className="text-xs text-[#3E2723]/60">{ch.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#3E2723]/5">
                    <h3 className="font-bold text-lg mb-4 text-[#3E2723]">Language Strategy</h3>
                    <div className="space-y-4">
                      {audienceStrategy.languageStrategy.map(lang => (
                        <div key={lang.language} className="flex flex-col gap-1 border-b border-[#3E2723]/5 pb-3 last:border-0 last:pb-0">
                          <div className="flex items-center gap-2">
                            <Languages className="w-4 h-4 text-[#D4AF37]" />
                            <span className="font-bold text-[#3E2723]">{lang.language}</span>
                          </div>
                          <span className="text-[10px] font-bold uppercase text-[#3E2723]/50">{lang.role}</span>
                          <p className="text-xs text-[#3E2723]/70">{lang.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Audience Confirmation */}
                <div className="bg-[#2E4F4F] text-white p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
                   <div>
                     <h3 className="text-xl font-bold mb-1">Audience Strategy Ready</h3>
                     <p className="text-white/70 text-sm">Review complete. Ready to proceed to Campaign Strategy.</p>
                   </div>
                   <button type="button" className="px-6 py-2 bg-white/10 hover:bg-white/20 transition-colors text-white rounded-full text-sm font-bold border border-white/20">
                     Edit Audience
                   </button>
                </div>
              </div>
            )}

            {activeStep === 5 && campaignStrategy && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                {/* Header */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#3E2723]/5">
                   <div className="flex items-center gap-4 mb-4">
                     <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-[10px] font-bold uppercase flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Intent Protected</div>
                     <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-[10px] font-bold uppercase flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Audience Ready</div>
                   </div>
                   <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2 block">Campaign Strategy</span>
                   <h2 className="text-3xl font-bold text-[#3E2723] mb-3">Build the campaign blueprint before generating the final content.</h2>
                   <div className="mt-6 flex items-center gap-2 px-4 py-2.5 bg-[#2E4F4F]/5 text-[#2E4F4F] rounded-full text-xs font-bold border border-[#2E4F4F]/10 w-fit">
                     <Sparkles className="w-4 h-4" />
                     Strategy Ready
                   </div>
                </div>

                {/* Campaign Objective & Core Message */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-[#2E4F4F] p-8 rounded-[24px] shadow-lg text-white">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-white/50 mb-6">Campaign Objective</h3>
                    <div className="space-y-6">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#D4AF37] block mb-1">Primary Goal</span>
                        <span className="text-3xl font-bold">{campaignStrategy.campaignObjective}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#D4AF37] block mb-1">Supporting Objective</span>
                        <span className="text-lg font-medium text-white/80">{campaignStrategy.supportingObjective}</span>
                      </div>
                      <div className="p-4 bg-white/10 rounded-xl border border-white/10">
                        <span className="text-[10px] uppercase font-bold text-white/50 block mb-1">Success Direction</span>
                        <p className="text-sm font-medium italic">"Encourage eligible {campaignStrategy.audience.toLowerCase()} to visit {lockedFacts?.facts.businessName} and redeem the {lockedFacts?.facts.offerAppliesTo} offer."</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-[24px] shadow-sm border border-[#3E2723]/10 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-xs uppercase tracking-wider text-[#3E2723]/40 mb-6">Core Message</h3>
                      <p className="text-2xl font-bold text-[#3E2723] leading-snug">"{campaignStrategy.coreMessage}"</p>
                    </div>
                    <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-800 rounded-full text-[10px] font-bold border border-yellow-200 w-fit">
                      <ShieldCheck className="w-3.5 h-3.5" /> Contains protected offer facts
                    </div>
                  </div>
                </div>

                {/* Message Hierarchy */}
                <div className="bg-white p-8 rounded-[24px] shadow-sm border border-[#3E2723]/10">
                  <h3 className="font-bold text-xl text-[#3E2723] mb-6">Message Hierarchy</h3>
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 md:items-center p-4 bg-[#FDFBF7] rounded-xl border border-[#3E2723]/5">
                      <span className="w-32 text-xs font-bold uppercase tracking-wider text-[#3E2723]/40">01 — Hook</span>
                      <span className="font-medium text-[#3E2723] text-lg">"{campaignStrategy.messageHierarchy.hook}"</span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 md:items-center p-4 bg-green-50 rounded-xl border border-green-200">
                      <span className="w-32 text-xs font-bold uppercase tracking-wider text-green-700/60">02 — Offer</span>
                      <span className="font-bold text-green-900 text-lg">"{campaignStrategy.messageHierarchy.offerMessage}" <ShieldCheck className="w-4 h-4 inline text-green-600" /></span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 md:items-center p-4 bg-[#FDFBF7] rounded-xl border border-[#3E2723]/5">
                      <span className="w-32 text-xs font-bold uppercase tracking-wider text-[#3E2723]/40">03 — Validity</span>
                      <span className="font-medium text-[#3E2723] text-lg">"{campaignStrategy.messageHierarchy.validityMessage}"</span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 md:items-center p-4 bg-[#FDFBF7] rounded-xl border border-[#3E2723]/5">
                      <span className="w-32 text-xs font-bold uppercase tracking-wider text-[#3E2723]/40">04 — Condition</span>
                      <span className="font-medium text-[#3E2723] text-lg">"{campaignStrategy.messageHierarchy.conditionMessage}"</span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 md:items-center p-4 bg-[#F5F0E6] rounded-xl border border-[#3E2723]/10">
                      <span className="w-32 text-xs font-bold uppercase tracking-wider text-[#3E2723]/60">05 — CTA</span>
                      <span className="font-bold text-[#2E4F4F] text-lg">"{campaignStrategy.messageHierarchy.cta}"</span>
                    </div>
                  </div>
                </div>

                {/* Campaign Pillars */}
                <div>
                  <h3 className="font-bold text-xl text-[#3E2723] mb-6">Campaign Pillars</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {campaignStrategy.campaignPillars.map((pillar, i) => (
                      <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-[#3E2723]/5 flex flex-col h-full">
                        <span className="text-[10px] font-bold text-[#D4AF37] mb-2 uppercase tracking-wider">Pillar {i+1}</span>
                        <h4 className="font-bold text-[#3E2723] mb-3">{pillar.title}</h4>
                        <p className="text-sm text-[#3E2723]/70 leading-relaxed">{pillar.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Channel Strategy Matrix */}
                <div className="bg-[#1C1917] p-8 md:p-10 rounded-[32px] shadow-xl text-white">
                  <h3 className="font-bold text-2xl text-[#D4AF37] mb-8">Channel Strategy</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {campaignStrategy.channelStrategies.map(ch => (
                      <div key={ch.channel} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="border-b border-white/10 pb-4 mb-4 flex justify-between items-center">
                          <h4 className="font-black text-xl tracking-wider">{ch.channel}</h4>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full">{ch.role}</span>
                        </div>
                        <div className="space-y-5">
                          <div>
                            <span className="block text-[10px] uppercase font-bold text-white/40 mb-1">Content Format</span>
                            <span className="font-medium">{ch.contentFormat}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase font-bold text-white/40 mb-1">Messaging Style</span>
                            <span className="font-medium text-[#D4AF37]">{ch.messagingStyle.join(" • ")}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase font-bold text-white/40 mb-1">Primary Message</span>
                            <span className="font-bold text-lg">{ch.primaryMessage}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase font-bold text-white/40 mb-1">CTA</span>
                            <span className="font-medium">{ch.cta}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase font-bold text-white/40 mb-1">Language</span>
                            <span className="font-medium">{ch.languages.join(" + ")}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Cross-Channel Consistency */}
                  <div className="mt-8 p-6 bg-green-900/30 border border-green-500/30 rounded-2xl">
                    <h4 className="font-bold text-green-400 mb-4 uppercase tracking-wider text-xs">Cross-Channel Consistency</h4>
                    <div className="flex flex-wrap gap-4 mb-4">
                      <span className="text-sm font-bold text-white flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> Same offer</span>
                      <span className="text-sm font-bold text-white flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> Same product</span>
                      <span className="text-sm font-bold text-white flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> Same eligibility</span>
                      <span className="text-sm font-bold text-white flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> Same validity</span>
                      <span className="text-sm font-bold text-white flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> Same condition</span>
                    </div>
                    <p className="text-sm text-green-200/80 italic">Messaging format may change by channel, but business intent remains identical.</p>
                  </div>
                </div>

                {/* Content Plan & Message Map */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <h3 className="font-bold text-xl text-[#3E2723] mb-2">Content Plan</h3>
                    {campaignStrategy.contentPlan.map(cp => (
                      <div key={cp.title} className="bg-white p-6 rounded-2xl shadow-sm border border-[#3E2723]/10">
                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#3E2723]/5">
                          <h4 className="font-bold text-sm tracking-widest uppercase text-[#2E4F4F]">{cp.title}</h4>
                          <span className="text-xs font-bold text-[#3E2723]/50">{cp.channels.join(" + ")}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="block text-[10px] uppercase font-bold text-[#3E2723]/40 mb-1">Purpose</span>
                            <span className="font-medium text-sm text-[#3E2723]">{cp.purpose}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase font-bold text-[#3E2723]/40 mb-1">Angle</span>
                            <span className="font-bold text-sm text-[#3E2723]">{cp.angle}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#F5F0E6] p-6 rounded-3xl border border-[#3E2723]/10">
                    <h3 className="font-bold text-xl text-[#3E2723] mb-6">Message Map</h3>
                    <div className="space-y-4">
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-[#3E2723]/40 mb-1">Audience</span>
                        <span className="font-bold text-[#3E2723]">{campaignStrategy.audience}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-[#3E2723]/40 mb-1">Functional Benefit</span>
                        <span className="font-bold text-[#2E4F4F]">{lockedFacts?.facts.offer} on {lockedFacts?.facts.offerAppliesTo}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-[#3E2723]/40 mb-1">Requirement</span>
                        <span className="font-medium text-[#3E2723]">{lockedFacts?.facts.conditions}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-[#3E2723]/40 mb-1">Urgency</span>
                        <span className="font-medium text-[#3E2723]">{lockedFacts?.facts.validity}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-[#3E2723]/40 mb-1">CTA</span>
                        <span className="font-medium text-[#3E2723]">{campaignStrategy.primaryCta}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Strategy Validation */}
                <div className={`p-8 rounded-3xl border ${campaignStrategy.validation.valid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  {campaignStrategy.validation.valid ? (
                    <>
                      <h4 className="font-bold text-green-800 text-xl flex items-center gap-2 mb-4"><CheckCircle2 className="w-6 h-6" /> STRATEGY CONSISTENT</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <span className="text-sm font-medium text-green-900 flex items-center gap-2"><Check className="w-4 h-4" /> Clear objective</span>
                        <span className="text-sm font-medium text-green-900 flex items-center gap-2"><Check className="w-4 h-4" /> Core message defined</span>
                        <span className="text-sm font-medium text-green-900 flex items-center gap-2"><Check className="w-4 h-4" /> Channels mapped</span>
                        <span className="text-sm font-medium text-green-900 flex items-center gap-2"><Check className="w-4 h-4" /> Intent protected</span>
                      </div>
                      <p className="text-green-800 font-bold">Status: Ready for Content Generation</p>
                    </>
                  ) : (
                    <>
                      <h4 className="font-bold text-red-800 text-xl flex items-center gap-2 mb-4"><AlertCircle className="w-6 h-6" /> STRATEGY NEEDS REVIEW</h4>
                      <div className="space-y-2 mb-6">
                        {campaignStrategy.validation.violations.map((v, i) => (
                          <p key={i} className="text-red-700 font-medium flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {v}</p>
                        ))}
                      </div>
                      <p className="text-red-800 font-bold">Status: Blocked</p>
                    </>
                  )}
                </div>

              </div>
            )}
            
          </div>

          {/* Right Panel (Preview) */}
          <div className="w-full xl:w-80 space-y-6 xl:sticky top-32">
             
             {/* Preview Card */}
             <div className="bg-[#3E2723] text-white rounded-3xl p-6 shadow-xl border border-[#3E2723]/10">
               <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
                 <FileText className="w-5 h-5 text-[#D4AF37]" />
                 <h3 className="font-bold text-lg">Your Campaign Brief</h3>
               </div>
               
               <div className="space-y-4 text-sm">
                 <PreviewItem label="Business" value={brief.businessName} />
                 <PreviewItem label="Goal" value={(brief.campaignGoal || []).join(", ")} />
                 <PreviewItem label="Audience" value={brief.targetAudience} />
                 <PreviewItem label="Offer" value={brief.offer} />
                 <PreviewItem label="Languages" value={(brief.languages || []).join(" + ")} />
                 <PreviewItem label="Channels" value={(brief.channels || []).join(" + ")} />
                 <PreviewItem label="Tone" value={(brief.brandTone || []).join(", ")} />
               </div>
             </div>

             {/* Info Notice */}
             <div className="bg-[#2E4F4F]/5 rounded-3xl p-6 border border-[#2E4F4F]/10">
                <h4 className="font-bold text-[#2E4F4F] text-sm flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-4 h-4" />
                  CampaignGuard protects the facts you provide.
                </h4>
                <ul className="text-xs text-[#3E2723]/70 space-y-2">
                  <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" /> We won't invent critical offer details.</li>
                  <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" /> Missing information will be clarified before generation.</li>
                  <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" /> Approved business facts will be locked before campaign creation.</li>
                </ul>
             </div>

          </div>
        </div>
      </main>

      {/* Footer Action Bar */}
      <div className="fixed bottom-0 right-0 left-0 md:left-72 lg:left-80 bg-white/80 backdrop-blur-xl border-t border-[#3E2723]/10 p-4 px-6 md:px-10 flex items-center justify-between z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        {activeStep === 1 && (
          <>
            <button type="button" className="text-sm font-bold text-[#3E2723]/60 hover:text-[#3E2723] px-4 py-2 transition-colors">
              Save Draft
            </button>
            <button type="button" onClick={(e) => { e.preventDefault(); handleContinue(e); }} className="px-8 py-3 bg-[#2E4F4F] text-white rounded-full text-sm font-bold hover:bg-[#1f3636] transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Continue to Clarifications <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}
        {activeStep === 2 && (
          <>
            <button type="button" onClick={() => { setActiveStep(1); setAnalysis(null); }} className="text-sm font-bold text-[#3E2723]/60 hover:text-[#3E2723] px-4 py-2 transition-colors">
              Edit Campaign Brief
            </button>
            <button type="button" 
              onClick={() => { setActiveStep(3); window.scrollTo(0, 0); }}
              disabled={analysis?.status !== "ready_for_offer_lock"}
              className={`px-8 py-3 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${analysis?.status === "ready_for_offer_lock" ? 'bg-[#2E4F4F] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5' : 'bg-[#E8DFD1] text-[#3E2723]/40 cursor-not-allowed'}`}
            >
              Continue to Offer Lock <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}
        {activeStep === 3 && (
          <>
            <button type="button" onClick={() => setActiveStep(2)} className="text-sm font-bold text-[#3E2723]/60 hover:text-[#3E2723] px-4 py-2 transition-colors">
              Back to Clarifications
            </button>
            <button type="button" 
              disabled={!lockedFacts}
              onClick={() => {
                if (lockedFacts) {
                  setAudienceStrategy(analyzeAudience(brief, lockedFacts));
                  setActiveStep(4);
                  window.scrollTo(0, 0);
                }
              }}
              className={`px-8 py-3 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${lockedFacts ? 'bg-[#2E4F4F] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5' : 'bg-[#E8DFD1] text-[#3E2723]/40 cursor-not-allowed'}`}
            >
              Continue to Audience <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}
        {activeStep === 4 && (
          <>
            <button type="button" onClick={() => setActiveStep(3)} className="text-sm font-bold text-[#3E2723]/60 hover:text-[#3E2723] px-4 py-2 transition-colors">
              Back to Offer Lock
            </button>
            <button type="button" 
              disabled={!audienceStrategy}
              onClick={() => {
                if (audienceStrategy && lockedFacts) {
                  setCampaignStrategy(generateCampaignStrategy(lockedFacts, audienceStrategy));
                  setActiveStep(5);
                  window.scrollTo(0, 0);
                }
              }}
              className={`px-8 py-3 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${audienceStrategy ? 'bg-[#2E4F4F] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5' : 'bg-[#E8DFD1] text-[#3E2723]/40 cursor-not-allowed'}`}
            >
              Continue to Campaign Strategy <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}
        {activeStep === 5 && campaignStrategy && (
          <>
            <button type="button" onClick={() => setActiveStep(4)} className="text-sm font-bold text-[#3E2723]/60 hover:text-[#3E2723] px-4 py-2 transition-colors">
              Edit Strategy
            </button>
            <button type="button" 
              disabled={!campaignStrategy.validation.valid}
              onClick={() => {
                setCampaignStrategy({...campaignStrategy, strategyStatus: "ready_for_generation"});
                setActiveStep(6);
                window.scrollTo(0, 0);
                handleGenerateCampaign();
              }}
              className={`px-8 py-3 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${campaignStrategy.validation.valid ? 'bg-[#2E4F4F] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5' : 'bg-red-100 text-red-500 cursor-not-allowed'}`}
            >
              Approve & Generate Content <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

    </div>
  )
}

function StepItem({ number, label, active, upcoming, completed }: { number: string, label: string, active?: boolean, upcoming?: boolean, completed?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${active ? 'bg-[#2E4F4F]/5 text-[#2E4F4F]' : completed ? 'text-[#3E2723]' : 'text-[#3E2723]/40'}`}>
      {completed ? (
        <CheckCircle2 className="w-4 h-4 text-green-600" />
      ) : (
        <span className={`text-xs font-bold font-mono ${active ? 'text-[#2E4F4F]' : 'text-[#3E2723]/30'}`}>{number}</span>
      )}
      <span className={`text-sm font-medium ${active || completed ? 'font-bold' : ''}`}>{label}</span>
      {upcoming && <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-[#3E2723]/30">Coming Next</span>}
    </div>
  )
}

function ActivityItem({ label, active, completed }: { label: string, active?: boolean, completed?: boolean }) {
  return (
    <div className="flex items-start gap-2">
      {completed ? (
        <Check className="w-3.5 h-3.5 text-green-600 mt-0.5 shrink-0" />
      ) : active ? (
        <div className="w-3.5 h-3.5 rounded-full border-2 border-[#2E4F4F] mt-0.5 shrink-0"></div>
      ) : (
        <div className="w-3.5 h-3.5 rounded-full border-2 border-[#3E2723]/20 mt-0.5 shrink-0"></div>
      )}
      <span className={`text-xs ${completed ? 'text-[#3E2723]/70 font-medium' : active ? 'text-[#2E4F4F] font-bold' : 'text-[#3E2723]/40 font-medium'}`}>
        {label}
      </span>
    </div>
  )
}

function InputGroup({ label, error, children }: { label: string, error?: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-bold text-[#3E2723] mb-2">{label}</label>
      {children}
      {error && <span className="text-xs font-bold text-red-500 mt-2 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {error}</span>}
    </div>
  )
}

function SelectableChip({ label, selected, onClick }: { label: string, selected: boolean, onClick: () => void }) {
  return (
    <button 
      type="button"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${selected ? 'bg-[#2E4F4F] text-white border-[#2E4F4F] shadow-md' : 'bg-white text-[#3E2723]/70 border-[#3E2723]/10 hover:border-[#3E2723]/30 hover:bg-[#F5F0E6]'}`}
    >
      {label}
    </button>
  )
}

function PreviewItem({ label, value }: { label: string, value?: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">{label}</span>
      <span className="font-medium text-white">{value || <span className="text-white/30 italic">Not provided yet</span>}</span>
    </div>
  )
}
