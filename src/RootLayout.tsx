import { BookMarkedIcon, HomeIcon, MessageSquareIcon, ShieldIcon, UsersIcon } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router";
import { useAuth } from "./context/AuthContext";
import { UserRole } from "./types";

export default function RootLayout() {
    const { user, logout } = useAuth();
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
            <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <Link to="/" className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                N
                            </Link>
                            <Link to="/" className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">Network Tube</Link>
                        </div>

                        <nav className="hidden md:flex space-x-8">
                            <NavItem to="/" icon={<HomeIcon />} label="Feed" />
                            <NavItem to="/dairy" icon={<BookMarkedIcon />} label="Diary" />
                            <NavItem to="/groups" icon={<UsersIcon />} label="Groups" />
                            <NavItem to="/messages" icon={<MessageSquareIcon />} label="Messages" />
                        </nav>

                        <div className="flex items-center gap-4">
                            <Link to={`/profile/${user?.username}`} className="flex items-center gap-2 group">
                                <img src={user?.avatar?.url} className="w-8 h-8 rounded-full border border-slate-200 group-hover:border-blue-300 transition-colors" alt="Profile" />
                                <span className="hidden sm:inline font-medium text-sm group-hover:text-blue-600 transition-colors">{user?.name}</span>
                            </Link>
                            {user?.role === UserRole.MODERATOR && (
                                <Link to="/moderator" className="p-2 text-slate-500 hover:text-blue-600">
                                    <ShieldIcon />
                                </Link>
                            )}
                            <button onClick={logout} className="text-sm text-slate-500 hover:text-red-500 font-medium">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
                {/* // mobile navigation */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around py-3 z-50">
                    <NavItem to="/" icon={<HomeIcon />} label="Feed" />
                    <NavItem to="/dairy" icon={<BookMarkedIcon />} label="Diary" />
                    <NavItem to="/groups" icon={<UsersIcon />} label="Groups" />
                    <NavItem to="/messages" icon={<MessageSquareIcon />} label="Messages" />
                </nav>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
                <Outlet />
            </main>

        </div>
    )
}


const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {

    return (
        <NavLink
            to={to}
            className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-blue-600' : 'text-slate-500'} hover:text-blue-600`}
        >
            {icon}
            {label && <span className="text-xs">{label}</span>}
        </NavLink>
    );
};