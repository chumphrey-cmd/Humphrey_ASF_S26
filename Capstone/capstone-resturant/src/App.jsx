import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import SiteNavbar from './components/SiteNavbar';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import ReservationsPage from './pages/ReservationsPage';
import CartPage from './pages/CartPage';

function App() {
    // 1. Our Global Cart State
    const [cart, setCart] = useState([]);

    // 2. The Add To Cart Logic
    const addToCart = (item, quantityToAdd) => {
        setCart((prevCart) => {
            // Check if the item is already in the cart
            const existingItem = prevCart.find(cartItem => cartItem.id === item.id);

            if (existingItem) {
                // If it exists, update the quantity (but cap it at exactly 5)
                return prevCart.map(cartItem =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: Math.min(cartItem.quantity + quantityToAdd, 5) }
                        : cartItem
                );
            } else {
                // If it's a new item, add it to the array (capping initial add at 5 just in case)
                return [...prevCart, { ...item, quantity: Math.min(quantityToAdd, 5) }];
            }
        });
    };

    return (
        <>
            <SiteNavbar />
            <Routes>
                <Route path="/" element={<HomePage />} />

                {/* 3. Pass the addToCart function down to the MenuPage */}
                <Route path="/menu" element={<MenuPage addToCart={addToCart} />} />

                <Route path="/reservations" element={<ReservationsPage />} />

                {/* 4. Pass the cart state (and the setter) down to the CartPage */}
                <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />} />
            </Routes>
        </>
    );
}

export default App;