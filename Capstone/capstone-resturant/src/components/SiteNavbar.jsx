import { useState } from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, NavbarToggler, Collapse } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import logoImg from '../assets/logo_2.png'

export default function SiteNavbar() {
    // 1. Set up the state to track if the menu is open or closed
    const [isOpen, setIsOpen] = useState(false);

    // 2. Create the toggle function
    const toggleNavbar = () => setIsOpen(!isOpen);

    // 3. Pro-Tip Function: Closes the menu on mobile after clicking a link
    const closeMenu = () => setIsOpen(false);

    return (
        <Navbar color="light" light expand="md" className="px-4 px-md-5 custom-editorial-nav">

            <NavbarBrand tag={NavLink} to="/">
                <img src={logoImg} alt="Lorem Ipsum Cafe Logo" style={{height: '40px'}}/>
            </NavbarBrand>

            {/* 4. Add the Toggler Button for mobile screens */}
            <NavbarToggler onClick={toggleNavbar} className="me-2" />

            {/* 5. Wrap the Nav in the Collapse component */}
            <Collapse isOpen={isOpen} navbar>

                <Nav className="ms-auto" pills>
                    <NavItem>
                        {/* Added closeMenu to onClick so the mobile dropdown vanishes after selection */}
                        <NavLink className="nav-link" to="/" onClick={closeMenu}>Home</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className="nav-link" to="/menu" onClick={closeMenu}>Menu</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className="nav-link" to="/reservations" onClick={closeMenu}>Reservations</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className="nav-link" to="/cart" onClick={closeMenu}>Cart</NavLink>
                    </NavItem>
                </Nav>
            </Collapse>

        </Navbar>
    );
}