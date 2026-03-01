import { genaiClient } from '@/services/genaiClient';
import { useEffect, useState } from 'react'

export default function DailyStoryExchangePrompt() {
    const [storyPrompt, setStoryPrompt] = useState('How did you face discomfort today?');

    useEffect(() => {
        const fetchPrompt = async () => {
            const res = await genaiClient.generateReflectionPrompt();
            if (res.status === 200) {
                const prompt = res.data?.data?.reflectionPrompt;
                setStoryPrompt(prompt);
            }
        };
        fetchPrompt();
    }, []);

    return (
        <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-100 mb-8 overflow-hidden relative">
            <div className="relative z-10">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] bg-white/20 px-2 py-1 rounded">Daily Story Exchange</span>
                <h2 className="text-xl font-bold mt-2 mb-3">"{storyPrompt}"</h2>
                <p className="text-blue-100 text-sm mb-4">Share your story below. Help others grow from your experience.</p>
                <button
                    onClick={() => document.getElementById('post-area')?.focus()}
                    className="bg-white text-blue-700 px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors shadow-sm"
                >
                    Answer Prompt
                </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        </div>
    )
}
