import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../auth.css";
import { User, Mail, Lock, Upload, LogIn, UserPlus } from "lucide-react";

function Login({ setIsAuthenticated, setUserDetails }) {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        inputs,
        {
          withCredentials: true,
        }
      );

      const userData = response.data;
      console.log("hey:", userData.user);

      setUserDetails({
        id: userData.user._id,
        username: userData.user.username,
        email: userData.user.email,
        profilePic: userData.user.profilePic,
      });
      setIsAuthenticated(true);
      console.log("deatils:", userData);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userDetails", JSON.stringify(userData));
      navigate("/");
    } catch (error) {
      setError(error.response.data || "An error occurred");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h1 className="auth-title">Login</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              id="email"
              placeholder="Email"
              name="email"
              value={inputs.email}
              onChange={handleChange}
              required
              autoComplete="new-email"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              id="password"
              placeholder="Password"
              name="password"
              value={inputs.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
              className="form-input"
            />
          </div>

          <button type="submit" className="auth-button">
            Login
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
        <h3>
          Don't have an account? <Link to={`/register`}>Sign Up</Link>
        </h3>
      </div>
    </div>
  );
}

export default Login;
