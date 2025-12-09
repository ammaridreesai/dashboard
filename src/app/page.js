'use client';

import { useState } from 'react';
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import Users from "@/components/Users";
import Subscriptions from "@/components/Subscriptions";
import Notifications from "@/components/Notifications";
import PromoCode from "@/components/PromoCode";
import LoginForm from "@/components/LoginForm";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

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
