
import React from 'react';

const ModeratorDashboard: React.FC = () => {
    const flags = [
        { id: 'f1', type: 'Potential Bullying', user: 'jake_99', content: 'You are so bad at this, why even try?', time: '5m ago' },
        { id: 'f2', type: 'Spam', user: 'crypto_man', content: 'Buy this now to gain 1000% profit!!!', time: '12m ago' }
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900">Moderator Dashboard</h2>
                    <p className="text-slate-500">Ensure Network Tube remains a sanctuary for growth.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white px-6 py-2 rounded-xl border border-slate-100 shadow-sm">
                        <span className="block text-xs text-slate-400 uppercase font-bold">Pending Flags</span>
                        <span className="text-xl font-bold text-red-500">12</span>
                    </div>
                    <div className="bg-white px-6 py-2 rounded-xl border border-slate-100 shadow-sm">
                        <span className="block text-xs text-slate-400 uppercase font-bold">Processed Today</span>
                        <span className="text-xl font-bold text-green-500">142</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Type</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">User</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Content Snippet</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Time</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {flags.map(flag => (
                            <tr key={flag.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{flag.type}</span>
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold text-slate-700">@{flag.user}</td>
                                <td className="px-6 py-4 text-sm text-slate-500 italic max-w-xs truncate">"{flag.content}"</td>
                                <td className="px-6 py-4 text-xs text-slate-400">{flag.time}</td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">Ban</button>
                                    <button className="bg-slate-200 hover:bg-slate-300 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">Dismiss</button>
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">Warn</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 text-center">
                <h3 className="text-xl font-bold text-blue-900 mb-2">Community Stats</h3>
                <p className="text-blue-700 text-sm mb-6">Network Tube toxicity levels are currently <span className="font-bold">LOW (1.2%)</span>. Keep up the good work!</p>
                <button className="text-blue-600 text-sm font-bold underline">View Full Moderation Report</button>
            </div>
        </div>
    );
};

export default ModeratorDashboard;
