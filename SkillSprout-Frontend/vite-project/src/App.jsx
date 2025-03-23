import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import BlogHomePage from "./pages/blog-Home/blog-Home";
import Layout from "./component/layout.jsx";
import Login from "./pages/login/login.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<BlogHomePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
