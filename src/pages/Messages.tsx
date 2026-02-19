
import React, { useState } from 'react';

const Messages: React.FC = () => {
    const [selectedThread, setSelectedThread] = useState('1');

    const threads = [
        { id: '1', name: 'Jordan Vane', lastMsg: 'Let\'s hit the gym tomorrow at 6am?', time: '10m ago', avatar: 'https://picsum.photos/seed/t1/200/200', online: true },
        { id: '2', name: 'Mark Chen', lastMsg: 'Thanks for the feedback on my diary entry.', time: '2h ago', avatar: 'https://picsum.photos/seed/t2/200/200', online: false },
        { id: '3', name: 'Liam Scott', lastMsg: 'Check out this podcast on discipline.', time: '1d ago', avatar: 'https://picsum.photos/seed/t3/200/200', online: true }
    ];

    const messages = [
        { id: 'm1', sender: 'them', text: 'Hey Alex, how is the discipline challenge going?', time: '10:05 AM' },
        { id: 'm2', sender: 'me', text: 'Going strong. 14 days without missing a 5am wakeup.', time: '10:12 AM' },
        { id: 'm3', sender: 'them', text: 'That is incredible. Let\'s hit the gym tomorrow at 6am?', time: '10:14 AM' }
    ];

    return (
        <div className="h-[calc(100vh-10rem)] bg-white rounded-3xl border border-slate-200 shadow-sm flex overflow-hidden">
            <div className="w-full md:w-1/3 border-r border-slate-100 flex flex-col">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Messages</h2>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100"
                        />
                        <div className="absolute left-3 top-2.5 text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scroll">
                    {threads.map(thread => (
                        <button
                            key={thread.id}
                            onClick={() => setSelectedThread(thread.id)}
                            className={`w-full p-4 flex items-center gap-4 transition-colors hover:bg-slate-50 ${selectedThread === thread.id ? 'bg-blue-50' : ''}`}
                        >
                            <div className="relative">
                                <img src={thread.avatar} className="w-12 h-12 rounded-2xl object-cover" alt={thread.name} />
                                {thread.online && <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />}
                            </div>
                            <div className="flex-1 text-left">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-bold text-slate-800 text-sm">{thread.name}</h4>
                                    <span className="text-[10px] text-slate-400">{thread.time}</span>
                                </div>
                                <p className="text-xs text-slate-500 truncate">{thread.lastMsg}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="hidden md:flex flex-1 flex-col">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={threads.find(t => t.id === selectedThread)?.avatar} className="w-10 h-10 rounded-xl" alt="Selected" />
                        <div>
                            <h3 className="font-bold text-slate-800">{threads.find(t => t.id === selectedThread)?.name}</h3>
                            <span className="text-xs text-green-500 font-medium">Active now</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 text-slate-400 hover:text-blue-600"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg></button>
                        <button className="p-2 text-slate-400 hover:text-blue-600"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scroll">
                    {messages.map(m => (
                        <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-md p-4 rounded-2xl text-sm ${m.sender === 'me'
                                    ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-100'
                                    : 'bg-slate-100 text-slate-700 rounded-tl-none'
                                }`}>
                                {m.text}
                                <div className={`text-[10px] mt-1 ${m.sender === 'me' ? 'text-blue-200' : 'text-slate-400'}`}>
                                    {m.time}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-6 border-t border-slate-100">
                    <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                        <button className="p-2 text-slate-400 hover:text-blue-600"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.51a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg></button>
                        <input
                            type="text"
                            placeholder="Send a supportive message..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2"
                        />
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-semibold transition-colors">
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;
