'use client';

import { useState, useEffect } from 'react';
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import Users from "@/components/Users";
import Subscriptions from "@/components/Subscriptions";
import Notifications from "@/components/Notifications";
import PromoCode from "@/components/PromoCode";
import LoginForm from "@/components/LoginForm";
import { authService } from "@/services/auth";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      const userData = authService.getUser();

      setIsAuthenticated(isAuth);
      setUser(userData);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setActiveView('dashboard');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#1E2532" }}>
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <Users />;
      case 'subscriptions':
        return <Subscriptions />;
      case 'notifications':
        return <Notifications />;
      case 'promocode':
        return <PromoCode />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <Sidebar onLogout={handleLogout} activeView={activeView} setActiveView={setActiveView} />
      {renderView()}
    </>
  );
}
