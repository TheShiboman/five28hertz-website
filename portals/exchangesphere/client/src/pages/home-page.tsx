import { useEffect } from "react";
import { useLocation } from "wouter";

export default function HomePage() {
  const [location, navigate] = useLocation();

  useEffect(() => {
    // Redirect to dashboard
    navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Redirecting to dashboard...</p>
    </div>
  );
}
