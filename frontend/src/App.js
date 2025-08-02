import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import InvestorDashboard from "./pages/InvestorDashboard";
import EntrepreneurDashboard from "./pages/EntrepreneurDashboard";
import InvestorProfile from "./pages/InvestorProfile";
import EntrepreneurProfile from "./pages/EntrepreneurProfile";
import Chat from "./pages/Chat";
import PostRequest from './pages/PostRequest';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/investor" element={<PrivateRoute><InvestorDashboard /></PrivateRoute>} />
        <Route path="/dashboard/entrepreneur" element={<PrivateRoute><EntrepreneurDashboard /></PrivateRoute>} />
        <Route path="/profile/investor/:id" element={<PrivateRoute><InvestorProfile /></PrivateRoute>} />
        <Route path="/profile/entrepreneur/:id" element={<PrivateRoute><EntrepreneurProfile /></PrivateRoute>} />
        <Route path="/chat/:userId" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="/post-request" element={<PrivateRoute><PostRequest /></PrivateRoute>} />
        {/* Add Post Request and Request Details routes here later */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
