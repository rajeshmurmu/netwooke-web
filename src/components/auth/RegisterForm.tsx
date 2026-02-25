import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext'
import { Check, Eye, EyeOff, X } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'

interface PasswordRequirements {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
}


export default function RegisterForm() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        displayName: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordReqs, setPasswordReqs] = useState<PasswordRequirements>({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    const validatePassword = (pass: string) => {
        setPasswordReqs({
            length: pass.length >= 8,
            uppercase: /[A-Z]/.test(pass),
            lowercase: /[a-z]/.test(pass),
            number: /[0-9]/.test(pass),
            special: /[!@#$%^&*]/.test(pass),
        });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const pass = e.target.value;
        setFormData({ ...formData, password: pass });
        validatePassword(pass);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!Object.values(passwordReqs).every(Boolean)) {
            setError('Password does not meet requirements');
            return;
        }

        setLoading(true);

        try {
            await register({ username: formData.username, email: formData.email, password: formData.password });
            console.log('Registration successful');
            navigate("/register?step=verify-otp&email=" + formData.email);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const passwordStrength = Object.values(passwordReqs).filter(Boolean).length;
    return (
        <Card className="w-full max-w-md border-primary/10 shadow-lg">
            <CardHeader className="space-y-2 text-center">
                <CardTitle className="text-3xl font-bold">Join Network Tube</CardTitle>
                <CardDescription>Create an account to get started</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="username" className="text-sm font-medium text-foreground">
                            Username
                        </label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Choose a username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                            disabled={loading}
                            className="bg-input border-primary/20 focus:border-accent"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-foreground">
                            Email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            disabled={loading}
                            className="bg-input border-primary/20 focus:border-accent"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="displayName" className="text-sm font-medium text-foreground">
                            Display Name
                        </label>
                        <Input
                            id="displayName"
                            type="text"
                            placeholder="Your display name"
                            value={formData.displayName}
                            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                            disabled={loading}
                            className="bg-input border-primary/20 focus:border-accent"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium text-foreground">
                            Password
                        </label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Create a strong password"
                                value={formData.password}
                                onChange={handlePasswordChange}
                                required
                                disabled={loading}
                                className="bg-input border-primary/20 focus:border-accent pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                                disabled={loading}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {formData.password && (
                            <div className="space-y-1 mt-2">
                                <div className="flex items-center gap-2 text-xs">
                                    <div
                                        className={`h-2 w-8 rounded ${passwordStrength <= 2 ? 'bg-destructive' : passwordStrength <= 4 ? 'bg-yellow-500' : 'bg-green-500'
                                            }`}
                                    />
                                    <span className="text-muted-foreground">
                                        {passwordStrength <= 2 ? 'Weak' : passwordStrength <= 4 ? 'Fair' : 'Strong'}
                                    </span>
                                </div>
                                <ul className="space-y-1 text-xs">
                                    {[
                                        { req: 'length', label: '8+ characters' },
                                        { req: 'uppercase', label: 'Uppercase letter' },
                                        { req: 'lowercase', label: 'Lowercase letter' },
                                        { req: 'number', label: 'Number' },
                                        { req: 'special', label: 'Special character (!@#$%^&*)' },
                                    ].map(({ req, label }) => (
                                        <li key={req} className="flex items-center gap-1">
                                            {passwordReqs[req as keyof PasswordRequirements] ? (
                                                <Check size={14} className="text-green-500" />
                                            ) : (
                                                <X size={14} className="text-muted-foreground" />
                                            )}
                                            <span className="text-muted-foreground">{label}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                                disabled={loading}
                                className="bg-input border-primary/20 focus:border-accent pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                                disabled={loading}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading || !formData.username || !formData.email || !formData.password || !formData.confirmPassword}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <p className="text-muted-foreground">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary hover:underline font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
