import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router';
import { LogOut, Settings, User } from 'lucide-react';
import useUserStore from '@/store/userStore';

{/* User profile section */ }
export default function UserProfile() {
    const { user, logout } = useUserStore(state => state);

    const handleLogout = async () => {
        logout();
    }
    return (
        <div className="border-t border-primary/10 p-4">
            {user && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition">
                            <Avatar className="w-10 h-10">
                                <AvatarImage src={user?.avatar} />
                                <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                                    {user?.name?.[0].toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            {/* <div className="hidden md:block text-left flex-1">
                                <p className="text-sm font-medium">{user?.name || user.username}</p>
                                <p className="text-xs text-muted-foreground">@{user.username}</p>
                            </div> */}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                        <DropdownMenuItem asChild>
                            <Link to={`/profile/@${user?.username}`} className="flex items-center gap-2 cursor-pointer">
                                <User size={16} />
                                <span>View Profile</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                                <Settings size={16} />
                                <span>Settings</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                        >
                            <LogOut size={16} />
                            <span>Sign Out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    )
}
