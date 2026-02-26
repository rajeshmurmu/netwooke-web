import { useNavigate, useSearchParams } from "react-router";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { User } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { authClient } from "@/services/authClient";
import toast from "react-hot-toast";

export default function UsernameForm() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await authClient.setUsername({ username, email: searchParams.get('email') || '' });
            const data = res?.data !== undefined ? res?.data : res;
            if (data?.success) {
                toast.success(data?.message || "Username set successfully");
                // TODO: here we can login user automatically after username set or we can redirect if next step is exist or we can redirect to home page
                navigate('/register?step=username&email-verified=true&email=' + searchParams.get('email'), { replace: true });
            }
            navigate('/login');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to set username');
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = username.trim().length > 0

    return (

        <Card className="w-full max-w-md border-primary/10 shadow-lg">
            <CardHeader className="space-y-2">
                <div className="flex justify-center mb-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                        <User className="w-6 h-6 text-primary" />
                    </div>
                </div>
                <CardTitle className="text-2xl text-center">Complete Your Profile</CardTitle>
                <CardDescription className="text-center">
                    <p>Set your username and display name to get started</p>
                    <p>By default we will assign you a random username</p>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="username" className="text-sm font-medium text-foreground">
                            Username
                        </label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={loading}
                            className="bg-input border-border"
                        />
                        <div>
                            <p className="text-xs text-muted-foreground">Your username is unique and cannot be changed</p>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    )}
                </form>
            </CardContent>
            <CardFooter>
                <div className="w-full flex justify-between">
                    <Button
                        // TODO: here we can to next step or we can redirect to home page if next step is not exist or user is already logged in
                        onClick={() => navigate("/login")}
                        className="cursor-pointer"
                    >
                        skip
                    </Button>

                    <Button
                        type="submit"
                        disabled={loading || !isFormValid}
                        onClick={handleSubmit}
                        className="cursor-pointer"
                    >
                        {loading ? 'Setting up...' : 'Submit'}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
