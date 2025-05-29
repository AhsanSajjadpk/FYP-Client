// PaymentSuccess.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = ({ setCheckPayment }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Store payment confirmation in localStorage or use Context
    localStorage.setItem("paymentSuccess", "true");

    // Optionally redirect to checkout with state
    navigate("/checkout");
  }, []);

  return (
   <div className="flex items-center justify-center h-screen bg-gray-100">
  <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
    <i className="text-green-600 text-5xl mb-4">✔️</i>
    <h2 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h2>
    <p className="text-gray-700">Thank you for your order.</p>
  </div>
</div>

  );
};

export default PaymentSuccess;
