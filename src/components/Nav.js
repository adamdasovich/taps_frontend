import React, { useState, useEffect } from 'react'
import logo from '../images/taps_logo.png'

const Nav = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [animated, setAnimated] = useState(false)

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        
        // Trigger entrance animation
        setTimeout(() => {
            setAnimated(true)
        }, 100)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const toggleMenu = () => {
        setMenuOpen(!menuOpen)
    }

    const closeMenu = () => {
        setMenuOpen(false)
    }

    return (
        <nav className={`navbar ${menuOpen ? 'open' : ''} ${scrolled ? 'navbar-scrolled' : ''} ${animated ? 'navbar-animated' : ''}`}>
            <div className="navbar-container">
                <a href='/' className='logo'>
                    <img src={logo} alt='Taps & Corks Logo' className="nav-logo" />
                </a>
                
                {/* mobile navbar */}
                <div className='menu-icon' onClick={toggleMenu}>
                    <div className='bar'></div>
                    <div className='bar'></div>
                    <div className='bar'></div>
                </div>
                
                <ul className={`nav-links ${menuOpen ? 'visible' : ''}`}>
                    <li className="nav-item">
                        <a href='/' onClick={closeMenu}>
                            <span className="nav-text">Home</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href='/about' onClick={closeMenu}>
                            <span className="nav-text">About</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href='/services' onClick={closeMenu}>
                            <span className="nav-text">Services</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href='/menu' onClick={closeMenu}>
                            <span className="nav-text">Menu</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href='/reservations' onClick={closeMenu} className="reservation-link">
                            <span className="nav-text">Reservations</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href='/login' onClick={closeMenu} className="login-link">
                            <span className="nav-text">Login</span>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Nav