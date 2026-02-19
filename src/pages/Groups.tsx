
import React from 'react';
import { MOCK_GROUPS } from '../constants';

const Groups: React.FC = () => {
    return (
        <div className="space-y-8 pb-20">
            <div className="relative h-64 rounded-3xl overflow-hidden bg-blue-600 flex flex-col items-center justify-center p-8 text-center text-white shadow-lg">
                <img
                    src="https://picsum.photos/seed/community/1200/400"
                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                    alt="Banner"
                />
                <h2 className="relative z-10 text-3xl font-extrabold mb-2">Find Your Tribe</h2>
                <p className="relative z-10 text-blue-100 max-w-lg">
                    Join goal-based communities and grow alongside like-minded men. Support each other through shared challenges.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_GROUPS.map(group => (
                    <div key={group.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                        <img src={group.coverImage} className="h-40 w-full object-cover" alt={group.name} />
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {group.category}
                                </span>
                                <span className="text-xs text-slate-400 font-medium">
                                    {group.membersCount.toLocaleString()} members
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">{group.name}</h3>
                            <p className="text-sm text-slate-500 mb-6 flex-1">{group.description}</p>
                            <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-semibold transition-colors">
                                Join Group
                            </button>
                        </div>
                    </div>
                ))}

                <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-center group cursor-pointer hover:bg-slate-100 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-2xl mb-4 group-hover:scale-110 transition-transform">
                        +
                    </div>
                    <h3 className="font-bold text-slate-800">Start a New Goal Group</h3>
                    <p className="text-xs text-slate-400 mt-2">Build a dedicated community for a specific discipline.</p>
                </div>
            </div>
        </div>
    );
};

export default Groups;
