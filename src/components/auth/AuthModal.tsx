import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

interface AuthModalProps {
    showAuthModal: boolean;
    onClose: () => void;
    defaultMode?: 'login' | 'signup';
}

export default function AuthModal({ showAuthModal, onClose, defaultMode = 'login' }: AuthModalProps) {
    const [mode, setMode] = useState(defaultMode);

    return (
        showAuthModal && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => onClose()}></div>
                <div className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl relative z-10">
                    <div className="p-8 sm:p-12">
                        <div className="text-center mb-10">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-6 shadow-xl shadow-blue-100">N</div>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">

                                {mode === 'login' ? 'Welcome Back' : 'Claim Your Spot'}
                            </h3>
                            <p className="text-slate-500 mt-2">
                                {
                                    mode === 'login'
                                        ? 'Resume your transmission with the network.'
                                        : 'Join a community of brothers dedicated to excellence.'
                                }
                            </p>
                        </div>
                        {
                            mode === 'login' ? (
                                <LoginForm onSuccess={onClose} onSwitchToSignup={() => setMode('signup')} />
                            ) : (
                                <SignupForm onSuccess={onClose} onSwitchToLogin={() => setMode('login')} />
                            )
                        }
                    </div>
                </div>
            </div>
        )
    )


}


