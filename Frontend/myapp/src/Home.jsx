import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './App.css';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigateToBuyStocks = () => {
    navigate('/buy-stocks');
  };

  return (
    <div className="home-container">
      <header className="dashboard-header">
        <h1>Welcome to Your Dashboard</h1>
        <div className="user-info">
          <span>Hello, {user?.name || user?.email || 'User'}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      
      <p>You have successfully logged in!</p>
      
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h3>Buy Stocks</h3>
          <p>Invest in new assets </p>
          <button className="dashboard-btn" onClick={navigateToBuyStocks}>Buy/Sell</button>
        </div>
        <div className="dashboard-card">
          <h3>View Portfolio</h3>
          <p>Check owned stocks, bonds, and insurance</p>
          <button className="dashboard-btn">View Portfolio</button>
        </div>
        <div className="dashboard-card">
          <h3>Sell Investments</h3>
          <p>Liquidate existing ones</p>
          <button className="dashboard-btn">Buy/Sell</button>
        </div>
      </div>
    </div>
  );
};

export default Home; 