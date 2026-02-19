
import React, { useState, useEffect, useRef } from 'react';
import { MOCK_POSTS } from '../constants';
import PostCard from '../components/PostCard';
import { moderateContent, generateReflectionPrompt } from '../services/geminiService';
import type { MediaType } from '../types';

const Feed: React.FC = () => {
    const [posts, setPosts] = useState(MOCK_POSTS);
    const [newPost, setNewPost] = useState('');
    const [mediaType, setMediaType] = useState<MediaType>('text');
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [isPosting, setIsPosting] = useState(false);
    const [error, setError] = useState('');
    const [storyPrompt, setStoryPrompt] = useState('How did you face discomfort today?');

    // Tag state
    const [tagInput, setTagInput] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>(['Growth']);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchPrompt = async () => {
            const p = await generateReflectionPrompt();
            setStoryPrompt(p);
        };
        fetchPrompt();
    }, []);

    // Clear media when changing types
    useEffect(() => {
        // setMediaFile(null);
        // setMediaPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, [mediaType]);

    const generateVideoThumbnail = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const url = URL.createObjectURL(file);
            const video = document.createElement('video');
            video.src = url;
            video.muted = true;
            video.playsInline = true;

            video.onloadeddata = () => {
                video.currentTime = 1;
            };

            video.onseeked = () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const thumb = canvas.toDataURL('image/jpeg');
                    URL.revokeObjectURL(url);
                    resolve(thumb);
                }
            };
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setMediaFile(file);
            if (file.type.startsWith('video/')) {
                const thumb = await generateVideoThumbnail(file);
                setMediaPreview(thumb);
            } else {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setMediaPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
        if (e.type === 'keydown' && (e as React.KeyboardEvent).key !== 'Enter') return;
        if (e.type === 'keydown') e.preventDefault();

        const tag = tagInput.trim().replace(/^#/, '');
        if (tag && !selectedTags.includes(tag) && selectedTags.length < 5) {
            setSelectedTags([...selectedTags, tag]);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setSelectedTags(selectedTags.filter(t => t !== tagToRemove));
    };

    const handlePost = async () => {
        if (!newPost.trim() && !mediaFile) return;
        setIsPosting(true);
        setError('');

        const moderation = await moderateContent(newPost);
        if (!moderation.isSafe) {
            setError(`Your post needs refinement: ${moderation.reason}`);
            setIsPosting(false);
            return;
        }

        // In a real app, you would upload the file and get a URL. 
        // Here we use the blob/preview URL for demonstration.
        let mediaUrl = mediaPreview || undefined;
        if (mediaFile && !mediaUrl) {
            mediaUrl = URL.createObjectURL(mediaFile);
        }

        const post = {
            id: Date.now().toString(),
            userId: 'u1',
            authorName: 'Alex Sterling',
            authorAvatar: 'https://picsum.photos/seed/alex/200/200',
            content: newPost,
            mediaType: mediaType,
            mediaUrl: mediaUrl,
            timestamp: 'Just now',
            encouragements: 0,
            tags: selectedTags.length > 0 ? selectedTags : ['Growth'],
            comments: []
        };

        setPosts([post as any, ...posts]);
        setNewPost('');
        setMediaType('text');
        setMediaFile(null);
        setMediaPreview(null);
        setSelectedTags(['Growth']);
        setIsPosting(false);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-20">
            {/* Guided Story Exchange Banner */}
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

            <div className="bg-white rounded-3xl shadow-sm p-5 border border-slate-200">
                <textarea
                    id="post-area"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Share a growth milestone or a hard lesson..."
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-100 resize-none h-28 text-[15px]"
                />

                {/* Media Upload Section */}
                {mediaType !== 'text' && (
                    <div className="mt-4 p-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 transition-all hover:bg-slate-100/50">
                        {!mediaFile ? (
                            <div className="flex flex-col items-center justify-center py-4 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-2">
                                    {mediaType === 'video' ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
                                    )}
                                </div>
                                <p className="text-sm font-bold text-slate-600">Click to upload {mediaType === 'video' ? 'Video' : 'Audio'}</p>
                                <p className="text-xs text-slate-400 mt-1">MP4, MOV, MP3 or WAV supported</p>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept={mediaType === 'video' ? 'video/*' : 'audio/*'}
                                    onChange={handleFileChange}
                                />
                            </div>
                        ) : (
                            <div className="relative group">
                                <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                        {mediaType === 'video' ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" /></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 truncate">{mediaFile.name}</p>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{(mediaFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                    </div>
                                    <button
                                        onClick={() => { setMediaFile(null); setMediaPreview(null); }}
                                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                    </button>
                                </div>
                                {mediaType === 'video' && mediaPreview && (
                                    <div className="mt-3 relative rounded-xl overflow-hidden border border-slate-100 aspect-video bg-black">
                                        <img src={mediaPreview} className="w-full h-full object-cover opacity-70" alt="Video Preview" />
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                                            </div>
                                        </div>
                                        <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest">Thumbnail Generated</span>
                                    </div>
                                )}
                                {mediaType === 'audio' && mediaPreview && (
                                    <audio src={mediaPreview} controls className="mt-3 w-full h-8" />
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Tags Selection Section */}
                <div className="mt-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                        {selectedTags.map(tag => (
                            <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100 animate-in fade-in zoom-in duration-200"
                            >
                                #{tag}
                                <button
                                    onClick={() => removeTag(tag)}
                                    className="hover:text-blue-800 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleAddTag}
                            placeholder="Add growth tag (e.g. Discipline, Fitness)..."
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-blue-100"
                            disabled={selectedTags.length >= 5}
                        />
                        <button
                            onClick={handleAddTag}
                            className="absolute right-3 top-2 text-blue-600 font-bold text-xs disabled:text-slate-300"
                            disabled={!tagInput.trim() || selectedTags.length >= 5}
                        >
                            Add
                        </button>
                    </div>
                    {selectedTags.length >= 5 && <p className="text-[10px] text-slate-400 mt-1">Maximum 5 tags reached.</p>}
                </div>

                {error && (
                    <div className="flex items-center gap-2 mt-2 px-2 text-red-500 text-xs bg-red-50 p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                        {error}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
                        <button
                            onClick={() => setMediaType('text')}
                            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mediaType === 'text' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                        >
                            Text
                        </button>
                        <button
                            onClick={() => setMediaType('video')}
                            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mediaType === 'video' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                        >
                            Video
                        </button>
                        <button
                            onClick={() => setMediaType('audio')}
                            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mediaType === 'audio' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                        >
                            Audio
                        </button>
                    </div>

                    <button
                        disabled={isPosting || (mediaType !== 'text' && !mediaFile && !newPost.trim())}
                        onClick={handlePost}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-8 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-blue-100 transition-all hover:-translate-y-0.5"
                    >
                        {isPosting ? 'Verifying Integrity...' : 'Publish Story'}
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Growth Stream</h2>
                    <div className="flex gap-2">
                        <button className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Recent</button>
                        <button className="text-xs font-bold text-slate-400 px-3 py-1 rounded-full">Mentors</button>
                    </div>
                </div>

                {posts.map(post => (
                    <PostCard key={post.id} post={post as any} />
                ))}
            </div>

            <div className="flex flex-col items-center py-8 opacity-50">
                <div className="w-1 h-12 bg-linear-to-b from-blue-200 to-transparent rounded-full mb-4"></div>
                <p className="text-slate-400 text-xs font-medium italic">You've reached the current milestones of your circle.</p>
            </div>
        </div>
    );
};

export default Feed;
