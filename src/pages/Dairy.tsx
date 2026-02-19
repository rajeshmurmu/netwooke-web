
import React, { useState, useEffect } from 'react';
import { generateReflectionPrompt, moderateContent } from '../services/geminiService';

const Dairy: React.FC = () => {
    const [prompt, setPrompt] = useState('What are you grateful for today?');
    const [loadingPrompt, setLoadingPrompt] = useState(false);
    const [entries, setEntries] = useState([
        { id: 'd1', title: 'Focus and Discipline', content: 'Today I woke up at 5:30. The morning air was cold but the run felt incredible. Mental clarity is high.', timestamp: 'Yesterday', isPublic: false },
        { id: 'd2', title: 'Overcoming Setbacks', content: 'Had a tough talk at work today. Instead of reacting emotionally, I took 5 breaths and responded with logic. Growth.', timestamp: '3 days ago', isPublic: true }
    ]);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [isPublic, setIsPublic] = useState(false);

    useEffect(() => {
        refreshPrompt();
    }, []);

    const refreshPrompt = async () => {
        setLoadingPrompt(true);
        const p = await generateReflectionPrompt();
        setPrompt(p);
        setLoadingPrompt(false);
    };

    const handleSave = () => {
        if (!newContent) return;
        const entry = {
            id: Date.now().toString(),
            title: newTitle || 'Untitled Reflection',
            content: newContent,
            timestamp: 'Just now',
            isPublic
        };
        setEntries([entry, ...entries]);
        setNewTitle('');
        setNewContent('');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-slate-800">New Reflection</h2>
                        <button
                            onClick={refreshPrompt}
                            disabled={loadingPrompt}
                            className="text-blue-600 text-sm hover:underline"
                        >
                            {loadingPrompt ? 'Getting prompt...' : 'New Prompt'}
                        </button>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl mb-6 border-l-4 border-blue-400 italic text-blue-800 text-sm">
                        "{prompt}"
                    </div>

                    <input
                        type="text"
                        placeholder="Title (Optional)"
                        className="w-full mb-4 px-4 py-2 bg-slate-50 rounded-lg border-none focus:ring-2 focus:ring-blue-100"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <textarea
                        placeholder="Start writing..."
                        className="w-full h-48 mb-4 px-4 py-4 bg-slate-50 rounded-lg border-none focus:ring-2 focus:ring-blue-100 resize-none"
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                    />

                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isPublic}
                                onChange={() => setIsPublic(!isPublic)}
                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-slate-600">Share with community</span>
                        </label>
                        <button
                            onClick={handleSave}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-xl text-sm font-semibold shadow-md shadow-blue-100"
                        >
                            Save Entry
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800">Previous Entries</h3>
                    {entries.map(entry => (
                        <div key={entry.id} className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-slate-800">{entry.title}</h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-slate-400 uppercase tracking-widest">{entry.timestamp}</span>
                                    {entry.isPublic && <span className="bg-green-50 text-green-600 text-[9px] px-2 py-0.5 rounded-full font-bold">PUBLIC</span>}
                                </div>
                            </div>
                            <p className="text-slate-600 text-sm line-clamp-3">{entry.content}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-slate-800 rounded-2xl p-6 text-white shadow-xl">
                    <h3 className="text-lg font-bold mb-4">Mindfulness Goal</h3>
                    <p className="text-slate-300 text-sm mb-6">Write 5 entries this week to earn the 'Deep Reflector' badge.</p>
                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mb-2">
                        <div className="bg-blue-400 h-full w-[40%]" />
                    </div>
                    <span className="text-xs text-slate-400">2 / 5 Entries Complete</span>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4">Benefits of Journaling</h3>
                    <ul className="space-y-3 text-sm text-slate-600">
                        <li className="flex gap-2"><span>✅</span> Reduces stress & anxiety</li>
                        <li className="flex gap-2"><span>✅</span> Tracks personal progress</li>
                        <li className="flex gap-2"><span>✅</span> Improves focus and clarity</li>
                        <li className="flex gap-2"><span>✅</span> Promotes emotional intelligence</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dairy;
