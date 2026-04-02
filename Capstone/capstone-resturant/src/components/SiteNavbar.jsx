import { Navbar, NavbarBrand, Nav, NavItem } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import logoImg from '../assets/logo_2.png'

export default function SiteNavbar() {
    return (
        <Navbar color="light" light expand="md" className="px-4 px-md-5 custom-editorial-nav">
            <NavbarBrand tag={NavLink} to="/">
                <img src={logoImg} alt="Lorem Ipsum Cafe Logo" style={{ height: '40px' }} />
            </NavbarBrand>

            <Nav className="ms-auto" pills>
                <NavItem>
                    <NavLink className="nav-link" to="/">Home</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className="nav-link" to="/menu">Menu</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className="nav-link" to="/reservations">Reservations</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className="nav-link" to="/cart">Cart</NavLink>
                </NavItem>
            </Nav>
        </Navbar>
    );
}