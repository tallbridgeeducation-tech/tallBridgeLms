import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; 
import { db } from "../lib/supabase"; 

export default function VerifyGateway() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Securing connection...");
  
  const token = searchParams.get("token");

  useEffect(() => {
    async function validateGatewayToken() {
      if (!token) {
        window.location.href = "https://tallbridgeinstitute.com/auth";
        return;
      }

      const { data: payment, error } = await db
        .from("payments")
        .select("id, user_id, course_id")
        .eq("access_token", token)
        .maybeSingle();

      if (error || !payment) {
        setStatus("❌ Invalid or expired token. Redirecting to checkout...");
        setTimeout(() => {
          window.location.href = "https://tallbridgeinstitute.com/payment?course=esl";
        }, 2000);
        return;
      }

      await db
        .from("payments")
        .update({ access_token: null })
        .eq("id", payment.id);

      localStorage.setItem("lms_access_granted", "true");
      localStorage.setItem("lms_user_id", payment.user_id);
      localStorage.setItem("lms_active_course", payment.course_id);

      setStatus("🔒 Access verified. Opening your classroom workspace...");
      
      setTimeout(() => {
        navigate("/");
      }, 1200);
    }

    validateGatewayToken();
  }, [token, navigate]);

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "100vh", 
      backgroundColor: "#fafafa", 
      fontFamily: "system-ui, sans-serif" 
    }}>
      <div className="gateway-loader" style={{
        border: "3px solid #e2e8f0",
        borderTop: "3px solid #6667AB",
        borderRadius: "50%",
        width: "36px",
        height: "36px",
        animation: "spin 0.8s linear infinite"
      }}></div>
      <p style={{ marginTop: "1.5rem", color: "#421869", fontWeight: 500, fontSize: "0.95rem" }}>
        {status}
      </p>
    </div>
  );
}