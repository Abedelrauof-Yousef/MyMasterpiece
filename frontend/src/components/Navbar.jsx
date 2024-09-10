import React from "react";

function Navbar(){
    return(
        <nav className="nav">
            <a href="/" className="site-title">BudgetWiseHub</a>
            <ul>
                <li>
                    <a href="/">Home</a>
                </li>
                <li>
                <a href="about">About us</a>
                </li>
                <li>
                <a href="contact">Contact</a>
                </li>
                <li>
                 <a href="pricing">Pricing</a>
                </li>
                <li>
                <a href="signin">Sign In</a>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar;