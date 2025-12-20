"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import OTPVerification from "./OTPVerification";

export default function ForgotPasswordForm({ onGoBack }) {
  const [resetSent, setResetSent] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // Simulate sending reset code
    console.log("Sending reset code to:", data.email);
    setUserEmail(data.email);
    setResetSent(true);

    // Show OTP screen after a short delay
    setTimeout(() => {
      setShowOTP(true);
    }, 1500);
  };

  // If OTP verification is shown
  if (showOTP) {
    return (
      <OTPVerification
        email={userEmail}
        onGoBack={() => setShowOTP(false)}
        onVerifySuccess={() => {
          // Handle successful OTP verification
          console.log("OTP verified successfully");
          // You can redirect to a password reset page or show success message
        }}
      />
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Illustration */}
      <div
        className="hidden lg:flex lg:w-1/2 items-center justify-center"
        style={{ backgroundColor: "#31465B" }}
      >
        <div className="flex items-center justify-center">
          <img
            src="/assets/reset-password-left.svg"
            alt="Reset password illustration"
            className="w-full max-w-md h-auto"
          />
        </div>
      </div>

      {/* Right Panel - Forgot Password Form */}
      <div
        className="w-full lg:w-1/2 flex items-center justify-center p-8"
        style={{ backgroundColor: "#1E2532" }}
      >
        <div className="w-full max-w-md">
          {/* Go Back Button */}
          <button
            onClick={onGoBack}
            className="mb-6 flex items-center gap-2 text-white bg-[#2A3441] px-4 py-2 rounded-lg text-sm hover:bg-[#354051] transition-colors cursor-pointer"
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

          <h2 className="text-3xl font-bold text-white mb-2">
            Forgot Password?
          </h2>
          <p className="text-gray-400 mb-8">
            No worries! We'll send you reset instructions.
          </p>

          {resetSent && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500 rounded-lg">
              <p className="text-green-400 text-sm">
                Reset code sent! Check your email for instructions.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full pl-10 pr-4 py-3 bg-[#2A3441] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Send Reset Code Button */}
            <button
              type="submit"
              className="w-full bg-white text-gray-900 py-3 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              Send Reset Code
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

            {/* Remember password link */}
            <div className="text-center">
              <span className="text-gray-400 text-sm">
                Remember your password?{" "}
              </span>
              <button
                type="button"
                onClick={onGoBack}
                className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
