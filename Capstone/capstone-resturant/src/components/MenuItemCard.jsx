import { useState } from 'react';
import { Card, CardImg, CardBody, CardTitle, CardText, Button, Input, InputGroup } from 'reactstrap';

export default function MenuItemCard({ item }) {
    // Local state strictly for the quantity input (defaults to 1)
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        // Sanity check to output to console
        console.log(`Added ${quantity} of ${item.name} to cart!`);
    };

    return (
        <Card className="h-100 shadow-sm border-0">
            {/* 1. Image section - fixing the height so cards are uniform */}
            <CardImg
                top
                src={item.image}
                alt={item.name}
                loading="lazy" // telling the browser not to download the image until the user scrolls down
                style={{ height: '220px', objectFit: 'cover' }}
            />

            {/* 2. Body section with flexbox to push the button to the bottom */}
            <CardBody className="d-flex flex-column">
                <CardTitle tag="h5" className="fw-bold">{item.name}</CardTitle>
                <CardText className="text-muted flex-grow-1">{item.description}</CardText>
                <CardText className="fw-bold fs-5">${item.price.toFixed(2)}</CardText>

                {/* 3. The Quantity + Button grouping */}
                <InputGroup className="mt-auto">
                    <Input
                        type="number"
                        min="1"
                        max="5"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        aria-label={`Quantity for ${item.name}`}
                        style={{ maxWidth: '80px' }}
                    />
                    <Button color="dark" onClick={handleAddToCart}>
                        Add to Cart
                    </Button>
                </InputGroup>
            </CardBody>
        </Card>
    );
}