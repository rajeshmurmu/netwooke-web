
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import type { Post, Comment } from '../types';
import { moderateContent } from '../services/geminiService';

interface PostCardProps {
    post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const [count, setCount] = useState(post.encouragements);
    const [encouraged, setEncouraged] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<Comment[]>(post.comments || []);
    const [newComment, setNewComment] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);
    const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const optionsRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
                setShowOptionsMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Thumbnail generation logic
    useEffect(() => {
        if (post.mediaType === 'video' && post.mediaUrl && !videoThumbnail) {
            const video = document.createElement('video');
            video.src = post.mediaUrl;
            video.crossOrigin = 'anonymous';
            video.muted = true;
            video.playsInline = true;

            video.onloadeddata = () => {
                video.currentTime = 1; // Capture frame at 1 second
            };

            video.onseeked = () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    setVideoThumbnail(canvas.toDataURL('image/jpeg'));
                }
            };
        }
    }, [post.mediaUrl, post.mediaType, videoThumbnail]);

    const handleEncourage = () => {
        if (encouraged) {
            setCount(count - 1);
        } else {
            setCount(count + 1);
        }
        setEncouraged(!encouraged);
    };

    const handleCopyLink = () => {
        const link = `${window.location.origin}/#/post/${post.id}`;
        navigator.clipboard.writeText(link);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmittingComment(true);
        const moderation = await moderateContent(newComment);

        if (!moderation.isSafe) {
            alert(`Network Tube is a safe space. Please refine your wisdom: ${moderation.reason}`);
            setIsSubmittingComment(false);
            return;
        }

        const comment: Comment = {
            id: Date.now().toString(),
            authorName: 'Alex Sterling',
            authorAvatar: 'https://picsum.photos/seed/alex/200/200',
            text: newComment,
            timestamp: 'Just now'
        };

        setComments([...comments, comment]);
        setNewComment('');
        setIsSubmittingComment(false);
    };

    const handleTogglePlay = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    const postLink = `${window.location.origin}/#/post/${post.id}`;
    const postText = `Check out this growth story on Network Tube: "${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}"`;
    const shareContent = `${postText} ${postLink}`;

    const handleOptionClick = (action: string) => {
        setShowOptionsMenu(false);
        alert(`Action "${action}" triggered for this story.`);
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 transition-all hover:border-blue-100 group relative">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Link to={`/profile/${post.authorUsername}`} className="relative group/avatar shrink-0">
                        <img src={post.authorAvatar} className="w-12 h-12 rounded-2xl bg-slate-200 border-2 border-white shadow-sm transition-transform group-hover/avatar:scale-105" alt={post.authorName} />
                        {post.isMentor && (
                            <div className="absolute -top-1 -right-1 bg-amber-400 text-white rounded-full p-1 shadow-sm" title="Growth Mentor">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 15 2 2 4-4" /><rect width="18" height="18" x="3" y="3" rx="2" /></svg>
                            </div>
                        )}
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <Link to={`/profile/${post.authorUsername}`} className="font-bold text-slate-800 leading-tight flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                                {post.authorName}
                                {post.isMentor && <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded uppercase tracking-wider font-extrabold">Mentor</span>}
                            </Link>
                            <button
                                onClick={() => setIsFollowing(!isFollowing)}
                                className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all border ${isFollowing
                                    ? 'bg-slate-50 text-slate-500 border-slate-200'
                                    : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                                    }`}
                            >
                                {isFollowing ? 'Following' : 'Follow'}
                            </button>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">{post.timestamp}</span>
                    </div>
                </div>

                <div className="relative" ref={optionsRef}>
                    <button
                        onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                        className="text-slate-300 hover:text-slate-500 p-1 rounded-lg hover:bg-slate-50 transition-colors"
                        aria-label="More options"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
                    </button>

                    {showOptionsMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden py-1 animate-in fade-in zoom-in duration-200 origin-top-right">
                            <button onClick={() => handleOptionClick('Save for Later')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg>
                                Save for Later
                            </button>
                            <button onClick={() => handleOptionClick('Hide Story')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                Hide Story
                            </button>
                            <div className="h-px bg-slate-50 my-1"></div>
                            <button onClick={() => handleOptionClick('Report Content')} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors font-semibold">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" x2="4" y1="22" y2="15" /></svg>
                                Report Content
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <p className="text-slate-700 leading-relaxed mb-4 whitespace-pre-wrap text-[15px]">
                {post.content}
            </p>

            {post.mediaType === 'video' && post.mediaUrl && (
                <div className="rounded-2xl overflow-hidden mb-4 border border-slate-100 bg-black aspect-video relative group/video">
                    <video
                        ref={videoRef}
                        src={post.mediaUrl}
                        controls
                        playsInline
                        className="w-full h-full object-contain"
                        poster={videoThumbnail || undefined}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        aria-label={`Growth milestone video by ${post.authorName}`}
                    />
                    {!isPlaying && (
                        <button
                            onClick={handleTogglePlay}
                            className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/video:bg-black/30 transition-all z-10"
                            aria-label="Play video"
                        >
                            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-2xl text-blue-600 transform scale-100 hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                            </div>
                        </button>
                    )}
                    <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-widest z-20 pointer-events-none">
                        Growth Video
                    </div>
                </div>
            )}

            {post.mediaType === 'audio' && post.mediaUrl && (
                <div className="bg-slate-50 rounded-2xl p-4 mb-4 flex items-center gap-4 border border-slate-100">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>
                    </div>
                    <audio src={post.mediaUrl} controls className="flex-1 h-8 opacity-90" aria-label={`Growth reflection audio by ${post.authorName}`} />
                </div>
            )}

            {post.tags && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map(tag => (
                        <span key={tag} className="text-[10px] uppercase tracking-widest font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">#{tag}</span>
                    ))}
                </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleEncourage}
                        className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-300 ${encouraged ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-50 border border-transparent hover:border-slate-100'
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={encouraged ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" /></svg>
                        <span className="text-xs sm:text-sm">{encouraged ? 'Brother Encouraged' : 'Encourage'} ({count})</span>
                    </button>

                    <button
                        onClick={() => setShowShareModal(true)}
                        className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-colors"
                        title="Share with your network"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" x2="12" y1="2" y2="15" /></svg>
                    </button>
                </div>

                <button
                    onClick={() => setShowComments(!showComments)}
                    className={`text-sm font-semibold flex items-center gap-2 px-4 py-2 rounded-2xl transition-all ${showComments ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-blue-600'}`}
                >
                    <div className="p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    </div>
                    <span className="hidden sm:inline">Wisdom Exchange ({comments.length})</span>
                </button>
            </div>

            {showComments && (
                <div className="mt-6 pt-6 border-t border-slate-50 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-4 max-h-64 overflow-y-auto custom-scroll pr-2">
                        {comments.length === 0 ? (
                            <p className="text-center text-slate-400 text-xs py-4 italic">No wisdom shared yet. Be the first to support your brother.</p>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="flex gap-3 items-start">
                                    <img src={comment.authorAvatar} className="w-8 h-8 rounded-xl shrink-0" alt={comment.authorName} />
                                    <div className="flex-1 bg-slate-50 rounded-2xl p-3 border border-slate-100/50">
                                        <div className="flex justify-between items-center mb-1">
                                            <h5 className="text-[13px] font-bold text-slate-800 leading-none">{comment.authorName}</h5>
                                            <span className="text-[10px] text-slate-400">{comment.timestamp}</span>
                                        </div>
                                        <p className="text-[13px] text-slate-600 leading-relaxed">{comment.text}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <form onSubmit={handleAddComment} className="flex gap-3 items-center mt-4">
                        <img src="https://picsum.photos/seed/alex/200/200" className="w-8 h-8 rounded-xl shrink-0" alt="Me" />
                        <div className="flex-1 relative">
                            <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Share supportive wisdom..." className="w-full bg-slate-100 border-none rounded-2xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-100 pr-10" disabled={isSubmittingComment} />
                            <button type="submit" disabled={!newComment.trim() || isSubmittingComment} className="absolute right-2 top-1.5 p-1 text-blue-600 disabled:text-slate-300 transition-colors">
                                {isSubmittingComment ? (
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {showShareModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Share Milestone</h3>
                                    <p className="text-slate-500 text-sm mt-1">Spread positive growth and discipline.</p>
                                </div>
                                <button onClick={() => setShowShareModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                </button>
                            </div>
                            <div className="grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scroll">
                                <button onClick={handleCopyLink} className="flex items-center justify-between w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-blue-100 transition-all text-left group/copy">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-600 group-hover/copy:text-blue-600 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                                        </div>
                                        <span className="font-bold text-slate-700 text-sm">{copySuccess ? 'Link Copied!' : 'Copy Link'}</span>
                                    </div>
                                    {copySuccess && <div className="text-green-500"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>}
                                </button>
                                <a href={`https://wa.me/?text=${encodeURIComponent(shareContent)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-blue-100 transition-all text-left group/wa">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-600 group-hover/wa:text-[#25D366] transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.408 0 12.044c0 2.12.554 4.189 1.602 6.06L0 24l6.117-1.605a11.803 11.803 0 005.925 1.586h.005c6.631 0 12.046-5.411 12.05-12.047a11.823 11.823 0 00-3.515-8.417" /></svg>
                                    </div>
                                    <span className="font-bold text-slate-700 text-sm">WhatsApp Brother</span>
                                </a>
                                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareContent)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-blue-100 transition-all text-left group/tw">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-600 group-hover/tw:text-blue-400 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                    </div>
                                    <span className="font-bold text-slate-700 text-sm">Share to X</span>
                                </a>
                                <a href={`https://www.instagram.com/direct/inbox/`} target="_blank" rel="noopener noreferrer" onClick={() => { navigator.clipboard.writeText(shareContent); alert("Sharing to Instagram: Direct message link opened. Post content copied to clipboard!"); }} className="flex items-center gap-4 w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-blue-100 transition-all text-left group/ig">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-600 group-hover/ig:text-[#E4405F] transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                                    </div>
                                    <span className="font-bold text-slate-700 text-sm">Share to Instagram</span>
                                </a>
                                <a href={`mailto:?subject=Growth Inspiration from Network Tube&body=${encodeURIComponent(shareContent)}`} className="flex items-center gap-4 w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-blue-100 transition-all text-left group/mail">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-600 group-hover/mail:text-blue-500 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                    </div>
                                    <span className="font-bold text-slate-700 text-sm">Email Brother</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostCard;
