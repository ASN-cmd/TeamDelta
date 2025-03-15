import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './App.css';
// Material UI imports
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Button, 
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { 
  AccountBalanceWallet, 
  TrendingUp, 
  ShoppingCart, 
  Sell,
  Logout
} from '@mui/icons-material';

const Home = () => {
  const { user, logout, getPortfolioSummary } = useAuth();
  const navigate = useNavigate();
  const [portfolioSummary, setPortfolioSummary] = useState({
    totalStocks: 0,
    totalValue: 0,
    stocksBySymbol: {}
  });

  useEffect(() => {
    // Get portfolio summary
    const summary = getPortfolioSummary();
    setPortfolioSummary(summary);
  }, [getPortfolioSummary]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigateToBuyStocks = () => {
    navigate('/buy-stocks');
  };

  return (
    <div className="home-container">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, pb: 2, borderBottom: '1px solid #eee' }}>
        <Typography variant="h4" component="h1">
          Investment Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip 
            icon={<AccountBalanceWallet />} 
            label={`Credits: $${user?.credits?.toFixed(2) || '0.00'}`} 
            color="primary" 
            variant="outlined"
            sx={{ fontWeight: 'bold', fontSize: '1rem', padding: '20px 10px' }}
          />
          <Button 
            variant="contained" 
            color="error" 
            startIcon={<Logout />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Welcome, {user?.name || user?.email || 'User'}!
        </Typography>
        
        {/* Portfolio Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Portfolio Summary
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1">
                    Total Stocks Owned:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {portfolioSummary.totalStocks}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1">
                    Total Portfolio Value:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" color="primary">
                    ${portfolioSummary.totalValue.toFixed(2)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Account Balance
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1">
                    Available Credits:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" color="success.main">
                    ${user?.credits?.toFixed(2) || '0.00'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1">
                    Total Assets:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    ${(portfolioSummary.totalValue + (user?.credits || 0)).toFixed(2)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Stock Holdings Table */}
        {Object.keys(portfolioSummary.stocksBySymbol).length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Your Stock Holdings
            </Typography>
            <TableContainer component={Paper} elevation={3}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Symbol</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(portfolioSummary.stocksBySymbol).map(([symbol, data]) => (
                    <TableRow key={symbol}>
                      <TableCell component="th" scope="row">
                        <strong>{symbol}</strong>
                      </TableCell>
                      <TableCell>{data.name}</TableCell>
                      <TableCell align="right">{data.quantity}</TableCell>
                      <TableCell align="right">${data.value.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
      
      <Divider sx={{ mb: 4 }} />
      
      <Typography variant="h6" sx={{ mb: 3 }}>
        Quick Actions
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            elevation={3} 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShoppingCart color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Buy Stocks
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Invest in new assets and grow your portfolio with a variety of stock options.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth
                onClick={navigateToBuyStocks}
              >
                Buy/Sell
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            elevation={3} 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  View Portfolio
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Check owned stocks, bonds, and insurance. Monitor your investments performance.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth
              >
                View Portfolio
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            elevation={3} 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Sell color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Sell Investments
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Liquidate existing investments and convert them back to credits in your account.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth
              >
                Buy/Sell
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home; 