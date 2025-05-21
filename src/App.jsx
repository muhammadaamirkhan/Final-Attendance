import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Pages/Home";
import Students from "./components/Pages/Students";
import Faculty from "./components/Pages/Faculty";
import MarAttendence from "./components/Pages/MarAttendence";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={
          <Home />
      } />
      <Route path="/students" element={
        <ProtectedRoute>
          <Students />
        </ProtectedRoute>
      } />
      <Route path="/faculty" element={
        <ProtectedRoute>
          <Faculty />
        </ProtectedRoute>
      } />
      <Route path="/mark" element={
        <ProtectedRoute>
          <MarAttendence />
        </ProtectedRoute>
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
