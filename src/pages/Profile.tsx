
import React, { useMemo } from 'react';
import { useParams } from 'react-router';
import type { User } from '../types';
import { MOCK_USERS } from "../constants";

interface ProfileProps {
    currentUser: User;
}

const Profile: React.FC<ProfileProps> = ({ currentUser }) => {
    const { username } = useParams<{ username: string }>();

    const displayedUser = useMemo(() => {
        if (!username) return currentUser;
        return MOCK_USERS.find(u => u.username === username) || currentUser;
    }, [username, currentUser]);

    const isOwnProfile = currentUser.username === displayedUser.username;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
            <div className="bg-white rounded-4xl p-6 md:p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
                {/* Subtle background pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-50 pointer-events-none"></div>

                <div className="relative group shrink-0">
                    <img src={displayedUser.avatar} className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] shadow-2xl shadow-blue-100 border-4 border-white transition-transform group-hover:scale-105 duration-500" alt={displayedUser.name} />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 md:w-8 md:h-8 rounded-full border-4 border-white shadow-lg" />
                </div>

                <div className="flex-1 text-center md:text-left relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{displayedUser.name}</h2>
                        {displayedUser.isMentor && (
                            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-200 inline-block w-fit mx-auto md:mx-0">
                                Mentor
                            </span>
                        )}
                    </div>
                    <span className="text-blue-600 font-bold text-sm block mb-3">@{displayedUser.username} • Building since {displayedUser.joinedAt}</span>
                    <p className="text-slate-600 mb-8 max-w-lg leading-relaxed">{displayedUser.bio}</p>

                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                        <StatBox label="Followers" value="124" />
                        <StatBox label="Following" value="89" />
                        <StatBox label="Wisdom Shared" value="42" />
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-full md:w-auto">
                    {isOwnProfile ? (
                        <>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-blue-100 transition-all active:scale-95">
                                Edit Growth Path
                            </button>
                            <button className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-8 py-3 rounded-2xl text-sm font-bold border border-slate-100 transition-all">
                                Settings
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-blue-100 transition-all active:scale-95">
                                Follow Brother
                            </button>
                            <button className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-8 py-3 rounded-2xl text-sm font-bold border border-slate-100 transition-all">
                                Send Message
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-4xl p-8 border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Active Growth Goals</h3>
                        {isOwnProfile && (
                            <button className="bg-blue-50 text-blue-600 text-xs font-black px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors uppercase tracking-widest">
                                + New Goal
                            </button>
                        )}
                    </div>

                    <div className="grid gap-6">
                        {displayedUser.goals.length > 0 ? (
                            displayedUser.goals.map(goal => (
                                <div key={goal.id} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 group transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-100 hover:border-blue-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${goal.completed ? 'bg-green-100 text-green-600' : 'bg-blue-600 text-white'}`}>
                                                {goal.completed ? '✓' : '🎯'}
                                            </div>
                                            <div>
                                                <h4 className={`font-black text-lg ${goal.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                                    {goal.title}
                                                </h4>
                                                <span className="text-[10px] uppercase font-black text-blue-400 tracking-widest">{goal.category}</span>
                                            </div>
                                        </div>
                                        <span className="text-sm font-black text-slate-400">{goal.progress || 0}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-1000 ease-out rounded-full ${goal.completed ? 'bg-green-400' : 'bg-blue-600'}`}
                                            style={{ width: `${goal.progress || 0}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-slate-400 italic">No active goals listed.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-black text-slate-800 mb-6 tracking-tight uppercase">Identity Badges</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {displayedUser.badges.map(badge => (
                                <div key={badge.id} className="flex flex-col items-center p-6 rounded-3xl bg-linear-to-b from-slate-50 to-white border border-slate-100 text-center transition-transform hover:scale-105 cursor-pointer">
                                    <span className="text-4xl mb-3 filter drop-shadow-sm">{badge.icon}</span>
                                    <span className="text-[11px] font-black text-slate-700 uppercase leading-tight">{badge.name}</span>
                                </div>
                            ))}
                            <div className="flex flex-col items-center p-6 rounded-3xl border-2 border-dashed border-slate-100 justify-center group hover:border-blue-200 transition-colors cursor-pointer">
                                <span className="text-slate-300 text-2xl font-black group-hover:text-blue-300 transition-colors">?</span>
                                <span className="text-[10px] text-slate-400 font-black mt-1 uppercase tracking-widest">Locked</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-4xl p-8 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                        <h4 className="text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Mentor Wisdom</h4>
                        <p className="text-slate-300 text-sm italic leading-relaxed">
                            "Your future self is watching you right now through memories. Make him proud."
                        </p>
                        <div className="mt-6 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center font-bold text-xs">M</div>
                            <span className="text-xs font-bold text-slate-400">- Marcus Aurelius (Mod)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatBox: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="text-center bg-slate-50 px-6 md:px-8 py-3 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:shadow-md hover:border-blue-50">
        <span className="block font-black text-xl md:text-2xl text-slate-900 tracking-tight">{value}</span>
        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">{label}</span>
    </div>
);

export default Profile;
