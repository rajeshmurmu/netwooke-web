import AuthStep from "@/components/auth/AuthStep";
import useUserStore from "@/store/userStore";
import { useNavigate, useSearchParams } from "react-router";

export default function RegisterPage() {
    const navigate = useNavigate();
    const { user, accessToken } = useUserStore(state => state);
    if (accessToken && user?._id) {
        navigate('/', { replace: true });
    }
    const [searchParams] = useSearchParams();
    const step = searchParams.get('step') || 'register';

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-primary/5 px-4">
            <AuthStep step={step} />
        </div>
    )
}
