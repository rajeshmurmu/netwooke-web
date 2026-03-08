import type { DairyEntryResponse } from "@/types";


export default function DiaryEntryCard({ entry, isCommunity }: { entry: DairyEntryResponse; isCommunity?: boolean }) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm transition-colors">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                    {isCommunity && (
                        <img
                            src={entry?.user?.avatar || `https://picsum.photos/seed/${entry.userId}/200/200`}
                            className="w-8 h-8 rounded-full border border-slate-100"
                            alt={entry?.user?.name || 'User Avatar'}
                        />
                    )}
                    <div>
                        <h4 className="font-bold text-slate-800 leading-tight">{entry.title}</h4>
                        {isCommunity && <p className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider">{entry?.user?.name || 'Anonymous'}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest">{new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    {!isCommunity && !entry.isPrivate && <span className="bg-green-50 text-green-600 text-[9px] px-2 py-0.5 rounded-full font-bold">PUBLIC</span>}
                </div>
            </div>
            <p className="text-slate-600 text-sm line-clamp-3">{entry.content}</p>
        </div>
    );
}