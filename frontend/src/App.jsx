import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import useCurrentUser from "./hooks/useCurrentUser";

// Pages
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home"; // AI Chat Workspace with ArtifactPanel
import DashboardPage from "./pages/DashboardPage";
import AgentDirectory from "./pages/AgentDirectory";
import KnowledgeBase from "./pages/KnowledgeBase";
import ArtifactStudio from "./pages/ArtifactStudio";
import AnalyticsPage from "./pages/AnalyticsPage";
import BillingPortal from "./pages/BillingPortal";
import SettingsPage from "./pages/SettingsPage";
import AdminConsole from "./pages/AdminConsole";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

function App() {
  useCurrentUser();

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* AI Chat Workspace */}
        <Route path="/chat" element={<Home />} />
        <Route path="/app" element={<Navigate to="/chat" replace />} />

        {/* SaaS Dashboard & Workspaces */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/agents" element={<AgentDirectory />} />
        <Route path="/knowledge" element={<KnowledgeBase />} />
        <Route path="/artifacts" element={<ArtifactStudio />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/billing" element={<BillingPortal />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/admin" element={<AdminConsole />} />

        {/* Auth Pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
