import DailyStoryExchangePrompt from '@/components/feed/DailyStoryExchangePrompt';
import CreatePostForm from '@/components/feed/CreatePostForm';
import GrowthStreamPosts from '@/components/feed/GrowthStreamPosts';

const Feed: React.FC = () => {
    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-20">
            {/* Guided Story Exchange Banner */}
            <DailyStoryExchangePrompt />

            {/* Create Post Form */}
            <CreatePostForm />

            {/* Growth Stream Posts */}
            <GrowthStreamPosts />

            <div className="flex flex-col items-center py-8 opacity-50">
                <div className="w-1 h-12 bg-linear-to-b from-blue-200 to-transparent rounded-full mb-4"></div>
                <p className="text-slate-400 text-xs font-medium italic">You've reached the current milestones of your circle.</p>
            </div>
        </div>
    );
};

export default Feed;
