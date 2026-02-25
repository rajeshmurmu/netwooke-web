
import RegisterPage from '@/pages/auth/RegisterPage';
import VerifyOtpForm from './VerifyOtpForm';
import { useSearchParams } from 'react-router';
import RegisterForm from './RegisterForm';
import UsernameForm from './UsernameForm';

export default function AuthStep({ step }: { step: string }) {
    const [searchParams] = useSearchParams();


    switch (step) {
        case 'register':
            return <RegisterForm />;
        case 'verify-otp':
            return <VerifyOtpForm email={searchParams.get('email') || ''} />;
        case 'username':
            return <UsernameForm />;
        default:
            return <RegisterPage />;
    }
}
