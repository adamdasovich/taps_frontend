import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import beerList from '../drinkList'

const Menu = () => {
    const [animated, setAnimated] = useState(false);

    // Trigger entrance animations after component mounts
    useEffect(() => {
        setTimeout(() => {
            setAnimated(true);
        }, 100);
    }, []);

    const handleOrder = (id) => {
        console.log(id)
        Swal.fire({
            title: "Add to your tab?",
            text: "Ready to order this drink?",
            icon: "question",
            iconColor: "#c8a97e",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, I'll have one!",
            background: "#1e1e1e",
            color: "#e0e0e0",
            customClass: {
                confirmButton: 'swal-confirm-button',
                cancelButton: 'swal-cancel-button'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Cheers!",
                    text: "Your drink is being prepared.",
                    icon: "success",
                    iconColor: "#c8a97e",
                    background: "#1e1e1e",
                    color: "#e0e0e0",
                    customClass: {
                        confirmButton: 'swal-confirm-button'
                    }
                });
            }
        });
    }

    return (
        <div className={`menu-container ${animated ? 'menu-animated' : ''}`}>
            <div className='menu-header'>
                <div className="menu-title-container">
                    <h2>This Week's Specials</h2>
                    <div className="pub-divider menu-divider">
                        <span></span>
                        <div className="pub-icon menu-icon-beer"></div>
                        <span></span>
                    </div>
                </div>
                <button className="view-menu-btn">
                    <span className="button-text">Full Menu</span>
                    <span className="button-icon">📋</span>
                </button>
            </div>
            
            <div className='cards'>
                {beerList.map((beer, index) => (
                    <div 
                        key={beer.id} 
                        className='menu-items'
                        style={{ animationDelay: `${0.1 + (index * 0.1)}s` }}
                    >
                        <div className="menu-item-top">
                            <img src={beer.image} alt={beer.title}/>
                        </div>
                        <div className='menu-content'>
                            <div className='heading'>
                                <h5>{beer.title}</h5>
                                <p className="beer-price">${beer.price}</p>
                            </div>
                            <p className="beer-description">{beer.description}</p>
                            <button 
                                className='order-btn'
                                onClick={() => handleOrder(beer.id)}
                            >
                                <span>Order Now</span>
                                <span className="button-icon">🍺</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Menu