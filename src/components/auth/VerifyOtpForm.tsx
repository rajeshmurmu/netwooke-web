import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { useNavigate } from 'react-router';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Clock } from 'lucide-react';

interface VerifyOtpFormProps {
    email: string
}

export default function VerifyOtpForm({ email }: VerifyOtpFormProps) {
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [canResend, setCanResend] = useState(false);

    const verifyOtp = (otp: string) => {
        console.log(otp)
    }
    const resendOtp = () => { }

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [timeLeft]);

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setOtp(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (otp.length !== 6) {
            setError('Please enter a 6-digit OTP');
            setLoading(false);
            return;
        }

        try {
            verifyOtp(otp);
            navigate('/register?step=username&email=' + email);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'OTP verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError('');
        try {
            await resendOtp();
            setTimeLeft(60);
            setCanResend(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to resend OTP');
        }
    };
    return (
        <Card className="w-full max-w-md border-primary/10 shadow-lg">
            <CardHeader className="space-y-2 text-center">
                <CardTitle className="text-3xl font-bold">Verify Your Account</CardTitle>
                <CardDescription>
                    We've sent a 6-digit code to {email}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <label htmlFor="otp" className="text-sm font-medium text-foreground">
                            Enter OTP Code
                        </label>
                        <div className="space-y-2">
                            <Input
                                id="otp"
                                type="text"
                                inputMode="numeric"
                                placeholder="000000"
                                value={otp}
                                onChange={handleOtpChange}
                                maxLength={6}
                                disabled={loading}
                                className="text-center text-2xl tracking-widest bg-input border-primary/20 focus:border-accent font-mono"
                            />
                            <p className="text-xs text-muted-foreground text-center">
                                Enter the 6-digit code sent to your email
                            </p>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                    >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </Button>
                </form>

                <div className="mt-6 space-y-3">
                    <div className="text-center text-sm">
                        <p className="text-muted-foreground">
                            Didn't receive the code?
                        </p>
                        {timeLeft > 0 ? (
                            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-2">
                                <Clock size={14} />
                                Resend available in {timeLeft}s
                            </div>
                        ) : (
                            <Button
                                type="button"
                                variant="default"
                                onClick={handleResend}
                                disabled={!canResend}
                                className="hover:text-accent/90 font-medium py-1.5 cursor-pointer text-white h-auto"
                            >
                                Resend OTP
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
