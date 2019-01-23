import React, { Component } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';
import Auth from './components/Auth';
//import {withRouter} from "react-router-dom";

/**
 * Wrapper class that adds Header and Footer to each page.
 */
class App extends Component {
    render() {
        return (
            <div className="App">
                <Header />
                <Auth/>
                <Footer />
            </div>
        );
    }
}
export default App;
//export default withRouter(App); //TODO test to see if build works (change back if not???)
