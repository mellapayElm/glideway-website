"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedProps {
  children: React.ReactNode;
  role?: "DRIVER" | "RIDER" | "ADMIN";
}

export default function Protected({ children, role }: ProtectedProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      try {
        // Check for auth token in localStorage or cookies
        const token = localStorage.getItem("glideway_auth_token");
        const userRole = localStorage.getItem("glideway_user_role");

        if (!token) {
          // For now, allow access for demo purposes
          // In production, redirect to login
          setIsAuthorized(true);
          setIsLoading(false);
          return;
        }

        // Check role if specified
        if (role && userRole !== role) {
          // Role mismatch - redirect to appropriate login
          if (role === "DRIVER") {
            router.push("/driver/register");
          } else if (role === "RIDER") {
            router.push("/app/login");
          } else if (role === "ADMIN") {
            router.push("/admin/login");
          }
          return;
        }

        setIsAuthorized(true);
        setIsLoading(false);
      } catch {
        // On error, still allow for demo
        setIsAuthorized(true);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [role, router]);

  if (isLoading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0fdf4",
      }}>
        <div style={{
          textAlign: "center",
          padding: "40px",
        }}>
          <div style={{
            width: "60px",
            height: "60px",
            border: "4px solid #22c55e",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px",
          }} />
          <p style={{ color: "#166534", fontWeight: "600" }}>
            Verifying access...
          </p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
