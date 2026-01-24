/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
const AuthForm = () => {
  // const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignUpSuccess, setSignUpSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode"); // 'signin' or 'signup'
  const [isSignUp, setIsSignUp] = useState(mode !== "signin");
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  useEffect(() => {
    setIsSignUp(mode !== "signin");
  }, [mode]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    try {
      if (isSignUp) {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to sign up");
        await signIn("credentials", {
          email,
          password,
          callbackUrl: "/", // redirect after login
        });
        // auto-login
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
          callbackUrl: "/",
        });
        if (result?.error) throw new Error(result.error);
        setSignUpSuccess(true);
      } else {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
          callbackUrl: "/",
        });
        if (result?.error) {
          setError("Invalid credentials");
        } else {
          // window.location.href = "/";
          window.location.href = callbackUrl;
        }
      }
    } catch (err: any) {
      setError(err?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-[#00b894]">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h2>
        {isSignUpSuccess ? (
          <p className="text-green-600 text-center mb-4">
            ✅ Account created successfully!
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b894] text-gray-600 placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b894] text-gray-600 placeholder-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {isSignUp && (
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b894] text-gray-600 placeholder-gray-400"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-[#00b894] text-white py-2 rounded-lg hover:bg-[#019a7a] transition hover:cursor-pointer flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : isSignUp ? (
                "Sign Up"
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        )}
        <div className="flex items-center gap-3">
          <hr className="flex-1 border-gray-300" />
          <span className="text-gray-500 text-sm">or continue with</span>
          <hr className="flex-1 border-gray-300" />
        </div>
        <div className="flex flex-col gap-4 justify-center">
          <div className="flex gap-4">
            <button
              className="border px-12 py-2 rounded-lg flex items-center gap-2 hover:border-[#00b894] hover:cursor-pointer hover:border-2"
              onClick={() => signIn("google", { callbackUrl: "/" })}
            >
              <FcGoogle className="text-xl" />
              Google
            </button>
            <button
              className="border px-12 py-2 rounded-lg flex items-center gap-2 hover:border-[#00b894] hover:cursor-pointer hover:border-2 "
              onClick={() => signIn("apple", { callbackUrl: "/" })}
            >
              <FaApple className="text-xl" />
              Apple
            </button>
          </div>
          <div className="ml-24">
            <button
              className="border px-12 py-2 rounded-lg flex items-center gap-2 hover:border-[#00b894] hover:cursor-pointer hover:border-2 item-"
              onClick={() => signIn("github", { callbackUrl: "/" })}
            >
              <FaGithub className="text-xl" />
              GitHub
            </button>
          </div>
        </div>
        <p className="text-center text-sm text-gray-600">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setSignUpSuccess(false);
              setError("");
            }}
            className="text-[#00b894] font-medium hover:underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </section>
  );
};
export default AuthForm;
