import { Card, CardBody, Button } from 'reactstrap';

export default function CartSummary({ subtotal, tax, total, onCheckout, onCancel }) {
    return (
        <Card className="shadow-sm border-0 bg-light">
            <CardBody className="p-4">
                <h4 className="fw-bold mb-4">Order Summary</h4>

                <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="d-flex justify-content-between mb-3">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-4 fw-bold fs-5">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>

                <Button color="dark" block="true" className="w-100 mb-3 py-2 fw-bold" onClick={onCheckout}>
                    Submit Order
                </Button>

                <Button color="danger" outline block="true" className="w-100 py-2 fw-bold" onClick={onCancel}>
                    Cancel Order
                </Button>
            </CardBody>
        </Card>
    );
}