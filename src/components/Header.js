import React from 'react';
import { Navbar, Nav, NavItem, PageHeader } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * The global Header for the application.
 */
const Header = () => {
    return (
        <PageHeader>
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to="/">Home</Link>
                    </Navbar.Brand>
                </Navbar.Header>
                <Nav>
                    <NavItem href="/public">
                        Information
                    </NavItem>
                </Nav>
                <Nav>
                    <NavItem href="/protected">
                        Applications
                    </NavItem>
                </Nav>
            </Navbar>
        </PageHeader>
    );
};

export default Header;
