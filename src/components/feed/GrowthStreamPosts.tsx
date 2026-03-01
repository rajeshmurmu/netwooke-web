import PostCard from '../PostCard'
import { usePosts } from '@/hooks/usePosts';
import { PostFeedSkeleton } from '../skeleton/PostFeedSkeleton';

export default function GrowthStreamPosts() {
    const { posts, isLoading } = usePosts();

    if (isLoading) {
        return (
            <PostFeedSkeleton />
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Growth Stream</h2>
                <div className="flex gap-2">
                    <button className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Recent</button>
                    <button className="text-xs font-bold text-slate-400 px-3 py-1 rounded-full">Mentors</button>
                </div>
            </div>

            {posts?.map(post => (
                <PostCard key={post._id} post={post} />
            ))}
        </div>
    )
}
