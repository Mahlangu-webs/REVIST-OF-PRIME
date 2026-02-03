
import React, { useState, useRef, useEffect } from 'react';
import { Message, CourseRecommendation, ConversationFlow, User } from './types';
import { KNOWLEDGE_BASE, COURSE_RECOMMENDATIONS, CITATIONS } from './constants';
import { getChatResponse } from './services/gemini';
import { Visualization } from './components/Visualization';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('prime_bot_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [nameInput, setNameInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('prime_bot_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('prime_bot_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('prime_bot_user');
    }
  }, [user]);

  // Handle auto-scroll on new messages or loading state change
  useEffect(() => {
    localStorage.setItem('prime_bot_history', JSON.stringify(messages));
    
    // Always scroll to bottom when a new message arrives or loading starts/ends
    // but only if we are relatively close to the bottom already (smart scroll)
    const container = scrollRef.current;
    if (container) {
      const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 200;
      if (isAtBottom || messages.length <= 1) {
        scrollToBottom('smooth');
      }
    }
  }, [messages, isLoading]);

  // Listener to toggle the "Scroll to Bottom" button
  const handleScroll = () => {
    const container = scrollRef.current;
    if (container) {
      const isScrolledUp = container.scrollHeight - container.scrollTop > container.clientHeight + 400;
      setShowScrollButton(isScrolledUp);
    }
  };

  useEffect(() => {
    if (user && messages.length === 0) {
      setMessages([{
        id: 'initial',
        role: 'assistant',
        content: `👋 Hello ${user.name}! I'm PRIME BOT. I'm ready to provide concise, direct answers to your AI questions. What shall we learn today?`,
        timestamp: Date.now()
      }]);
    }
  }, [user]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setUser({
        name: nameInput.trim(),
        joinedAt: Date.now()
      });
    }
  };

  const handleLogout = () => {
    if (window.confirm("Switch User? This will reset the current learning stream.")) {
      setUser(null);
      setMessages([]);
      localStorage.removeItem('prime_bot_history');
      localStorage.removeItem('prime_bot_user');
    }
  };

  const processContent = (content: string) => {
    let vizType: any = undefined;
    const vizMatch = content.match(/\[VISUALIZATION:\s*(\w+-\w+)\]/);
    if (vizMatch) {
      vizType = vizMatch[1];
      content = content.replace(/\[VISUALIZATION:\s*(\w+-\w+)\]/, '');
    }
    
    const hasLearnKeywords = /learn|course|study|module|future|career/i.test(content);
    const recs = hasLearnKeywords ? COURSE_RECOMMENDATIONS : undefined;
    
    const hasCitation = content.length > 150; // Increased threshold for "straightforward" mode
    const selectedCitations = hasCitation ? [CITATIONS[Math.floor(Math.random() * CITATIONS.length)]] : undefined;

    return { cleanContent: content, vizType, recs, selectedCitations };
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const chatHistory = messages.concat(userMessage).map(m => ({
      role: m.role,
      content: m.content
    }));

    const responseText = await getChatResponse(chatHistory, user.name);
    const { cleanContent, vizType, recs, selectedCitations } = processContent(responseText);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: cleanContent,
      timestamp: Date.now(),
      visualizationType: vizType,
      recommendations: recs,
      citations: selectedCitations
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const startFlow = (type: ConversationFlow) => {
    const flows = {
      nlp: "What is NLP?",
      ethics: "What is AI Ethics?",
      cv: "What is Computer Vision?",
      fundamentals: "What is the difference between AI, ML, and DL?"
    };
    handleSend(flows[type]);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-rose-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden p-10 md:p-14 border border-white/20">
          <div className="flex justify-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-rose-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 transition-transform hover:rotate-12 duration-500">
              <span className="text-white font-black text-4xl italic">P</span>
            </div>
          </div>
          <h2 className="text-4xl font-black text-slate-900 text-center mb-3 tracking-tighter">PRIME BOT</h2>
          <p className="text-slate-500 text-center mb-10 font-bold uppercase text-[10px] tracking-[0.2em]">The Future of AI Learning</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <label className="block text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2 ml-1">Learning Alias</label>
              <input 
                type="text" 
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                autoFocus
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 px-7 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800 text-lg placeholder:text-slate-300 placeholder:font-medium"
                placeholder="How shall I address you?"
              />
            </div>
            <button 
              type="submit"
              disabled={!nameInput.trim()}
              className="w-full bg-gradient-to-r from-indigo-600 to-rose-600 text-white font-black py-5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] disabled:from-slate-300 disabled:to-slate-300 transition-all shadow-xl shadow-indigo-200 uppercase tracking-widest text-xs"
            >
              Start Mastery Session
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-slate-900 flex flex-col hidden md:flex border-r border-slate-800">
        <div className="p-8 bg-gradient-to-b from-indigo-600/10 to-transparent">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-xl italic">P</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter">PRIME</h1>
          </div>
          <div className="px-2 py-1 bg-white/10 rounded-full inline-block border border-white/10">
            <span className="text-[9px] font-black text-indigo-300 uppercase tracking-[0.2em]">Learning Engine v3.0</span>
          </div>
        </div>

        <div className="px-6 py-4 border-y border-white/5 bg-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center font-black text-indigo-400 text-lg shadow-inner border border-white/10">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-black text-white truncate uppercase tracking-wider">{user.name}</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Verified Student</div>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-rose-500/20 rounded-xl text-slate-500 hover:text-rose-400 transition-colors" title="Logout">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
          <div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-4 ml-1">Knowledge Paths</h3>
            <div className="space-y-3">
              {[
                { flow: 'fundamentals', label: 'Fundamentals', desc: 'The AI Core', color: 'hover:border-indigo-500/50 hover:bg-indigo-500/5 group-hover:text-indigo-400' },
                { flow: 'nlp', label: 'Language', desc: 'NLP & Transformers', color: 'hover:border-cyan-500/50 hover:bg-cyan-500/5 group-hover:text-cyan-400' },
                { flow: 'ethics', label: 'AI Ethics', desc: 'Safety & Bias', color: 'hover:border-rose-500/50 hover:bg-rose-500/5 group-hover:text-rose-400' }
              ].map((item) => (
                <button 
                  key={item.flow}
                  onClick={() => startFlow(item.flow as ConversationFlow)}
                  className={`w-full text-left p-4 rounded-2xl bg-white/5 border border-white/10 transition-all group ${item.color}`}
                >
                  <div className="text-sm font-black text-slate-200 tracking-tight group-hover:translate-x-1 transition-transform">{item.label}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-4 ml-1">Quick Tags</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { topic: 'Computer Vision', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-white' },
                { topic: 'Neural Networks', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500 hover:text-white' },
                { topic: 'Deep Learning', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500 hover:text-white' },
                { topic: 'Bias', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500 hover:text-white' },
                { topic: 'Healthcare', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20 hover:bg-sky-500 hover:text-white' },
              ].map(tag => (
                <button
                  key={tag.topic}
                  onClick={() => handleSend(`What is ${tag.topic}?`)}
                  className={`px-3 py-1.5 border ${tag.color} text-[10px] rounded-lg font-black transition-all uppercase tracking-tighter`}
                >
                  {tag.topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative bg-slate-50">
        <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200 flex items-center px-8 sticky top-0 z-10">
          <div className="flex-1">
            <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase">
              <span className="text-indigo-600">Learning Stream</span> — {user.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              </div>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.1em]">Direct Response Mode</span>
            </div>
          </div>
          <button 
            onClick={() => {
              if (window.confirm("Start a new session?")) {
                 setMessages(messages.slice(0, 1));
              }
            }}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            Reset
          </button>
        </header>

        <div 
          ref={scrollRef} 
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-6 md:p-12 space-y-10 scroll-smooth no-scrollbar relative"
        >
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] md:max-w-[80%] ${msg.role === 'user' ? 'order-2' : ''}`}>
                <div className={`rounded-[2rem] px-6 py-5 shadow-sm transition-all hover:shadow-md animate-in ${
                  msg.role === 'user' 
                  ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-tr-none shadow-indigo-100' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-slate-100'
                }`}>
                  <div className={`text-[15px] leading-relaxed font-medium ${msg.role === 'user' ? 'font-semibold' : ''}`}>
                    {msg.content}
                  </div>
                  
                  {msg.citations && msg.citations.length > 0 && (
                    <div className={`mt-6 pt-4 border-t ${msg.role === 'user' ? 'border-white/20' : 'border-slate-100'}`}>
                      <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-2 ${msg.role === 'user' ? 'text-white/60' : 'text-slate-400'}`}>Academic Verification</p>
                      {msg.citations.map((c, i) => (
                        <p key={i} className={`text-[11px] italic flex items-center gap-2 ${msg.role === 'user' ? 'text-white/90' : 'text-slate-600'}`}>
                          <span className="text-base">🔖</span> {c}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {msg.visualizationType && (
                  <div className="mt-6">
                    <Visualization type={msg.visualizationType} />
                  </div>
                )}

                {msg.recommendations && (
                  <div className="mt-6 space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Recommended Mastery Modules</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {msg.recommendations.map((rec, i) => (
                        <div key={i} className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-indigo-300 transition-all group">
                          <div className="text-[12px] font-black text-slate-900 mb-1 group-hover:text-indigo-600">{rec.title}</div>
                          <div className="text-[10px] text-indigo-500 font-black uppercase tracking-widest mb-2">{rec.module}</div>
                          <div className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{rec.description}</div>
                          <button className="text-[10px] font-black text-indigo-600 mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
                            OPEN REPOSITORY <span className="text-lg leading-none">→</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-3xl rounded-tl-none px-6 py-4 shadow-xl shadow-slate-100 border-l-4 border-l-indigo-500">
                <div className="flex gap-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                  <span className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Floating Scroll Button */}
        {showScrollButton && (
          <button 
            onClick={() => scrollToBottom()}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:bg-indigo-700 hover:scale-105 transition-all z-50 border border-white/20 animate-bounce"
          >
            Latest Message 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        )}

        <div className="p-6 md:p-10 pt-0 sticky bottom-0 bg-gradient-to-t from-slate-50 via-slate-50/95 to-transparent">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-[2rem] blur-xl opacity-10 group-focus-within:opacity-20 transition-opacity"></div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Ask PRIME BOT, ${user.name}...`}
              className="w-full bg-white border-2 border-slate-200 rounded-[1.8rem] py-5 pl-8 pr-20 shadow-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800 text-lg placeholder:text-slate-300 placeholder:font-medium relative z-10"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-xl hover:scale-105 active:scale-95 z-20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-4 font-black uppercase tracking-[0.2em]">
            Synced Mastery Stream — Conciseness Enabled
          </p>
        </div>
      </main>
    </div>
  );
};

export default App;
