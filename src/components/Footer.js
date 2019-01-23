import React from 'react';
import './Footer.css';

/**
 * The global Footer for the application.
 */
const Footer = () => {
    return (
        <div className="Footer">
            <CopyrightLink />
        </div>
    );
};

const CopyrightLink = () => {
    return (
        <p>
            &copy;
            2019 Moa-DB
        </p>
    );
};

export default Footer;
