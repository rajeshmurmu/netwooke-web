import AuthStep from "@/components/auth/AuthStep";
import { useSearchParams } from "react-router";

export default function RegisterPage() {
    const [searchParams] = useSearchParams();
    const step = searchParams.get('step') || 'register';

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-primary/5 px-4">
            <AuthStep step={step} />
        </div>
    )
}
