import React from 'react'
import logo from '../images/small_logo.png'

const Footer = () => {
  return (
    <footer>
        <section>
            <div className='company-info'>
                <img src={logo} alt='logo'/>
                <p>
                    Not a bad watering hole.
                </p>
            </div>
            <div>
                <h3>Important Links</h3>
                <ul>
                    <li><a href='/'>Home</a></li>
                    <li><a href='/about'>About</a></li>
                    <li><a href='/menu'>Menu</a></li>
                </ul>
            </div>
        </section>
    </footer>
  )
}

export default Footer