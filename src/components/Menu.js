import React from 'react'
import Swal from 'sweetalert2'
import beerList from '../drinkList'

const Menu = () => {

    const handleOrder = (id) => {
        console.log(id)
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, order it!"
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: "Ordered!",
                text: "Your selection has been ordererd.",
                icon: "success"
              });
            }
          });
    }

  return (
    <div className='menu-container'>
        <div className='menu-header'>
            <h2>This weeks specials!</h2>
            <button>Order Menu</button>
        </div>
        <div className='cards'>
        {
            beerList.map(beer => <div key={beer.id} className='menu-items'>
                <img src={beer.image} alt='beer'/>
                <div className='menu-content'>
                    <div className='heading'>
                        <h5>{beer.title}</h5>
                        <p>${beer.price}</p>
                    </div>
                    <p>{beer.description}</p>
                    <button className='orderBtn'onClick={() => handleOrder(beer.id)}>Order now!</button>
                </div>

            </div>)
        }
        </div>
    </div>
  )
}

export default Menu

