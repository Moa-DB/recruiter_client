import React, { Component } from 'react';
import Login from '../pages/Login';
import Auth from '../components/Auth';
import Protected from '../pages/Protected';

/**
 * The Home page. Also point of authentication.
 */
class Home extends Component {
    render() {
        return (
            <div>
                <Login/>
                <Auth/>
                <Protected/>
            </div>
        );
    }
}

export default Home;
