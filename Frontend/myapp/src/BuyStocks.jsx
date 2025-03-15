import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './App.css';

const BuyStocks = () => {
  const { user, updateUserCredits } = useAuth();
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [userCredits, setUserCredits] = useState(10000); // Default credits
  const [message, setMessage] = useState({ text: '', type: '' });
  const [quantities, setQuantities] = useState({});

  // Mock stock data - in a real app, this would come from an API
  useEffect(() => {
    // Simulating API call to fetch stocks
    const fetchStocks = () => {
      const mockStocks = [
        { id: 1, symbol: 'AAPL', name: 'Apple Inc.', price: 175.34, change: '+1.25%', available: 100 },
        { id: 2, symbol: 'MSFT', name: 'Microsoft Corporation', price: 325.67, change: '+0.75%', available: 150 },
        { id: 3, symbol: 'GOOGL', name: 'Alphabet Inc.', price: 135.89, change: '-0.50%', available: 80 },
        { id: 4, symbol: 'AMZN', name: 'Amazon.com Inc.', price: 145.23, change: '+2.10%', available: 120 },
        { id: 5, symbol: 'META', name: 'Meta Platforms Inc.', price: 298.45, change: '-1.20%', available: 90 },
        { id: 6, symbol: 'TSLA', name: 'Tesla Inc.', price: 245.78, change: '+3.45%', available: 110 },
        { id: 7, symbol: 'NFLX', name: 'Netflix Inc.', price: 425.12, change: '+0.95%', available: 70 },
        { id: 8, symbol: 'NVDA', name: 'NVIDIA Corporation', price: 435.67, change: '+2.75%', available: 60 }
      ];
      setStocks(mockStocks);
      
      // Initialize quantities state
      const initialQuantities = {};
      mockStocks.forEach(stock => {
        initialQuantities[stock.id] = 1;
      });
      setQuantities(initialQuantities);
    };

    fetchStocks();
    
    // Get user credits from the user object
    if (user && user.credits) {
      setUserCredits(user.credits);
    }
  }, [user]);

  const handleQuantityChange = (stockId, change) => {
    setQuantities(prev => {
      const currentQty = prev[stockId] || 1;
      const newQty = Math.max(1, currentQty + change); // Ensure quantity is at least 1
      
      // Find the stock to check available quantity
      const stock = stocks.find(s => s.id === stockId);
      if (stock && newQty > stock.available) {
        return prev; // Don't allow exceeding available quantity
      }
      
      return {
        ...prev,
        [stockId]: newQty
      };
    });
  };

  const handleBuy = (stock) => {
    const quantity = quantities[stock.id] || 1;
    const totalPrice = stock.price * quantity;
    
    // Check if user has enough credits
    if (userCredits < totalPrice) {
      setMessage({ 
        text: 'Insufficient credits to purchase this stock.', 
        type: 'danger' 
      });
      return;
    }

    // Calculate new credit balance
    const newCredits = userCredits - totalPrice;
    
    // Update local state
    setUserCredits(newCredits);
    
    // Update user credits in the context and localStorage
    updateUserCredits(newCredits);
    
    // Update available stock quantity
    setStocks(prevStocks => 
      prevStocks.map(s => 
        s.id === stock.id 
          ? { ...s, available: s.available - quantity } 
          : s
      )
    );

    // Reset quantity for this stock
    setQuantities(prev => ({
      ...prev,
      [stock.id]: 1
    }));

    setMessage({ 
      text: `Successfully purchased ${quantity} share${quantity > 1 ? 's' : ''} of ${stock.symbol} for $${totalPrice.toFixed(2)}`, 
      type: 'success' 
    });
  };

  const goBack = () => {
    navigate('/home');
  };

  return (
    <div className="stocks-container">
      <header className="stocks-header">
        <h1>Buy Stocks</h1>
        <div className="user-credits">
          <span>Available Credits: ${userCredits.toFixed(2)}</span>
          <button className="back-btn" onClick={goBack}>Back to Dashboard</button>
        </div>
      </header>

      {message.text && (
        <div className={`alert alert-${message.type} fade show`} role="alert">
          {message.text}
        </div>
      )}

      <div className="stocks-list">
        <div className="stock-header">
          <div className="stock-cell">Symbol</div>
          <div className="stock-cell">Company</div>
          <div className="stock-cell">Price</div>
          <div className="stock-cell">Change</div>
          <div className="stock-cell">Available</div>
          <div className="stock-cell">Quantity</div>
          <div className="stock-cell">Action</div>
        </div>
        
        {stocks.map(stock => {
          const quantity = quantities[stock.id] || 1;
          const totalPrice = stock.price * quantity;
          
          return (
            <div key={stock.id} className="stock-row">
              <div className="stock-cell">{stock.symbol}</div>
              <div className="stock-cell">{stock.name}</div>
              <div className="stock-cell">${stock.price.toFixed(2)}</div>
              <div className={`stock-cell ${stock.change.startsWith('+') ? 'positive-change' : 'negative-change'}`}>
                {stock.change}
              </div>
              <div className="stock-cell">{stock.available}</div>
              <div className="stock-cell quantity-cell">
                <button 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(stock.id, -1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="quantity-value">{quantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(stock.id, 1)}
                  disabled={quantity >= stock.available}
                >
                  +
                </button>
              </div>
              <div className="stock-cell">
                <div className="buy-info">
                  <button 
                    className="buy-btn" 
                    onClick={() => handleBuy(stock)}
                    disabled={stock.available <= 0 || userCredits < totalPrice}
                  >
                    Buy
                  </button>
                  <span className="total-price">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BuyStocks; 