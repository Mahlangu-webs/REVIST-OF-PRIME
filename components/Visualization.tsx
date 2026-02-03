
import React from 'react';

interface VisualizationProps {
  type: 'ai-venn' | 'neural-net' | 'nlp-flow' | 'ethics-balance';
}

export const Visualization: React.FC<VisualizationProps> = ({ type }) => {
  if (type === 'ai-venn') {
    return (
      <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-2xl border border-slate-200 shadow-lg my-4 flex flex-col items-center">
        <h4 className="text-sm font-black text-slate-800 mb-6 uppercase tracking-widest">The Intelligence Spectrum</h4>
        <div className="relative w-64 h-64 transition-transform hover:scale-105 duration-500">
          <div className="absolute inset-0 bg-indigo-500/10 rounded-full border-[3px] border-indigo-500 flex items-start justify-center pt-4 shadow-xl shadow-indigo-500/20">
            <span className="text-xs font-black text-indigo-700 tracking-tighter">ARTIFICIAL INTELLIGENCE</span>
          </div>
          <div className="absolute inset-6 bg-cyan-400/10 rounded-full border-[3px] border-cyan-400 flex items-start justify-center pt-4 shadow-lg shadow-cyan-400/20">
            <span className="text-xs font-black text-cyan-700 tracking-tighter uppercase">Machine Learning</span>
          </div>
          <div className="absolute inset-14 bg-rose-400/10 rounded-full border-[3px] border-rose-400 flex items-center justify-center shadow-lg shadow-rose-400/20">
            <span className="text-xs font-black text-rose-700 tracking-tighter uppercase">Deep Learning</span>
          </div>
        </div>
        <p className="mt-6 text-[10px] text-slate-500 font-bold uppercase tracking-tight text-center">Nesting of specialized intelligence systems</p>
      </div>
    );
  }

  if (type === 'neural-net') {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl my-4">
        <h4 className="text-sm font-black text-white mb-6 uppercase tracking-widest text-center">Neural Architecture</h4>
        <div className="flex justify-between items-center h-40 px-6">
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.6)] animate-pulse"></div>)}
            <span className="text-[10px] font-black text-emerald-400/80 uppercase">Inputs</span>
          </div>
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map(i => <div key={i} className="w-6 h-6 rounded-full bg-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.6)]"></div>)}
            <span className="text-[10px] font-black text-indigo-400/80 uppercase">Processing</span>
          </div>
          <div className="flex flex-col gap-4">
            {[1, 2].map(i => <div key={i} className="w-6 h-6 rounded-full bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-pulse"></div>)}
            <span className="text-[10px] font-black text-amber-400/80 uppercase">Outputs</span>
          </div>
        </div>
        <div className="mt-4 border-t border-slate-700 pt-2 text-center">
          <p className="text-[9px] text-slate-400 font-medium italic">Simulating biological neural processing through weighted activation</p>
        </div>
      </div>
    );
  }

  if (type === 'nlp-flow') {
    return (
      <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-sky-200 shadow-inner my-4">
        <h4 className="text-sm font-black text-sky-800 mb-6 uppercase tracking-widest text-center">NLP Processing Pipeline</h4>
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
          {[
            { label: 'Raw Text', color: 'bg-slate-100 text-slate-700 border-slate-200' },
            { label: 'Cleaning', color: 'bg-rose-100 text-rose-700 border-rose-200' },
            { label: 'Tokens', color: 'bg-amber-100 text-amber-700 border-amber-200' },
            { label: 'Embedding', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
            { label: 'Prediction', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' }
          ].map((step, i) => (
            <React.Fragment key={step.label}>
              <div className={`px-4 py-2 ${step.color} border-2 rounded-xl text-[10px] font-black uppercase whitespace-nowrap shadow-sm`}>
                {step.label}
              </div>
              {i < 4 && <div className="text-sky-300 font-black">▶</div>}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'ethics-balance') {
    return (
      <div className="bg-gradient-to-tr from-rose-50 to-amber-50 p-6 rounded-2xl border border-rose-100 shadow-lg my-4 flex flex-col items-center">
        <h4 className="text-sm font-black text-rose-900 mb-6 uppercase tracking-widest">The Ethical Equilibrium</h4>
        <div className="w-full flex justify-around items-end h-24">
          <div className="flex flex-col items-center group cursor-help">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center mb-2 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300 border border-rose-100 text-2xl">⚖️</div>
            <span className="text-[10px] font-black text-rose-800 tracking-tighter uppercase">Bias</span>
          </div>
          <div className="flex flex-col items-center group cursor-help">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center mb-2 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 border border-amber-100 text-2xl">🛡️</div>
            <span className="text-[10px] font-black text-amber-800 tracking-tighter uppercase">Safety</span>
          </div>
          <div className="flex flex-col items-center group cursor-help">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center mb-2 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300 border border-cyan-100 text-2xl">👤</div>
            <span className="text-[10px] font-black text-cyan-800 tracking-tighter uppercase">Privacy</span>
          </div>
        </div>
        <p className="mt-6 text-[9px] text-slate-400 font-bold text-center italic">A complex interplay of human rights and technical advancement</p>
      </div>
    );
  }

  return null;
};
