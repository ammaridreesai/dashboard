"use client";

import { useState, useRef } from "react";

export default function OTPVerification({ email, onGoBack, onVerifySuccess }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const inputRefs = useRef([]);

  // Handle OTP input change
  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus the next empty input or last input
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  // Verify OTP
  const handleVerify = () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    // Simulate OTP verification (replace with actual API call)
    console.log("Verifying OTP:", otpCode);

    // For demo purposes, accept any 6-digit code
    if (otpCode.length === 6) {
      onVerifySuccess?.();
    } else {
      setError("Invalid OTP code. Please try again.");
    }
  };

  // Resend OTP
  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setTimeLeft(300);
    console.log("Resending OTP to:", email);
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Illustration */}
      <div
        className="hidden lg:flex lg:w-1/2 items-center justify-center"
        style={{ backgroundColor: "#31465B" }}
      >
        <div className="flex items-center justify-center">
          <img
            src="/assets/otp-left.svg"
            alt="OTP verification illustration"
            className="w-full max-w-md h-auto"
          />
        </div>
      </div>

      {/* Right Panel - OTP Form */}
      <div
        className="w-full lg:w-1/2 flex items-center justify-center p-8"
        style={{ backgroundColor: "#1E2532" }}
      >
        <div className="w-full max-w-md">
          {/* Go Back Button */}
          <button
            onClick={onGoBack}
            className="mb-6 flex items-center gap-2 text-white bg-[#2A3441] px-4 py-2 rounded-lg hover:bg-[#354051] transition-colors cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go Back
          </button>

          <h2 className="text-3xl font-bold text-white mb-2">Enter OTP</h2>
          <p className="text-gray-400 mb-8">
            We sent a code to{" "}
            <span className="text-white font-medium">{email}</span>
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Verification Code Label */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Verification Code
              </label>

              {/* OTP Input Boxes */}
              <div className="flex gap-4 justify-center mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-16 h-16 text-center text-2xl font-bold bg-[#2A3441] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ))}
              </div>

              {/* Timer */}
              <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-6">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Code expires in {formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              className="w-full bg-white text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              Verify Code
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>

            {/* Resend Code */}
            <div className="text-center">
              <span className="text-gray-400 text-sm">
                Did not receive code?{" "}
              </span>
              <button
                type="button"
                onClick={handleResend}
                className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer"
              >
                Resend
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
