import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    const storedPortfolio = localStorage.getItem('portfolio');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    
    if (storedPortfolio) {
      setPortfolio(JSON.parse(storedPortfolio));
    }
    
    setLoading(false);
  }, []);

  const login = (userData) => {
    // Add default credits if not provided
    const userWithCredits = {
      ...userData,
      credits: userData.credits || 10000
    };
    
    setUser(userWithCredits);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userWithCredits));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const updateUserCredits = (newCredits) => {
    if (user) {
      const updatedUser = {
        ...user,
        credits: newCredits
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const addStockToPortfolio = (stock, quantity, price) => {
    const purchaseDate = new Date().toISOString();
    const purchaseId = Date.now().toString();
    
    const newPurchase = {
      id: purchaseId,
      stockId: stock.id,
      symbol: stock.symbol,
      name: stock.name,
      quantity,
      purchasePrice: price,
      currentPrice: stock.price,
      purchaseDate,
      type: 'buy'
    };
    
    const updatedPortfolio = [...portfolio, newPurchase];
    setPortfolio(updatedPortfolio);
    localStorage.setItem('portfolio', JSON.stringify(updatedPortfolio));
    
    return purchaseId;
  };

  const getPortfolioSummary = () => {
    const summary = {
      totalStocks: 0,
      totalValue: 0,
      stocksBySymbol: {}
    };
    
    portfolio.forEach(item => {
      if (item.type === 'buy') {
        summary.totalStocks += item.quantity;
        summary.totalValue += item.quantity * item.currentPrice;
        
        if (!summary.stocksBySymbol[item.symbol]) {
          summary.stocksBySymbol[item.symbol] = {
            quantity: 0,
            value: 0,
            name: item.name
          };
        }
        
        summary.stocksBySymbol[item.symbol].quantity += item.quantity;
        summary.stocksBySymbol[item.symbol].value += item.quantity * item.currentPrice;
      }
    });
    
    return summary;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading, 
      login, 
      logout,
      updateUserCredits,
      portfolio,
      addStockToPortfolio,
      getPortfolioSummary
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext; 