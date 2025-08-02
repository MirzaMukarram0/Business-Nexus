import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import "./DashboardLayout.css";

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const role = localStorage.getItem('role');

  // Utility function to determine user type from URL if role is not set
  const getUserTypeFromURL = () => {
    if (location.pathname.includes('/entrepreneur')) return 'entrepreneur';
    if (location.pathname.includes('/investor')) return 'investor';
    return null;
  };

  // Get the effective role (from localStorage or URL) - ensure lowercase
  const effectiveRole = (role || getUserTypeFromURL())?.toLowerCase();
  
  // Determine active tab based on URL parameters and pathname
  const getActiveTab = useCallback(() => {
    if (location.pathname.includes('/post-request')) return 'post-request';
    if (location.pathname.includes('/profile')) return 'profile';
    
    const tab = searchParams.get('tab');
    if (tab) return tab;
    
    // Default tabs based on role
    if (effectiveRole === 'entrepreneur') return 'requests';
    if (effectiveRole === 'investor') return 'entrepreneurs';
    
    return 'home';
  }, [location.pathname, searchParams, effectiveRole]);

  const [activeTab, setActiveTab] = useState(getActiveTab());

  // Update active tab when URL changes
  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location.pathname, searchParams, getActiveTab]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    
    if (effectiveRole === 'entrepreneur') {
      switch (tab) {
        case 'home':
          navigate('/dashboard/entrepreneur');
          break;
        case 'requests':
          navigate('/dashboard/entrepreneur?tab=requests');
          break;
        case 'posted':
          navigate('/dashboard/entrepreneur?tab=posted');
          break;
        case 'messages':
          navigate('/dashboard/entrepreneur?tab=messages');
          break;
        case 'post-request':
          navigate('/post-request');
          break;
        case 'profile':
          const userId = localStorage.getItem('userId');
          navigate(`/profile/entrepreneur/${userId}`);
          break;
        default:
          navigate('/dashboard/entrepreneur');
      }
    } else if (effectiveRole === 'investor') {
      switch (tab) {
        case 'home':
          navigate('/dashboard/investor');
          break;
        case 'entrepreneurs':
          navigate('/dashboard/investor?tab=entrepreneurs');
          break;
        case 'requests':
          navigate('/dashboard/investor?tab=requests');
          break;
        case 'messages':
          navigate('/dashboard/investor?tab=messages');
          break;
        case 'profile':
          const userId = localStorage.getItem('userId');
          navigate(`/profile/investor/${userId}`);
          break;
        default:
          navigate('/dashboard/investor');
      }
    }
  };

  // Determine which navbar to show based on URL pathname as fallback
  // This ensures navbar shows even if role is not properly set
  const shouldShowEntrepreneurNav = effectiveRole === 'entrepreneur' || location.pathname.includes('/entrepreneur');
  const shouldShowInvestorNav = effectiveRole === 'investor' || location.pathname.includes('/investor');

  // If neither role is detected, show entrepreneur nav as default for /dashboard/entrepreneur
  const showDefaultEntrepreneurNav = !shouldShowEntrepreneurNav && !shouldShowInvestorNav && location.pathname.includes('/dashboard/entrepreneur');
  const showDefaultInvestorNav = !shouldShowEntrepreneurNav && !shouldShowInvestorNav && location.pathname.includes('/dashboard/investor');

  return (
    <div className="bnx-dashboard-layout">
      <nav className="bnx-dashboard-navbar">
        <div className="bnx-navbar-brand">
          <button 
            className="bnx-navbar-link bnx-brand-link"
            onClick={() => handleTabClick('home')}
            style={{ fontSize: '1.5rem', fontWeight: '700', color: '#7f9cf5' }}
          >
            Business Nexus
          </button>
        </div>
        
        {(shouldShowEntrepreneurNav || showDefaultEntrepreneurNav) && (
          <div className="bnx-navbar-menu">
            <button 
              className={`bnx-navbar-link ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => handleTabClick('home')}
            >
              Home
            </button>
            <button 
              className={`bnx-navbar-link ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => handleTabClick('requests')}
            >
              Collaboration Requests
            </button>
            <button 
              className={`bnx-navbar-link ${activeTab === 'posted' ? 'active' : ''}`}
              onClick={() => handleTabClick('posted')}
            >
              My Posted Requests
            </button>
            <button 
              className={`bnx-navbar-link ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => handleTabClick('messages')}
            >
              Messages
            </button>
            <button 
              className={`bnx-navbar-link ${activeTab === 'post-request' ? 'active' : ''}`}
              onClick={() => handleTabClick('post-request')}
            >
              Post Request
            </button>
          </div>
        )}
        
        {(shouldShowInvestorNav || showDefaultInvestorNav) && (
          <div className="bnx-navbar-menu">
            <button 
              className={`bnx-navbar-link ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => handleTabClick('home')}
            >
              Home
            </button>
            <button 
              className={`bnx-navbar-link ${activeTab === 'entrepreneurs' ? 'active' : ''}`}
              onClick={() => handleTabClick('entrepreneurs')}
            >
              Entrepreneurs
            </button>
            <button 
              className={`bnx-navbar-link ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => handleTabClick('requests')}
            >
              Investment Requests
            </button>
            <button 
              className={`bnx-navbar-link ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => handleTabClick('messages')}
            >
              Messages
            </button>
          </div>
        )}
        
        <div className="bnx-navbar-profile">
          <button 
            className={`bnx-navbar-link ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => handleTabClick('profile')}
          >
            Profile
          </button>
        </div>
      </nav>
      <div className="bnx-dashboard-content">
        <main className="bnx-dashboard-main">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout; 