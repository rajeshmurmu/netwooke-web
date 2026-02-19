
import React, { useState } from 'react';
import AuthModal from '../components/auth/AuthModal';


const Landing: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'traditional' | 'network'>('network');
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100 px-6">
                <div className="flex items-center justify-between h-16 max-w-7xl mx-auto">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">N</div>
                        <span className="text-xl font-black text-slate-800 tracking-tighter uppercase italic">Network Tube</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#philosophy" className="text-xs font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">Philosophy</a>
                        <a href="#features" className="text-xs font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">The Forge</a>
                        <a href="#mentors" className="text-xs font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">Mentors</a>
                    </div>
                    <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="bg-slate-900 hover:bg-blue-600 text-white text-xs font-black px-6 py-2.5 rounded-full uppercase tracking-widest transition-all active:scale-95"
                    >
                        Enter The Network
                    </button>
                </div>
            </nav>

            // Auth Modal
            <AuthModal showAuthModal={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

            {/* Hero Section */}
            <section className="relative pt-40 pb-32 px-6">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">The Digital Stronghold for Men</span>
                    </div>
                    <h1 className="text-6xl sm:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        TRANSMIT <span className="text-blue-600">STRENGTH.</span> <br />
                        ELIMINATE <span className="text-slate-400">NOISE.</span>
                    </h1>
                    <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
                        Most platforms drain your focus. We armor it. Join the elite network where young men trade high-value wisdom and track real-world discipline.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-in fade-in slide-in-from-bottom-16 duration-700 delay-300">
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="group w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black py-5 px-14 rounded-2xl transition-all shadow-2xl shadow-blue-200 hover:-translate-y-1 active:scale-95 text-xl flex items-center justify-center gap-3"
                        >
                            Start Growing
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        </button>
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <img key={i} src={`https://picsum.photos/seed/user${i}/100/100`} className="w-12 h-12 rounded-full border-4 border-slate-50 shadow-sm" alt="User" />
                            ))}
                            <div className="w-12 h-12 rounded-full bg-slate-900 border-4 border-slate-50 flex items-center justify-center text-white text-[10px] font-black">+50k</div>
                        </div>
                    </div>
                </div>

                {/* Dynamic Background */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[120%] pointer-events-none opacity-10 select-none overflow-hidden">
                    <div className="absolute top-40 left-10 w-150 h-150 bg-blue-400 rounded-full blur-[150px] animate-pulse"></div>
                    <div className="absolute top-60 right-10 w-100 h-100 bg-indigo-500 rounded-full blur-[120px] animate-pulse delay-700"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[400px] font-black text-slate-200 opacity-20 -rotate-12 tracking-tighter">NETWORK</div>
                </div>
            </section>

            {/* Philosophy Table - The Choice */}
            <section id="philosophy" className="py-32 bg-white px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-4">The Protocol</h2>
                        <h3 className="text-4xl font-black text-slate-900 tracking-tight">Decide Your Environment</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-2 rounded-[3rem] border border-slate-100 shadow-inner">
                        <button
                            onClick={() => setActiveTab('traditional')}
                            className={`p-10 rounded-[2.5rem] transition-all text-left ${activeTab === 'traditional' ? 'bg-red-50 border border-red-100 shadow-lg' : 'opacity-40 hover:opacity-100'}`}
                        >
                            <div className="text-red-500 font-black text-xs uppercase tracking-widest mb-4">The Standard Platforms</div>
                            <h4 className="text-2xl font-black text-slate-800 mb-6">Traditional Scrolling</h4>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-sm text-slate-500">
                                    <span className="text-red-500">✕</span> Mindless dopamine loops
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-500">
                                    <span className="text-red-500">✕</span> Toxic roasting & negativity
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-500">
                                    <span className="text-red-500">✕</span> Comparison to fake lifestyles
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-500">
                                    <span className="text-red-500">✕</span> Data harvesting focus
                                </li>
                            </ul>
                        </button>

                        <button
                            onClick={() => setActiveTab('network')}
                            className={`p-10 rounded-[2.5rem] transition-all text-left ${activeTab === 'network' ? 'bg-blue-600 border border-blue-400 shadow-2xl shadow-blue-200 text-white' : 'opacity-40 hover:opacity-100'}`}
                        >
                            <div className="text-blue-300 font-black text-xs uppercase tracking-widest mb-4">The Network Tube Way</div>
                            <h4 className="text-2xl font-black mb-6">Intentional Transmission</h4>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-sm">
                                    <span className="text-blue-300">✓</span> Growth-focused feed
                                </li>
                                <li className="flex items-center gap-3 text-sm">
                                    <span className="text-blue-300">✓</span> Verified Mentor guidance
                                </li>
                                <li className="flex items-center gap-3 text-sm">
                                    <span className="text-blue-300">✓</span> Proof-of-discipline tracking
                                </li>
                                <li className="flex items-center gap-3 text-sm">
                                    <span className="text-blue-300">✓</span> AI-moderated sanctuary
                                </li>
                            </ul>
                        </button>
                    </div>
                </div>
            </section>

            {/* The Pillars Section */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="group bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <h4 className="text-2xl font-black text-slate-900 mb-4">The Battleground</h4>
                            <p className="text-slate-500 leading-relaxed mb-6">Don't just talk. Show proof. Join 30-day discipline battles for early wakeups, cold showers, and gym streaks. Compete for the global leaderboard.</p>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-blue-600 h-full w-3/4 animate-pulse"></div>
                            </div>
                        </div>

                        <div className="group bg-slate-900 p-10 rounded-[3rem] border border-slate-800 shadow-2xl text-white">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-900 mb-8 group-hover:rotate-12 transition-transform">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                            </div>
                            <h4 className="text-2xl font-black mb-4">The Forge</h4>
                            <p className="text-slate-400 leading-relaxed mb-6">A curated blueprint library. Access proven strategies for career building, financial literacy, and mental frameworks. No fluff, just tactics.</p>
                            <div className="flex gap-2">
                                <span className="text-[10px] font-black border border-white/20 px-3 py-1 rounded-full uppercase">150+ Paths</span>
                                <span className="text-[10px] font-black border border-white/20 px-3 py-1 rounded-full uppercase">Verified</span>
                            </div>
                        </div>

                        <div className="group bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-8 group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </div>
                            <h4 className="text-2xl font-black text-slate-900 mb-4">The Tribe</h4>
                            <p className="text-slate-500 leading-relaxed mb-6">Connect with a squad of like-minded men. Share daily reflections and get accountability for your goals in real-time. Iron sharpens iron.</p>
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>)}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center relative z-10">
                    <div>
                        <div className="text-5xl font-black mb-2 tracking-tighter">1.4M+</div>
                        <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Growth Points Earned</div>
                    </div>
                    <div>
                        <div className="text-5xl font-black mb-2 tracking-tighter">850k</div>
                        <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">5AM Wakeups Logged</div>
                    </div>
                    <div>
                        <div className="text-5xl font-black mb-2 tracking-tighter">12k</div>
                        <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Mentor Reflections</div>
                    </div>
                    <div>
                        <div className="text-5xl font-black mb-2 tracking-tighter">0.0%</div>
                        <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Hate Speech Tolerance</div>
                    </div>
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-blue-600/5 opacity-50 blur-3xl"></div>
            </section>

            {/* Mentor Showcase */}
            <section id="mentors" className="py-32 bg-white px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="max-w-xl">
                            <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-4">The High Council</h2>
                            <h3 className="text-4xl font-black text-slate-900 tracking-tight">Learn from Those Who Walk the Path</h3>
                            <p className="text-slate-500 mt-4">Verified mentors across physical excellence, financial strategy, and mental resilience provide the content that powers The Tube.</p>
                        </div>
                        <button className="text-blue-600 font-black text-sm hover:underline">View All Mentors →</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Jordan Vane', role: 'Physical Performance', image: 'https://picsum.photos/seed/mentor1/400/500', bio: 'Former pro athlete turned resilience coach. Specialized in physical discipline and long-term habit formation.' },
                            { name: 'Stoic Marcus', role: 'Mindset & Philosophy', image: 'https://picsum.photos/seed/mentor2/400/500', bio: 'Modern application of ancient wisdom. Helping you navigate stress and maintain core frame in chaos.' },
                            { name: 'Elias Thorne', role: 'Career Strategy', image: 'https://picsum.photos/seed/mentor3/400/500', bio: 'Tech founder and executive mentor. Focused on the "Hard Skills" of navigating modern corporate and entrepreneurial landscapes.' }
                        ].map(mentor => (
                            <div key={mentor.name} className="group bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 transition-all hover:-translate-y-2">
                                <div className="h-80 overflow-hidden relative">
                                    <img src={mentor.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={mentor.name} />
                                    <div className="absolute bottom-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">
                                            {mentor.role}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h4 className="text-xl font-black text-slate-900 mb-2">{mentor.name}</h4>
                                    <p className="text-slate-500 text-sm leading-relaxed">{mentor.bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action Footer */}
            <footer className="py-40 bg-slate-900 text-white relative overflow-hidden px-6 text-center">
                <div className="max-w-4xl mx-auto relative z-10">
                    <h2 className="text-5xl sm:text-7xl font-black mb-10 tracking-tighter leading-none">
                        YOUR GROWTH <br />
                        IS <span className="text-blue-600">MANDATORY.</span>
                    </h2>
                    <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto">
                        Network Tube isn't for everyone. It's for the few who want to trade distraction for discipline. Are you one of them?
                    </p>
                    <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="bg-white text-slate-900 font-black py-6 px-20 rounded-2xl transition-all shadow-2xl hover:scale-105 active:scale-95 text-2xl"
                    >
                        Claim Your Spot
                    </button>

                    <div className="mt-20 flex flex-wrap justify-center gap-10 opacity-20 filter grayscale">
                        <span className="text-xs font-black uppercase tracking-[0.5em]">Physical</span>
                        <span className="text-xs font-black uppercase tracking-[0.5em]">Mental</span>
                        <span className="text-xs font-black uppercase tracking-[0.5em]">Financial</span>
                        <span className="text-xs font-black uppercase tracking-[0.5em]">Spiritual</span>
                    </div>

                    <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">© 2024 Network Tube • The Discipline Economy</div>
                        <div className="flex gap-6">
                            <a href="#" className="text-[10px] font-black text-white/30 hover:text-white uppercase tracking-widest">Privacy Protocol</a>
                            <a href="#" className="text-[10px] font-black text-white/30 hover:text-white uppercase tracking-widest">Terms of Engagement</a>
                        </div>
                    </div>
                </div>

                {/* Abstract pattern */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
            </footer>
        </div>
    );
};

export default Landing;
