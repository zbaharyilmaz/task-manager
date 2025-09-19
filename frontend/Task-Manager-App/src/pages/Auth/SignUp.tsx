import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuthStore } from "../../store/authStore";
import { registerSchema } from "../../schemas/validationSchemas";
import toast from "react-hot-toast";

const SignUp = () => {
  const navigate = useNavigate();
  const {
    register: registerUser,
    isAuthenticated,
    user,
    loading,
  } = useAuthStore();
  const [scrollY, setScrollY] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect based on role
      if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    // Initial smooth animation on page load
    const timer = setTimeout(() => {
      setScrollY(120); // More slide effect
      setTimeout(() => setScrollY(0), 4000); // Very slow return to original
    }, 800);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const onSubmit = async (data) => {
    const { confirmPassword, ...userData } = data;
    const result = await registerUser(userData);

    if (result.success) {
      toast.success("Registration successful! 🎉");
      // Navigation will be handled by useEffect
    } else {
      toast.error(result.error || "Registration failed! 😢");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Image/Pattern */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-500"
          style={{
            transform: `translateX(${scrollY * -0.5}px)`,
            filter: `hue-rotate(${scrollY * 0.2}deg) saturate(${
              1 + Math.sin(scrollY * 0.01) * 0.2
            })`,
            transition: "transform 1.5s ease-out, filter 1.5s ease-out",
          }}
        >
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
            <div className="text-6xl mb-6">🎯</div>
            <h1
              className="text-5xl font-black mb-4 tracking-tight"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              Join Us Today
            </h1>
            <p
              className="text-xl text-white/90 text-center font-light tracking-wide"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              Start your productivity journey with us
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h2
              className="text-4xl font-black text-gray-800 mb-2 tracking-tight"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              Create Account
            </h2>
            <p
              className="text-gray-600 font-medium tracking-wide"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              Sign up to get started
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-3"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-3"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-3"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Create a password"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-700 mb-3"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.01] shadow-lg"
            >
              {isSubmitting || loading
                ? "Creating account..."
                : "Create Account"}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-600 text-md">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-purple-500 hover:text-purple-400 transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
