import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "https://shuttlesmash.in";

const FailedWithRedirect = ({ navigate }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/events");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div>
      <FaTimesCircle style={{ fontSize: "70px", color: "#dc3545" }} />
      <h2 style={{ color: "#031B77", fontWeight: 700, marginTop: "20px" }}>
        Payment Failed
      </h2>
      <p style={{ color: "#555", marginTop: "12px", fontSize: "15px", lineHeight: 1.6 }}>
        Your payment could not be processed. Please try again or contact us for assistance.
      </p>
      <p style={{ color: "#666", fontSize: "13px", marginTop: "8px" }}>
        Contact: <a href="tel:+918861711005" style={{ color: "#3a6fd8" }}>+91 88617 11005</a>
      </p>
      <p style={{ color: "#888", fontSize: "13px", marginTop: "12px" }}>
        Redirecting to events page in <strong>{countdown}</strong> second{countdown !== 1 ? "s" : ""}...
      </p>
      <button
        onClick={() => navigate("/events")}
        style={{
          marginTop: "28px", padding: "12px 32px", borderRadius: "8px",
          border: "none", background: "#031B77", color: "#fff",
          fontWeight: 700, fontSize: "15px", cursor: "pointer"
        }}
      >
        Try Again
      </button>
    </div>
  );
};

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const transactionId = searchParams.get("transactionId");
  const userID = searchParams.get("userID");

  const [status, setStatus] = useState("checking"); // checking, success, failed
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    if (transactionId && userID) {
      checkPaymentStatus();
    } else {
      setStatus("success"); // If no transactionId, assume redirect means success
    }
  }, []);

  const checkPaymentStatus = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/phonepe/checkPayment/${transactionId}/${userID}`
      );
      const data = res.data?.success;
      setPaymentData(data);

      if (
        data?.status === "COMPLETED" ||
        data?.status === "SUCCESS" ||
        data?.paymentVerified
      ) {
        setStatus("success");
        // Update registration payment status
        try {
          await axios.put(`${API_URL}/api/user/paymentstatus`, {
            userId: userID,
          });
        } catch (e) {
          console.log("Payment status update skipped:", e.message);
        }
      } else if (data?.status === "FAILED" || data?.status === "DECLINED") {
        setStatus("failed");
      } else {
        // PENDING or other status — retry after delay
        setTimeout(checkPaymentStatus, 3000);
      }
    } catch (error) {
      console.error("Payment check failed:", error);
      setStatus("failed");
    }
  };

  return (
    <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <Container>
        <div style={{ maxWidth: "500px", margin: "0 auto", textAlign: "center" }}>

          {status === "checking" && (
            <div>
              <FaSpinner style={{ fontSize: "60px", color: "#031B77", animation: "spin 1s linear infinite" }} />
              <h2 style={{ color: "#031B77", fontWeight: 700, marginTop: "20px" }}>
                Verifying Payment...
              </h2>
              <p style={{ color: "#666", marginTop: "10px" }}>
                Please wait while we confirm your payment.
              </p>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {status === "success" && (
            <div style={{ textAlign: "left", background: "#fff", borderRadius: "12px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <FaCheckCircle style={{ fontSize: "64px", color: "#28a745" }} />
              </div>
              <h2 style={{ color: "#000", fontWeight: 800, fontSize: "22px", marginBottom: "18px" }}>
                Registration Confirmed!
              </h2>
              <p style={{ color: "#000", marginTop: "0", fontSize: "15px", lineHeight: 1.8 }}>
                Thank you for registering. Your payment has been received successfully.
              </p>
              <p style={{ color: "#000", marginTop: "14px", fontSize: "15px", lineHeight: 1.8 }}>
                Please join our <strong>WhatsApp group</strong> and follow{" "}
                <strong>Shuttle_Smash_Championship</strong> on Instagram for all tournament updates.
              </p>
              <p style={{ color: "#000", marginTop: "14px", fontSize: "15px", lineHeight: 1.8 }}>
                📞 <strong>Queries &amp; Support:</strong> Geetha –{" "}
                <strong>
                  <a href="tel:+918861711005" style={{ color: "#000", textDecoration: "none" }}>8861711005</a>
                </strong>
              </p>
              <p style={{ color: "#000", marginTop: "14px", fontSize: "15px", lineHeight: 1.8 }}>
                We look forward to welcoming you. Have a great day, and see you at the tournament!
              </p>
              <div style={{ textAlign: "center", marginTop: "28px" }}>
                <button
                  onClick={() => navigate("/events")}
                  style={{
                    padding: "12px 36px", borderRadius: "8px",
                    border: "none", background: "#031B77", color: "#fff",
                    fontWeight: 700, fontSize: "15px", cursor: "pointer"
                  }}
                >
                  Back to Events
                </button>
              </div>
            </div>
          )}

          {status === "failed" && (
            <FailedWithRedirect navigate={navigate} />
          )}

        </div>
      </Container>
    </div>
  );
};

export default PaymentSuccess;
