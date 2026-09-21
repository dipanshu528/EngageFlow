
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../api/authApi";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "TEAM_MEMBER",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ========================================
  // HANDLE INPUT CHANGE
  // ========================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };


  // ========================================
  // HANDLE REGISTER
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.role
    ) {
      setError(
        "Please fill in all fields"
      );

      return;
    }

    try {
      setLoading(true);

      const response =
        await registerUser(
          formData.name,
          formData.email,
          formData.password,
          formData.role
        );

      console.log(
        "REGISTER RESPONSE:",
        response
      );

      setSuccess(
        "Registration successful. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Registration failed"
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* ========================================
            HEADING
        ======================================== */}

        <div className="text-center mb-8">

          <h1 className="text-2xl font-bold text-slate-800">
            Create Account
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Register a new account
          </p>

        </div>


        {/* ========================================
            ERROR
        ======================================== */}

        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}


        {/* ========================================
            SUCCESS
        ======================================== */}

        {success && (
          <div className="mb-5 bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg">
            {success}
          </div>
        )}


        {/* ========================================
            FORM
        ======================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* NAME */}

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent"
            />

          </div>


          {/* EMAIL */}

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent"
            />

          </div>


          {/* PASSWORD */}

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent"
            />

          </div>


          {/* ROLE */}

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Role
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent bg-white"
            >

              <option value="TEAM_MEMBER">
                Team Member
              </option>

              <option value="MANAGER">
                Manager
              </option>

              <option value="ADMIN">
                Administrator
              </option>

            </select>

          </div>


          {/* REGISTER BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 text-white py-3 rounded-lg font-medium hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Creating Account..."
              : "Register"}
          </button>

        </form>


        {/* ========================================
            LOGIN LINK
        ======================================== */}

        <div className="text-center mt-6">

          <p className="text-sm text-slate-500">

            Already have an account?{" "}

            <Link
              to="/login"
              className="font-medium text-slate-800 hover:text-slate-600 hover:underline"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Register;

