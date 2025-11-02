import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import ErrorCard from "@/components/ErrorCard";

const ResetPasswordRoute = ({ children }) => {
    const [isValidToken, setIsValidToken] = useState(false);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const validateResetToken = async () => {
            try {
                // Get the access token from the URL
                const hash = location.hash;
                if (!hash) {
                    setErrorMessage("No token found in the URL. Please request a new reset link.");
                    setLoading(false);
                    return;
                }

                const accessToken = new URLSearchParams(hash.substring(1)).get("access_token");
                if (!accessToken) {
                    setErrorMessage("Missing access token. Please try again.");
                    setLoading(false);
                    return;
                }

                // Verify the access token
                const { data, error } = await supabase.auth.getUser(accessToken);
                if (error) {
                    console.error("Error validating reset token:", error);
                    setErrorMessage("Your password reset link has expired or is invalid. Please request a new one.");
                    setLoading(false);
                    return;
                }

                setIsValidToken(true);
                setLoading(false);
            } catch (error) {
                console.error("Error in reset token validation:", error);
                setErrorMessage("An unexpected error occurred while validating your link.");
                setLoading(false);
            }
        };

        validateResetToken();
    }, [location]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Validating reset token...</div>;
    }

    if (!isValidToken) {
        return (
        <ErrorCard
            title="Invalid or Expired Token"
            message={errorMessage}
            buttonText="Back to Login"
        />
        );
    }

    return children;
    //return isValidToken ? children : <Navigate to="/login" replace />;
};

export default ResetPasswordRoute;