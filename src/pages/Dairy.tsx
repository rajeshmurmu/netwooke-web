
import { useState } from 'react';
import useDairyEntry from '@/hooks/useDairyEntry';
import useDairyEntryMutation from '@/hooks/useDairyEntryMutation';
import useReflectionPrompt from '@/hooks/useReflectionPrompt';
import type { DairyEntryResponse } from '@/types';
import LoaderNew from '@/components/LoaderNew';
import DiaryEntryCard from '@/components/dairy/DairyCard';
import { useSearchParams } from 'react-router';

export default function Dairy() {
    const [searchParams, setSearchParams] = useSearchParams();
    const {
        reflectionPrompt,
        reflectionPromptIsFetching,
        reflectionPromptRefetch: refreshPrompt
    } = useReflectionPrompt();
    const { createEntry, EntryIsPending } = useDairyEntryMutation();
    const { dairyEnteries, dairyEntriesIsLoading } = useDairyEntry();


    const prompt = reflectionPrompt || 'What are you grateful for today?';
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [isPublic, setIsPublic] = useState(false);

    const activeTab = searchParams.get('q') === 'community' ? 'community' : 'personal'; // Default to 'personal' if no valid tab is provided
    const handleSave = async () => {
        try {
            createEntry({
                title: newTitle,
                content: newContent,
                isPrivate: !isPublic
            });

        } catch (error) {
            console.error("Error saving entry:", error);
        } finally {
            setNewTitle('');
            setNewContent('');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-slate-800">New Reflection</h2>
                        <button
                            onClick={() => refreshPrompt()}
                            disabled={reflectionPromptIsFetching}
                            className="text-blue-600 text-sm hover:underline"
                        >
                            {reflectionPromptIsFetching ? 'Getting prompt...' : 'New Prompt'}
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
                            disabled={!newTitle || !newContent || EntryIsPending}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-xl text-sm font-semibold shadow-md shadow-blue-100"
                        >
                            Save Entry
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200">
                        <div className="flex gap-6">
                            <button
                                onClick={() => setSearchParams({ q: 'personal' })}
                                className={`pb-2 text-sm font-bold transition-colors relative ${activeTab === 'personal' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                My Reflections
                                {activeTab === 'personal' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
                            </button>
                            <button
                                onClick={() => setSearchParams({ q: 'community' })}
                                className={`pb-2 text-sm font-bold transition-colors relative ${activeTab === 'community' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                Community
                                {activeTab === 'community' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
                            </button>
                        </div>
                    </div>

                    {
                        dairyEntriesIsLoading ? (
                            <LoaderNew className="h-60" />
                        ) : (
                            <div className="space-y-4">
                                {activeTab === 'personal' ? (
                                    dairyEnteries?.length > 0 ? (
                                        dairyEnteries.map((entry: DairyEntryResponse) => (
                                            <DiaryEntryCard key={entry._id} entry={entry} />
                                        ))
                                    ) : (
                                        <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center">
                                            <p className="text-slate-500">No reflections yet. Start your journey today.</p>
                                        </div>
                                    )
                                ) : (
                                    dairyEnteries?.length > 0 ? (
                                        dairyEnteries.map((entry: DairyEntryResponse) => (
                                            <DiaryEntryCard key={entry._id} entry={entry} isCommunity />
                                        ))
                                    ) : (
                                        <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center">
                                            <p className="text-slate-500">No community reflections shared yet.</p>
                                        </div>
                                    )
                                )}
                            </div>
                        )
                    }
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

