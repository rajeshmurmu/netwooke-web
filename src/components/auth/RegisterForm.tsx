import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Check, Eye, EyeOff, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from '@/lib/zod/authSchema'
import type { PasswordRequirements } from '@/interfaces/auth'
import { authClient } from '@/services/authService'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'
import { isBrowser } from '@/utils'

export default function RegisterForm() {
    const navigate = useNavigate();

    const { handleSubmit, watch, control, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
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

    const password = watch("password");

    useEffect(() => {
        validatePassword(password);
    }, [password]);

    const onSubmit: SubmitHandler<RegisterInput> = async (inputData) => {
        try {
            setError('');
            setLoading(true);

            if (inputData.password !== inputData.confirmPassword) {
                setError('Passwords do not match');
                return;
            }

            if (!Object.values(passwordReqs).every(Boolean)) {
                setError('Password does not meet requirements');
                return;
            }


            const res = await authClient.register(inputData);
            const data = res?.data !== undefined ? res?.data : res;
            if (data?.success) {
                toast.success(data?.message || "OTP sent to your email");
                navigate("/register?step=verify-otp&email=" + inputData.email);
            }

        } catch (err) {
            if (err instanceof AxiosError) {
                if (err?.response)
                    if ([401, 403].includes(err?.response.status)) {
                        // Handle error cases, including unauthorized and forbidden cases
                        localStorage.clear(); // Clear local storage on authentication issues
                        if (isBrowser) window.location.href = "/login"; // Redirect to login page
                    }

                if (err?.response?.status === 409) {
                    toast.error(err?.response?.data?.message || "Email already exists, Please login");
                    setTimeout(() => {
                        if (isBrowser) navigate("/login");
                    }, 2000);
                    return
                }
                toast.error(err?.response?.data?.message || "Something went wrong");
            }
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const passwordStrength = Object.values(passwordReqs).filter(Boolean).length;
    return (
        <Card className="w-full max-w-md border-primary/10 shadow-lg">
            <CardHeader className="space-y-2 text-center">
                <CardTitle className="text-3xl font-bold">Join Netwooke</CardTitle>
                <CardDescription>Create an account to get started</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <Controller name='name' control={control} render={({ field }) => (
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-foreground">
                                    Name
                                </label>
                                <Input
                                    id='name'
                                    {...field}
                                    placeholder='Enter your full name'
                                    className="bg-input border-primary/20 focus:border-accent"

                                />
                            </div>
                        )} />
                        {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
                    </div>

                    <div>
                        <Controller name='email' control={control} render={({ field }) => (
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-foreground">
                                    Email
                                </label>
                                <Input
                                    id='email'
                                    {...field}
                                    placeholder='Enter your email'
                                    className="bg-input border-primary/20 focus:border-accent"

                                />
                            </div>
                        )} />
                        {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
                    </div>


                    <div>
                        <Controller name='password' control={control} render={({ field }) => (
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-foreground">
                                    Password
                                </label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Create a strong password"
                                        {...field}
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
                            </div>
                        )}
                        />

                        {password && (
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

                        {errors.password && <span className="text-destructive text-xs">{errors.password.message}</span>}

                    </div>

                    <div>
                        <Controller name='confirmPassword' control={control} render={({ field }) => (
                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirm your password"
                                        {...field}
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
                        )} />

                        {errors.confirmPassword && <span className="text-destructive text-xs">{errors.confirmPassword.message}</span>}
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
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
