import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/lib/zod/authSchema";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import useUserStore from "@/store/userStore";
import { authClient } from "@/services/authClient";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { isBrowser } from "@/utils";

export default function LoginPage() {
    const navigate = useNavigate()
    const { login, accessToken, user } = useUserStore(state => state);

    if (accessToken && user?._id) {
        navigate('/');
    }

    const { handleSubmit, control, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit: SubmitHandler<{ email: string; password: string }> = async (inputData) => {
        try {
            setError('');
            setLoading(true);

            const res = await authClient.login(inputData);
            const data = res?.data !== undefined ? res?.data : res;
            if (data?.success) {
                toast.success(data?.message || "User logged in successfully");
                login(data?.data?.user, data?.data?.accessToken);
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                if (err?.response)
                    if ([401, 403].includes(err?.response.status)) {
                        // Handle error cases, including unauthorized and forbidden cases
                        localStorage.clear(); // Clear local storage on authentication issues
                        if (isBrowser) navigate('/login', { replace: true }) // Redirect to login page
                    }

                toast.error(err?.response?.data?.message || "Something went wrong");
            }
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-primary/5 px-4">
            <Card className="w-full max-w-md border-primary/10 shadow-lg">
                <CardHeader className="space-y-2 text-center">
                    <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
                    <CardDescription>Sign in to your account to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <div className="space-y-2">
                                        <label htmlFor="username" className="text-sm font-medium text-foreground">
                                            Email
                                        </label>
                                        <Input
                                            id="username"
                                            type="text"
                                            placeholder="Enter your email"
                                            {...field}
                                            disabled={loading}
                                            className="bg-input border-primary/20 focus:border-accent"
                                        />
                                    </div>
                                )}
                            />
                            {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
                        </div>

                        <div>
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <div className="space-y-2">
                                        <label htmlFor="password" className="text-sm font-medium text-foreground">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Enter your password"
                                                {...field}
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
                                    </div>
                                )} />

                            {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <p className="text-muted-foreground">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary hover:underline font-medium">
                                Create one
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
