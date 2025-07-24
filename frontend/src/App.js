import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import InvestorDashboard from "./pages/InvestorDashboard";
import EntrepreneurDashboard from "./pages/EntrepreneurDashboard";
import InvestorProfile from "./pages/InvestorProfile";
import EntrepreneurProfile from "./pages/EntrepreneurProfile";
import Chat from "./pages/Chat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/investor" element={<InvestorDashboard />} />
        <Route path="/dashboard/entrepreneur" element={<EntrepreneurDashboard />} />
        <Route path="/profile/investor/:id" element={<InvestorProfile />} />
        <Route path="/profile/entrepreneur/:id" element={<EntrepreneurProfile />} />
        <Route path="/chat/:userId" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
