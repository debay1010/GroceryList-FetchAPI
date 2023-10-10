import React from 'react'

const Footer = ({ length }) => {
    const today = new Date();

    return (
        <footer className='footer'>

            <p>There are {length} List {length > 1 ? 'items' : 'item'} </p>
        </footer>
    )
}

export default Footer;