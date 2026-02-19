import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext';


interface LoginFormProps {
    onSuccess?: () => void
    onSwitchToSignup?: () => void
}

export default function LoginForm({ onSuccess, onSwitchToSignup }: LoginFormProps) {
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setIsSubmitting(true);
        try {
            e.preventDefault();
            await login({
                username: formData.email,
                password: formData.password
            });
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            setError("Something went wrong. Please try again.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <form onSubmit={handleAuthSubmit} className="space-y-4">
            <input
                required
                type="email"
                placeholder="Email Address"
                className="w-full bg-slate-50 border-slate-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-100 border focus:border-blue-200 transition-all font-bold text-slate-900"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
            <input
                required
                type="password"
                placeholder="Security Key (Password)"
                className="w-full bg-slate-50 border-slate-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-100 border focus:border-blue-200 transition-all font-bold text-slate-900"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
            />

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100 animate-pulse">
                    ⚠️ {error}
                </div>
            )}

            <button
                disabled={isSubmitting}
                type="submit"
                className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-3 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
            >
                {isSubmitting ? (
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                    'Authenticate'
                )}
            </button>

            <div className="mt-8 text-center">
                <button
                    type="button"
                    onClick={onSwitchToSignup}
                    className="text-xs font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors"
                >
                    Don't have a spot? Register
                </button>
            </div>
        </form>
    )
}
