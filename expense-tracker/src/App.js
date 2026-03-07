import { Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import { AuthProvider, useAuth } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Use authenticated state to determine which page to show */}
        <Route
          path="/"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/login"  replace/>}
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;