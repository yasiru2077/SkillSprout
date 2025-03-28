import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={inputs.email}
          onChange={handleChange}
          required
          autoComplete="new-email"
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={inputs.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />

        <button type="submit">login</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default Login;
