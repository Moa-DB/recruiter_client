import React, { Component } from 'react';
import './App.css';
import Auth from './components/Auth';

/**
 * Loads "Auth" which handles authentication before loading the rest of the application.
 */
class App extends Component {
    render() {
        return (
            <div className="App">
                 <Auth/>
            </div>
        );
    }
}
export default App;
