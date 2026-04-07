import { useState } from 'react';
import { Container, Row, Col } from 'reactstrap';

import { MENU_ITEMS } from '../data/menuData';
import MenuFilter from '../components/MenuFilter';
import MenuItemCard from '../components/MenuItemCard';

import menuInspirationImg from '../../public/images/menu_inspiration.jpg';
import './MenuPage.css';

export default function MenuPage({addToCart}) {
    const [category, setCategory] = useState('All');

    const filteredItems = MENU_ITEMS.filter(item => {
        if (category === 'All') return true;
        return item.category === category;
    });

    return (
        <Container className="my-5">

            <Row className="mb-5 justify-content-center">
                <Col xs="12" lg="8">
                    <article className="menu-item-card d-flex flex-column align-items-center text-center">
                        <div className="menu-image-frame w-75 mb-4">
                            <img src={menuInspirationImg} alt="Ingredients on Full Display" className="img-fluid" />
                        </div>

                        <div className="menu-item-details w-100 mt-0">
                            <span className="menu-category">Our Philosophy</span>

                            {/* Notice how inline styles change from strings to objects in React! */}
                            <h1 className="menu-item-title mb-3" style={{ fontSize: '2rem' }}>Menu Vision</h1>

                            <p className="menu-item-desc mb-3">
                                Welcome to our cafe and bakery, where we believe that a beautiful plate is better than an ugly one.
                            </p>
                            <p className="menu-item-desc mb-4">
                                Our culinary philosophy is straightforward: simple, handcrafted flavors are better than complex, over-engineered dishes.
                            </p>

                            <h2 className="menu-item-title mb-2" style={{ fontSize: '1.5rem' }}>We Value Ingredient Quality</h2>
                            <p className="menu-item-desc">
                                When it comes to what goes into our food, explicit is better than implicit. We proudly and openly source our heritage grains from local mills and our produce from local greenhouses.
                            </p>
                        </div>
                    </article>
                </Col>
            </Row>

            {/* Separator Line */}
            <hr className="section-divider my-5" />

            {/* PRE-EXISTING: The Filter and Menu Grid */}
            <Row>
                <Col md="3" className="mb-4">
                    <MenuFilter currentCategory={category} setCategory={setCategory} />
                </Col>

                <Col md="9">
                    <h2 className="mb-4 fw-bold" style={{ color: '#111827' }}>Our Offerings</h2>
                    <Row className="g-4">
                        {filteredItems.map(item => (
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