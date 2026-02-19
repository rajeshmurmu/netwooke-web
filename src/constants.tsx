
import { UserRole, type Post, type User } from './types';

export const COLORS = {
    primary: '#3B82F6',
    secondary: '#60A5FA',
    accent: '#FACC15',
    bg: '#F8FAFC',
    card: '#FFFFFF',
    text: '#1E293B',
    muted: '#64748B'
};

export const MOCK_USER: User = {
    id: 'u1',
    name: 'Alex Sterling',
    username: 'alex_growth',
    avatar: 'https://picsum.photos/seed/alex/200/200',
    role: UserRole.USER,
    bio: 'Focused on disciplined routines and mindful living. 16-30 growth journey.',
    goals: [
        { id: 'g1', title: '5am Morning Routine', completed: true, category: 'discipline', progress: 100 },
        { id: 'g2', title: 'Read 24 books this year', completed: false, category: 'mindset', progress: 45 },
        { id: 'g3', title: 'Clean and Press 60kg', completed: false, category: 'fitness', progress: 80 }
    ],
    joinedAt: 'Jan 2024',
    badges: [
        { id: 'b1', name: '7-Day Streak', icon: '🔥' },
        { id: 'b2', name: 'Supportive Friend', icon: '🤝' }
    ]
};

export const MOCK_USERS: User[] = [
    MOCK_USER,
    {
        id: 'u2',
        name: 'Jordan Vane',
        username: 'jordan_v',
        avatar: 'https://picsum.photos/seed/jordan/200/200',
        role: UserRole.USER,
        isMentor: true,
        bio: 'Marathon runner and productivity coach. Helping brothers find their pace.',
        goals: [
            { id: 'jg1', title: 'Berlin Marathon Training', completed: false, category: 'fitness', progress: 65 }
        ],
        joinedAt: 'Nov 2023',
        badges: [{ id: 'b3', name: 'Mentor', icon: '🛡️' }]
    },
    {
        id: 'u3',
        name: 'Marcus Aurelius (Mod)',
        username: 'stoic_marcus',
        avatar: 'https://picsum.photos/seed/stoic/200/200',
        role: UserRole.MODERATOR,
        isMentor: true,
        bio: 'Moderator of Network Tube. Focused on stoic principles and community safety.',
        goals: [],
        joinedAt: 'Dec 2023',
        badges: [{ id: 'b4', name: 'Guardian', icon: '⚖️' }]
    },
    {
        id: 'u4',
        name: 'Mark Chen',
        username: 'mchen_dev',
        avatar: 'https://picsum.photos/seed/mark/200/200',
        role: UserRole.USER,
        bio: 'Software engineer by day, student of life by night.',
        goals: [
            { id: 'mg1', title: 'Learn Rust', completed: false, category: 'career', progress: 30 }
        ],
        joinedAt: 'Feb 2024',
        badges: []
    }
];

export const MOCK_POSTS: Post[] = [
    {
        id: 'p1',
        userId: 'u2',
        authorUsername: 'jordan_v',
        authorName: 'Jordan Vane',
        authorAvatar: 'https://picsum.photos/seed/jordan/200/200',
        isMentor: true,
        content: 'Just finished a 10km run. It wasn\'t about the pace today, just about showing up. Discipline is a muscle.',
        mediaType: 'video',
        mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        timestamp: '2 hours ago',
        encouragements: 42,
        tags: ['Fitness', 'Discipline'],
        comments: [
            { id: 'c1', authorName: 'Alex Sterling', authorAvatar: 'https://picsum.photos/seed/alex/200/200', text: 'Great work Jordan! Consistency is key.', timestamp: '1 hour ago' }
        ]
    },
    {
        id: 'p2',
        userId: 'u3',
        authorUsername: 'stoic_marcus',
        authorName: 'Marcus Aurelius (Mod)',
        authorAvatar: 'https://picsum.photos/seed/stoic/200/200',
        isMentor: true,
        content: 'Listen to this short reflection on resilience. When things go wrong, don\'t ask "Why me?", ask "How can I grow from this?"',
        mediaType: 'audio',
        mediaUrl: 'https://www.w3schools.com/html/horse.mp3',
        timestamp: '5 hours ago',
        encouragements: 128,
        tags: ['Mindset', 'Growth'],
        comments: []
    },
    {
        id: 'p3',
        userId: 'u4',
        authorUsername: 'mchen_dev',
        authorName: 'Mark Chen',
        authorAvatar: 'https://picsum.photos/seed/mark/200/200',
        content: 'I used to struggle with social anxiety. Today I attended a career networking event and actually initiated three conversations. Small wins matter.',
        mediaType: 'text',
        timestamp: '1 day ago',
        encouragements: 85,
        tags: ['Mindset', 'Career'],
        comments: [
            { id: 'c2', authorName: 'Liam Scott', authorAvatar: 'https://picsum.photos/seed/t3/200/200', text: 'Huge win, Mark. Proud of you.', timestamp: '12 hours ago' }
        ]
    }
];

export const MOCK_GROUPS = [
    { id: 'gr1', name: 'Daily Discipline', description: 'Accountability for early risers and habit builders.', category: 'Discipline', membersCount: 1240, coverImage: 'https://picsum.photos/seed/gr1/800/400' },
    { id: 'gr2', name: 'Tech Career Prep', description: 'Mock interviews and resume reviews for aspiring engineers.', category: 'Career', membersCount: 850, coverImage: 'https://picsum.photos/seed/gr2/800/400' },
    { id: 'gr3', name: 'Iron Brothers', description: 'A community focused on physical strength and mental toughness.', category: 'Fitness', membersCount: 3200, coverImage: 'https://picsum.photos/seed/gr3/800/400' }
];
