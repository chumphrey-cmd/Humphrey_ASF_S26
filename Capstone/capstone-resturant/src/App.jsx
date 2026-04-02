import { Routes, Route } from 'react-router-dom';
import SiteNavbar from './components/SiteNavbar';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import ReservationsPage from './pages/ReservationsPage';
import CartPage from './pages/CartPage';

function App() {
  return (
      <>
        <SiteNavbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </>
  );
}

export default App;