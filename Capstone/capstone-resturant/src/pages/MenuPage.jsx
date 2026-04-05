import { useState } from 'react';
import { Container, Row, Col } from 'reactstrap';

import { MENU_ITEMS } from '../data/menuData';
import MenuFilter from '../components/MenuFilter';
import MenuItemCard from '../components/MenuItemCard';

export default function MenuPage({addToCart}) {
    // 1. State to track the currently selected category (Defaults to 'All')
    const [category, setCategory] = useState('All');

    // 2. Filter the menu data before we render it
    const filteredItems = MENU_ITEMS.filter(item => {
        if (category === 'All') return true;
        return item.category === category;
    });

    return (
        <Container className="my-5">
            <Row>

                {/* Left Sidebar: The Filter Dropdown */}
                <Col md="3" className="mb-4">
                    <MenuFilter currentCategory={category} setCategory={setCategory} />
                </Col>

                {/* Right Content: The Menu Grid */}
                <Col md="9">
                    <h2 className="mb-4 fw-bold" style={{ color: '#111827' }}>Our Offerings</h2>

                    {/* 3. The Grid: 'g-4' adds an even gap between all cards */}
                    <Row className="g-4">

                        {/* 4. Map through the filtered array and generate a Card for each item */}
                        {filteredItems.map(item => (
                            // On small screens: 1 column (12). Medium: 2 cols (6). Large: 3 cols (4).
                            <Col xs="12" sm="6" lg="4" key={item.id}>
                                <MenuItemCard item={item} addToCart={addToCart} />
                            </Col>
                        ))}

                    </Row>
                </Col>

            </Row>
        </Container>
    );
}