import { HelmetProvider } from 'react-helmet-async';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { CurrencyProvider } from './hooks/useCurrency';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';

function App() {
  return (
    <HelmetProvider>
      <CurrencyProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              {/* More routes will be added here */}
            </Route>
          </Routes>
        </Router>
      </CurrencyProvider>
    </HelmetProvider>
  );
}

export default App;
