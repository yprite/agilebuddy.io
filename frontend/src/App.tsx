import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import PlanningPoker from './pages/planning-poker';
import Home from './pages/Home';
import theme from './styles/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <nav style={{
            padding: '1rem',
            backgroundColor: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '2rem'
          }}>
            <ul style={{
              listStyle: 'none',
              display: 'flex',
              gap: '2rem',
              margin: 0,
              padding: 0
            }}>
              <li>
                <Link to="/" style={{
                  textDecoration: 'none',
                  color: '#1976d2',
                  fontWeight: 600
                }}>홈</Link>
              </li>
              <li>
                <Link to="/planning-poker" style={{
                  textDecoration: 'none',
                  color: '#1976d2',
                  fontWeight: 600
                }}>스토리 포인트 산정</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/planning-poker" element={<PlanningPoker />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 