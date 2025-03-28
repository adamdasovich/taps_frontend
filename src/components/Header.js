import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import bannerImg from '../images/drinks.png';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [animated, setAnimated] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Trigger entrance animation after component mounts
    setTimeout(() => {
      setAnimated(true);
    }, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
      <section>
        <div className={`banner ${animated ? 'banner-animated' : ''}`}>
          <div className="pub-sign">
            <h2>Taps & Corks</h2>
            <div className="pub-divider">
              <span></span>
              <div className="pub-icon"></div>
              <span></span>
            </div>
            <h3>Cobourg</h3>
          </div>
          
          <p>We are Cobourg's place to talk nonsense with a modern twist.</p>
          
          <Link to='/booking'>
            <button aria-label='On Click' className="reserve-button" style={{marginRight: '20px', marginBottom: '20px'}}>
              <span className="button-text">Reserve Table</span>
              <span className="button-icon">🍺</span>
            </button>
          </Link>
          <Link to='/poll'>
            <button aria-label='On Click' className='reserve-button'>
              <span className='button-text'>Vote for Tuesday's Movie</span>
              <span className='button-icon'>🗳️</span>
            </button>
          </Link>
        </div>
        
        {/* Banner image with overlay */}
        <div className={`banner-img ${animated ? 'banner-img-animated' : ''}`}>
          <div className="img-overlay"></div>
          <img src={bannerImg} alt='Drinks at Taps & Corks'/>
        </div>
      </section>
    </header>
  );
};

export default Header;