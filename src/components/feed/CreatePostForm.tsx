import useCreatePost from '@/hooks/useCreatePost';
import postSchema from '@/lib/zod/postSchema';
import React, { useEffect, useRef, useState } from 'react'

export const MediaType = {
    AUDIO: 'audio',
    VIDEO: 'video',
    IMAGE: 'image',
    NONE: 'none'
} as const

export default function CreatePostForm() {
    const { createPost, error: modeRationError } = useCreatePost();
    const [newPost, setNewPost] = useState('');
    const [mediaType, setMediaType] = useState<typeof MediaType[keyof typeof MediaType]>('none');
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [isPosting, setIsPosting] = useState(false);
    const [error, setError] = useState('');

    // Tag state
    const [tagInput, setTagInput] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>(['Growth']);

    const fileInputRef = useRef<HTMLInputElement>(null);

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
        try {
            if (mediaType === MediaType.AUDIO || mediaType === MediaType.VIDEO) {
                if (!mediaFile) {
                    setError('Please select a file');
                    return;
                }
            }
            setIsPosting(true);
            setError('');
            const validateData = postSchema.safeParse({
                content: newPost,
                mediaType,
                media: mediaFile,
                tags: selectedTags
            })

            if (!validateData.success) {
                setError(validateData.error.message);
                return;
            }

            await createPost({
                content: newPost,
                mediaType: mediaType,
                media: mediaFile,
                tags: selectedTags,
                visibility: 'public'
            });


        } catch (error) {
            console.error("Error creating post:", error);
        } finally {
            setNewPost('');
            setMediaType('none');
            setMediaFile(null);
            setMediaPreview(null);
            setSelectedTags(['Growth']);
            setIsPosting(false);
        }
    };


    useEffect(() => {
        if (modeRationError?.message.startsWith("modeRationError:")) {
            const errorMessage = modeRationError?.message.replace("modeRationError:", "");
            setError(errorMessage || "Your content was flagged by our moderation system. Please refine your wisdom and try again.");
            return;

        }
    }, [modeRationError])

    return (
        <div className="bg-white rounded-3xl shadow-sm p-5 border border-slate-200">
            <textarea
                id="post-area"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share a growth milestone or a hard lesson..."
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-100 resize-x-none no-scrollbar h-28 text-[15px] field-sizing-content min-h-32"
            />

            {/* Media Upload Section */}
            {mediaType !== 'none' && (
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
                        onClick={() => setMediaType('none')}
                        className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mediaType === 'none' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
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
                    disabled={isPosting || (mediaType !== 'none' && !mediaFile && !newPost.trim())}
                    onClick={handlePost}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-8 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-blue-100 transition-all hover:-translate-y-0.5"
                >
                    {isPosting ? 'Verifying Integrity...' : 'Publish Story'}
                </button>
            </div>
        </div>
    )
}
