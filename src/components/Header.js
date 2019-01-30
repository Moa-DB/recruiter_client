import React, {Component} from 'react';
import { Navbar, Nav, PageHeader } from 'react-bootstrap';
import {Link, withRouter} from 'react-router-dom';
import {auth} from '../components/Auth';
import './Header.css';

/**
 * Presents the user with a navigation bar to navigate the various pages of the web app.
 */
class Header extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }
    render() {
        return (
            <PageHeader>
                RECRUITER PORTAL
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Link to ='/home' >home</Link>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Nav>
                        <Navbar.Brand>
                            <Link to ='/applications' >applications</Link>
                        </Navbar.Brand>
                    </Nav>
                    <Navbar.Brand>
                    <ul className="nav navbar-nav navbar-right">
                    <AuthButton/>
                    </ul>
                    </Navbar.Brand>
                </Navbar>
                {this.props.location.pathname.substring(1)}
            </PageHeader>
        );
    }
}

/**
 * Presents the user with a log in button if the user is not logged in and a log out button with username if the user is
 * logged in.
 * @type {React.ComponentType<Own>}
 */
const AuthButton = withRouter(({ history }) => (
    auth.isAuthenticated ? (
            <button type="button" id="headerButton"
                    onClick={() => {
                auth.signout(() => history.push('/login'))
            }}>sign out {auth.user}</button>
    ) : (
        <button type="button" id="headerButton"
                onClick={() => {
                    history.replace('/login');
                }}>log in</button>
    )
))

export default withRouter(Header);
