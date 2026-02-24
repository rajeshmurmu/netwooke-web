import RegisterForm from "@/components/auth/RegisterForm";
import VerifyOtpForm from "@/components/auth/VerifyOtpForm";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
    const { register, step, setStep, pendingEmail } = useAuth();

    const handleUserRegister = (data: { username: string; email: string; password: string }) => {
        console.log(data);
        register(data);
        setStep("otp");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-primary/5 px-4">
            {
                step === "register" ? (
                    <RegisterForm register={handleUserRegister} nextStep={() => setStep("otp")} />
                ) : (
                    <VerifyOtpForm email={pendingEmail || ""} />
                )
            }
        </div>
    )
}
