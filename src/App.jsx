import React, { useEffect, useRef, useState } from 'react';
import { Upload, FileText, Activity, Layers, HeartPulse, CheckCircle2, AlertTriangle, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import DiagnosticShuffler from './components/DiagnosticShuffler';
import TelemetryTypewriter from './components/TelemetryTypewriter';
import ProtocolScheduler from './components/ProtocolScheduler';

gsap.registerPlugin(ScrollTrigger);

const WEBHOOK_URL = 'https://manavn8nworkflow.app.n8n.cloud/webhook-test/upload';

export default function App() {
  const containerRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success' | 'error' | null
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append('fileType', file.type);
    formData.append('timestamp', new Date().toISOString());

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadStatus('success');
      } else {
        setUploadStatus('error');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
      // Reset status after 3 seconds
      setTimeout(() => setUploadStatus(null), 3000);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const steps = [
    {
      id: 'diagnosis',
      label: 'Diagnosis',
      icon: <HeartPulse className="w-5 h-5" />,
      title: 'Plain-Language Diagnosis.',
      desc: 'We eliminate the cognitive load. Complex medical conditions are translated into a conversational format.',
      content: (
        <div className="bg-white p-8 rounded-[2rem] border border-black/5 flex items-start gap-6 shadow-sm">
          <HeartPulse className="text-clay w-8 h-8 shrink-0 mt-1" />
          <div>
            <h4 className="font-sans font-bold text-moss text-xl mb-3">Hypertension (High Blood Pressure)</h4>
            <p className="text-charcoal/60 leading-relaxed text-lg">
              Your heart is currently working harder than normal to pump blood. This is manageable, and the prescribed medication will help relax your blood vessels to reduce this strain.
            </p>
          </div>
        </div>
      ),
      image: "https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 'medication',
      label: 'Medication',
      icon: <Layers className="w-5 h-5" />,
      title: 'Structured Regimen.',
      desc: 'A clear, hourly breakdown of your treatment plan to ensure zero missed doses.',
      content: (
        <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-moss/5">
              <tr>
                <th className="px-6 py-4 font-mono text-xs uppercase text-charcoal/50">Medicine</th>
                <th className="px-6 py-4 font-mono text-xs uppercase text-charcoal/50">Timing</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-black/5">
                <td className="px-6 py-4 font-bold text-moss">Lisinopril (10mg)</td>
                <td className="px-6 py-4 text-charcoal/70 italic">Morning (After Breakfast)</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-moss">Atorvastatin (20mg)</td>
                <td className="px-6 py-4 text-charcoal/70 italic">Night (Before Bed)</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 'checklist',
      label: 'Next Steps',
      icon: <CheckCircle2 className="w-5 h-5" />,
      title: 'Actionable Recovery.',
      desc: 'Specific lifestyle adjustments and follow-up markers for your healthcare team.',
      content: (
        <ul className="space-y-4">
          {[
            "Schedule blood test in 3 weeks",
            "Monitor blood pressure daily at 9 AM",
            "Restrict sodium intake to < 2000mg"
          ].map((task, i) => (
            <li key={i} className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
              <CheckCircle2 className="w-6 h-6 text-clay shrink-0" />
              <span className="text-charcoal/80 font-medium">{task}</span>
            </li>
          ))}
        </ul>
      ),
      image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Intro animations
      gsap.from('.hero-text', {
        y: 100,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power4.out',
        delay: 0.2
      });
      
      gsap.from('.nav-pill', {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      // Split Text Reveal
      gsap.from('.reveal-text-line', {
        scrollTrigger: {
          trigger: '.philosophy-section',
          start: 'top center',
        },
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.3,
        ease: 'power3.out'
      });

      // Stacking Archive Animation
      const cards = gsap.utils.toArray('.stack-card');
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return; // Skip last card
        
        gsap.to(card, {
          scrollTrigger: {
            trigger: cards[i + 1],
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
          scale: 0.9,
          filter: "blur(20px)",
          opacity: 0.5,
          y: -50
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-cream text-charcoal">
      <div className="noise-overlay" />

      {/* Floating Island Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 nav-pill w-[90%] md:w-auto">
        <div className="bg-white/60 backdrop-blur-xl border border-moss/10 px-6 py-4 rounded-[2rem] flex justify-between items-center gap-8 shadow-sm">
          <a href="#" className="font-serif italic text-xl md:text-2xl font-bold tracking-tight text-moss flex items-center gap-2">
            <Activity className="w-5 h-5 text-clay" />
            MedBuddy
          </a>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium tracking-wide">
            <a href="#intelligence" className="hover:text-moss transition-colors">Intelligence</a>
            <a href="#philosophy" className="hover:text-moss transition-colors">Philosophy</a>
            <a href="#protocol" className="hover:text-moss transition-colors">Protocol</a>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept=".pdf,.txt,.jpg,.jpeg,.png"
            />
            <button 
              onClick={triggerFileInput}
              disabled={isUploading}
              className={`bg-moss text-cream px-6 py-2 rounded-full text-sm font-medium magnetic whitespace-nowrap flex items-center gap-2 ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {uploadStatus === 'success' ? 'Sent!' : uploadStatus === 'error' ? 'Failed' : 'Upload Summary'}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[100dvh] flex items-end pb-20 px-4 md:px-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop"
            alt="Medical prescription and equipment"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-moss via-moss/80 to-transparent mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl text-cream">
          <div className="overflow-hidden mb-2">
            <h1 className="hero-text text-4xl md:text-7xl font-sans font-bold tracking-tighter leading-none">
              Simplifying healthcare.
            </h1>
          </div>
          <div className="overflow-hidden mb-8">
            <h2 className="hero-text text-5xl md:text-9xl font-serif italic text-clay leading-none">
              Without distortion.
            </h2>
          </div>
          <p className="hero-text text-base md:text-xl text-cream/80 max-w-2xl font-light tracking-wide mb-10">
            The AI that sits between a patient and confusion. Upload your discharge summary or prescription for a clinically accurate, plain-language translation.
          </p>
          <div className="hero-text flex flex-col sm:flex-row gap-4">
            <button 
              onClick={triggerFileInput}
              disabled={isUploading}
              className="bg-white text-moss px-8 py-4 rounded-[2rem] font-medium flex items-center justify-center gap-3 magnetic"
            >
              {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              {uploadStatus === 'success' ? 'Document Sent' : uploadStatus === 'error' ? 'Upload Failed' : 'Upload Document'}
            </button>
            <button className="border border-white/20 px-8 py-4 rounded-[2rem] hover:bg-white/5 transition-colors text-center">
              View Sample Protocol
            </button>
          </div>
        </div>
      </section>

      {/* Features: The Precision Micro-UI Dashboard */}
      <section id="intelligence" className="py-24 md:py-32 px-4 md:px-16 bg-cream relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop"
            alt="Prescription and medication"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
            
            <div className="lg:col-span-4 sticky top-32">
              <span className="text-clay font-mono text-sm uppercase tracking-widest mb-4 block">01 / Intelligence</span>
              <h3 className="text-4xl lg:text-5xl font-serif italic text-moss mb-6 leading-tight">Functional<br/>Artifacts.</h3>
              <p className="text-charcoal/70 mb-8 leading-relaxed">
                Our parsing engine ingests complex medical terminology and extracts a structured, actionable telemetry feed without hallucinating medical advice.
              </p>
              
              <div 
                onClick={triggerFileInput}
                className={`bg-moss text-cream rounded-[2rem] p-8 flex flex-col items-center justify-center text-center mt-8 hover:bg-moss/90 transition-colors pointer-events-auto cursor-pointer border border-transparent hover:border-clay/30 ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6">
                  {isUploading ? <Loader2 className="w-6 h-6 text-clay animate-spin" /> : <Upload className="w-6 h-6 text-clay -mt-1" />}
                </div>
                <h4 className="font-serif italic text-2xl mb-2">
                  {uploadStatus === 'success' ? 'Success!' : uploadStatus === 'error' ? 'Failed' : 'Initialize Parsing'}
                </h4>
                <p className="text-sm text-cream/70 mb-6">Click to upload prescription or discharge summary</p>
                <div className="flex gap-4 font-mono text-xs w-full justify-center" onClick={(e) => e.stopPropagation()}>
                   <select className="bg-transparent border border-cream/20 rounded-full px-3 py-1 outline-none text-cream/70 cursor-pointer text-center">
                     <option>Age: Auto</option>
                     <option>Child</option>
                     <option>Adult</option>
                     <option>Senior</option>
                   </select>
                   <select className="bg-transparent border border-cream/20 rounded-full px-3 py-1 outline-none text-cream/70 cursor-pointer text-center">
                     <option>Lang: EN</option>
                     <option>Lang: HI</option>
                   </select>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer">
                <DiagnosticShuffler />
              </div>
              <div className="hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer">
                <TelemetryTypewriter />
              </div>
              <div className="md:col-span-2 hover:scale-[1.01] active:scale-[0.99] transition-transform cursor-pointer">
                <ProtocolScheduler />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="philosophy-section bg-charcoal text-cream py-32 md:py-48 px-4 md:px-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img 
             src="https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=80&w=2070&auto=format&fit=crop"
             alt="Close-up of medication"
             className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal mix-blend-color" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-center">
          <div>
            <div className="reveal-text-line group cursor-default">
              <h3 className="text-3xl md:text-5xl font-sans tracking-tight mb-2 text-white/40 group-hover:text-white/60 transition-colors">
                Modern medicine asks:
              </h3>
            </div>
            <div className="reveal-text-line group cursor-default">
              <h3 className="text-3xl md:text-5xl font-sans tracking-tight mb-12 text-white group-hover:text-clay transition-colors">
                What does this jargon mean?
              </h3>
            </div>
          </div>
          <div>
            <div className="reveal-text-line group cursor-default">
              <h3 className="text-5xl md:text-7xl font-serif italic text-clay mb-2 group-hover:text-white transition-colors">
                We ask:
              </h3>
            </div>
            <div className="reveal-text-line group cursor-default">
              <h3 className="text-4xl md:text-6xl font-serif italic text-cream group-hover:text-clay transition-colors">
                What is the optimal path forward?
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Page Schedule Flow */}
      <section id="protocol" className="min-h-screen bg-cream py-24 px-4 md:px-16 flex flex-col justify-center">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-clay font-mono text-sm uppercase tracking-widest mb-4 block">02 / Clinical Protocol</span>
            <h2 className="text-4xl md:text-6xl font-serif italic text-moss">The Optimal Path Forward</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Nav Column */}
            <div className="lg:col-span-3 flex lg:flex-col gap-4 justify-center">
              {steps.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(idx)}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all text-left border ${
                    activeStep === idx 
                      ? 'bg-moss text-cream border-moss shadow-lg scale-105' 
                      : 'bg-white/50 text-moss/50 border-black/5 hover:bg-white'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeStep === idx ? 'bg-clay/20 text-clay' : 'bg-moss/5 text-moss/20'}`}>
                    {step.icon}
                  </div>
                  <span className="font-bold text-sm tracking-tight hidden md:block">{step.label}</span>
                </button>
              ))}
            </div>

            {/* Content Display */}
            <div className="lg:col-span-9 bg-white/40 backdrop-blur-md rounded-[3rem] p-8 md:p-12 border border-black/5 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col">
              <div key={activeStep} className="animate-in fade-in slide-in-from-right-8 duration-500 h-full flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center h-full">
                  <div>
                    <h3 className="text-4xl font-serif italic text-moss mb-6">{steps[activeStep].title}</h3>
                    <p className="text-charcoal/70 text-lg mb-10 leading-relaxed">{steps[activeStep].desc}</p>
                    {steps[activeStep].content}
                    
                    <div className="mt-12 flex gap-4">
                      <button 
                        disabled={activeStep === 0}
                        onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                        className={`p-4 rounded-full border transition-all ${
                          activeStep === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-moss hover:text-cream border-moss text-moss'
                        }`}
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button 
                        disabled={activeStep === steps.length - 1}
                        onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
                        className={`p-4 rounded-full border transition-all ${
                          activeStep === steps.length - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-moss hover:text-cream border-moss text-moss'
                        }`}
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  <div className="relative aspect-square md:aspect-auto h-full min-h-[300px] rounded-[2rem] overflow-hidden shadow-inner">
                    <img 
                      src={steps[activeStep].image} 
                      alt={steps[activeStep].label}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-moss/10 mix-blend-multiply" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal text-cream pt-24 pb-8 px-8 md:px-16 rounded-t-[4rem] relative z-20 -mt-[4rem] shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
          <div className="md:col-span-2">
            <div className="font-serif italic text-2xl font-bold tracking-tight text-white flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-clay" />
              MedBuddy
            </div>
            <p className="text-white/40 max-w-sm text-sm leading-relaxed">
              Clinical intelligence simplified safely. The AI that sits between a patient and confusion.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-white/30 mb-6">Capabilities</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">Discharge Parsing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Prescription Translation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Conflict Detection</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-white/30 mb-6">System</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">Data Privacy Protocol</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Clinical Guidelines</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-white/30">
          <p>© 2026 MedBuddy Systems.</p>
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>SYSTEM OPERATIONAL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
