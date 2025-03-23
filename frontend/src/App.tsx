import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PlanningPoker from './pages/planning-poker';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">홈</Link>
            </li>
            <li>
              <Link to="/planning-poker">스토리 포인트 산정</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<h1>AgileBuddy</h1>} />
          <Route path="/planning-poker" element={<PlanningPoker />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 