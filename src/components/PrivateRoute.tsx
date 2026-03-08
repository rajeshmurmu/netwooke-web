import type { ReactNode } from "react";
import { Navigate } from "react-router";

// Import authentication context for retrieving user and token information
import useUserStore from "@/store/userStore";

export default function PrivateRoute({ children }: { children: ReactNode }) {
    // Destructure token and user details from the authentication context
    const { accessToken: token, user } = useUserStore();

    // If there's no token or user ID, redirect to the landing or login page
    if (!token || !user?._id) return <Navigate to="/" replace />;

    return children;
}
