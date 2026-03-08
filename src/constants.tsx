
import { UserRole, type User } from './types';

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
    _id: 'u1',
    name: 'Alex Sterling',
    username: 'alex_growth',
    avatar: 'https://picsum.photos/seed/alex/200/200',
    role: UserRole.USER,
    bio: 'Focused on disciplined routines and mindful living. 16-30 growth journey.',
    goals: [
        { _id: 'g1', title: '5am Morning Routine', completed: true, category: 'discipline', progress: 100 },
        { _id: 'g2', title: 'Read 24 books this year', completed: false, category: 'mindset', progress: 45 },
        { _id: 'g3', title: 'Clean and Press 60kg', completed: false, category: 'fitness', progress: 80 }
    ],
    createdAt: new Date('2024-01-15T08:00:00Z'),
    isDeleted: false,
    isMentor: false,
    isVerified: true,
    status: 'active',
    updatedAt: new Date('2024-04-20T12:00:00Z'),
    badges: [
        { _id: 'b1', name: '7-Day Streak', icon: '🔥' },
        { _id: 'b2', name: 'Supportive Friend', icon: '🤝' }
    ]
};

export const MOCK_USERS: User[] = [
    MOCK_USER,
    {
        _id: 'u2',
        name: 'Jordan Vane',
        username: 'jordan_v',
        avatar: 'https://picsum.photos/seed/jordan/200/200',
        role: UserRole.USER,
        isMentor: true,
        bio: 'Marathon runner and productivity coach. Helping brothers find their pace.',
        goals: [
            { _id: 'jg1', title: 'Berlin Marathon Training', completed: false, category: 'fitness', progress: 65 }
        ],
        createdAt: new Date('2024-02-01T09:30:00Z'),
        isDeleted: false,
        isVerified: true,
        status: 'active',
        updatedAt: new Date('2024-05-10T14:45:00Z'),
        badges: [{ _id: 'b3', name: 'Mentor', icon: '🛡️' }]
    },
    {
        _id: 'u3',
        name: 'Marcus Aurelius (Mod)',
        username: 'stoic_marcus',
        avatar: 'https://picsum.photos/seed/stoic/200/200',
        role: UserRole.MODERATOR,
        isMentor: true,
        bio: 'Moderator of Network Tube. Focused on stoic principles and community safety.',
        goals: [],
        createdAt: new Date('2024-01-01T00:00:00Z'),
        isDeleted: false,
        isVerified: true,
        status: 'active',
        updatedAt: new Date('2024-06-01T00:00:00Z'),
        badges: [{ _id: 'b4', name: 'Guardian', icon: '⚖️' }]
    },
    {
        _id: 'u4',
        name: 'Mark Chen',
        username: 'mchen_dev',
        avatar: 'https://picsum.photos/seed/mark/200/200',
        role: UserRole.USER,
        bio: 'Software engineer by day, student of life by night.',
        goals: [
            { _id: 'mg1', title: 'Learn Rust', completed: false, category: 'career', progress: 30 }
        ],
        createdAt: new Date('2024-03-10T11:15:00Z'),
        isDeleted: false,
        isVerified: true,
        status: 'active',
        updatedAt: new Date('2024-05-15T16:20:00Z'),
        isMentor: false,
        badges: []
    }
];


export const MOCK_GROUPS = [
    { _id: 'gr1', name: 'Daily Discipline', description: 'Accountability for early risers and habit builders.', category: 'Discipline', membersCount: 1240, coverImage: 'https://picsum.photos/seed/gr1/800/400' },
    { _id: 'gr2', name: 'Tech Career Prep', description: 'Mock interviews and resume reviews for aspiring engineers.', category: 'Career', membersCount: 850, coverImage: 'https://picsum.photos/seed/gr2/800/400' },
    { _id: 'gr3', name: 'Iron Brothers', description: 'A community focused on physical strength and mental toughness.', category: 'Fitness', membersCount: 3200, coverImage: 'https://picsum.photos/seed/gr3/800/400' }
];
