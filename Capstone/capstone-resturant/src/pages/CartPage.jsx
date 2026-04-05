import { useState } from 'react';
import { Container, Row, Col, Table, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import CartSummary from '../components/CartSummary';
import ConfirmModal from '../components/ConfirmModal';

export default function CartPage({ cart, setCart }) {
    const navigate = useNavigate();

    // Modal State Tracking
    const [isCancelOpen, setIsCancelOpen] = useState(false);
    const [isThankYouOpen, setIsThankYouOpen] = useState(false);
    const [thankYouMessage, setThankYouMessage] = useState('');

    // --- Dynamic Math Calculations ---
    // reduce() loops through the cart, multiplying price by quantity and adding it to the running total (acc)
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const taxRate = 0.08; // 8% Tax Rate
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    // --- Event Handlers ---
    const handleRemoveItem = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const handleCancelConfirm = () => {
        setCart([]); // 1. Clear cart
        setIsCancelOpen(false); // 2. Close cancel modal
        setThankYouMessage('Your order has been cancelled.');
        setIsThankYouOpen(true); // 3. Open feedback modal

        // 4. Redirect after 3 seconds
        setTimeout(() => {
            setIsThankYouOpen(false);
            navigate('/menu');
        }, 3000);
    };

    const handleSubmitOrder = () => {
        setCart([]); // 1. Clear cart
        setThankYouMessage('Thank you for your order!');
        setIsThankYouOpen(true); // 2. Show thank you

        // 3. Redirect after 3 seconds
        setTimeout(() => {
            setIsThankYouOpen(false);
            navigate('/menu');
        }, 3000);
    };

    return (
        <Container className="my-5">
            <h2 className="mb-4 fw-bold" style={{ color: '#111827' }}>Your Cart</h2>

            {/* Conditionally render the Empty message OR the Table based on cart length */}
            {cart.length === 0 ? (
                <div className="text-center mt-5">
                    <h4 className="text-muted">Your cart is empty.</h4>
                    <Button color="dark" className="mt-3" onClick={() => navigate('/menu')}>Return to Menu</Button>
                </div>
            ) : (
                <Row className="g-5">

                    <Col lg="8">
                        <Table responsive hover className="align-middle">
                            <thead className="table-light">
                            <tr>
                                <th>Item</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {cart.map((item) => (
                                <tr key={item.id}>
                                    <td className="fw-bold">{item.name}</td>
                                    <td>${item.price.toFixed(2)}</td>
                                    <td>{item.quantity}</td>
                                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                                    <td className="text-end">
                                        <Button color="danger" size="sm" outline onClick={() => handleRemoveItem(item.id)}>
                                            Remove
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </Col>

                    <Col lg="4">
                        <CartSummary
                            subtotal={subtotal}
                            tax={tax}
                            total={total}
                            onCheckout={handleSubmitOrder}
                            onCancel={() => setIsCancelOpen(true)}
                        />
                    </Col>
                </Row>
            )}

            {/* --- Modals --- */}
            <ConfirmModal
                isOpen={isCancelOpen}
                toggle={() => setIsCancelOpen(!isCancelOpen)}
                title="Cancel Order"
                message="Are you sure you want to cancel your order?"
                confirmText="Yes, Cancel"
                cancelText="No, Keep It"
                onConfirm={handleCancelConfirm}
                isThankYou={false}
            />

            <ConfirmModal
                isOpen={isThankYouOpen}
                toggle={() => setIsThankYouOpen(!isThankYouOpen)}
                message={
                    <>
                        {/* FontAwesome Leaf Icon from your vanilla project */}
                        <i className="fa-solid fa-leaf fa-3x text-success mb-3 d-block"></i>
                        <h3 className="fw-bold">{thankYouMessage}</h3>
                        <p className="text-muted mt-2">Redirecting you back to the menu in 3 seconds...</p>
                    </>
                }
                isThankYou={true}
            />

        </Container>
    );
}