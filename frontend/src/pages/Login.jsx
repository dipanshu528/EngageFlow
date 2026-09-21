
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/login",
        formData
      );

      console.log(
        "LOGIN RESPONSE:",
        response.data
      );

      // Save token
      localStorage.setItem(
        "token",
        response.data.token
      );

      // Save user information
      if (response.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );
      }

      // Go to dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Login failed. Please check your email and password."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* Heading */}
        <div className="text-center mb-8">

          <h1 className="text-2xl font-bold text-slate-800">
            Welcome Back
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Login to your account
          </p>

        </div>


        {/* Error */}
        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}


        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Email */}
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


          {/* Password */}
          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent"
            />

          </div>


          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 text-white py-3 rounded-lg font-medium hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>


        {/* Register Link */}
        <div className="text-center mt-6">

          <p className="text-sm text-slate-500">
            Don't have an account?{" "}

            <Link
              to="/register"
              className="font-medium text-slate-800 hover:text-slate-600 hover:underline"
            >
              Register
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;





// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { loginUser } from "../api/authApi";

// const Login = () => {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setError("");
//     setLoading(true);

//     try {
//       const data = await loginUser(email, password);

//       console.log("Login response:", data);

//       // Save JWT token
//       localStorage.setItem("token", data.token);

//       // Save user information if backend sends it
//       if (data.user) {
//         localStorage.setItem(
//           "user",
//           JSON.stringify(data.user)
//         );
//       }

//       // Go to dashboard
//       navigate("/dashboard");

//     } catch (error) {

//       console.error(error);

//       setError(
//         error.response?.data?.message ||
//         "Login failed. Please check your credentials."
//       );

//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

//       <div className="w-full max-w-md">

//         {/* Logo */}

//         <div className="text-center mb-8">

//           <h1 className="text-3xl font-bold text-slate-900">
//             EngageFlow
//           </h1>

//           <p className="text-slate-500 mt-2">
//             Task & Engagement Management
//           </p>

//         </div>


//         {/* Login Card */}

//         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">

//           <h2 className="text-2xl font-semibold text-slate-900">
//             Welcome back
//           </h2>

//           <p className="text-slate-500 mt-1 mb-6">
//             Sign in to your account
//           </p>


//           {/* Error */}

//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-5 text-sm">
//               {error}
//             </div>
//           )}


//           <form
//             onSubmit={handleSubmit}
//             className="space-y-5"
//           >

//             {/* Email */}

//             <div>

//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Email
//               </label>

//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter your email"
//                 required
//                 className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400"
//               />

//             </div>


//             {/* Password */}

//             <div>

//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Password
//               </label>

//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter your password"
//                 required
//                 className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400"
//               />

//             </div>


//             {/* Login button */}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50"
//             >

//               {loading ? "Signing in..." : "Sign In"}

//             </button>

//           </form>


//           {/* Demo credentials */}

//           <div className="mt-6 p-4 bg-slate-50 rounded-lg">

//             <p className="text-xs font-medium text-slate-600 mb-2">
//               Demo Admin Account
//             </p>

//             <p className="text-xs text-slate-500">
//               admin@example.com
//             </p>

//             <p className="text-xs text-slate-500">
//               password123
//             </p>

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// };

// export default Login;