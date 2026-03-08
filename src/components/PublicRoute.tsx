// Import necessary libraries and types
import type { ReactNode } from "react";
import { Navigate } from "react-router";
import useUserStore from "@/store/userStore";



export default function PublicRoute({ children }: { children: ReactNode }) {
    // Destructure token and user details from the authentication context
    const { accessToken: token, user } = useUserStore();

    // If there's a token or user ID, redirect to the chat page
    if (token || user?._id) return <Navigate to="/feed" replace />;

    // If no token or user ID exists, render the child components as they are
    return children;
}
