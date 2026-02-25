import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { User } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";

export default function UsernameForm() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const completeUsernameSetup = async (username: string, displayName: string) => {
        await fetch('/api/auth/username', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, displayName }),
        });
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await completeUsernameSetup(username, displayName);
            navigate('/login');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to set username');
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = username.trim().length > 0 && displayName.trim().length > 0;

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
                    Set your username and display name to get started
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        <p className="text-xs text-muted-foreground">
                            Your unique identifier on Network Tube
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="displayName" className="text-sm font-medium text-foreground">
                            Display Name
                        </label>
                        <Input
                            id="displayName"
                            type="text"
                            placeholder="Your display name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            disabled={loading}
                            className="bg-input border-border"
                        />
                        <p className="text-xs text-muted-foreground">
                            How your name appears to others
                        </p>
                    </div>

                    {error && (
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading || !isFormValid}
                        className="w-full"
                    >
                        {loading ? 'Setting up...' : 'Continue to Network Tube'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
