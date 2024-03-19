/* eslint-disable jsx-a11y/anchor-is-valid */

import { Link } from 'react-router-dom'
import './index.css'
const NotFound = () => (
    <div className='not-found-container'>
        <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-watch-not-found-light-theme-img.png"
            alt='not-found'
            className='not-fount-image'
        />
        <h3 className='page-not-found-text'>
            We're sorry, the page you requested could not be found. Please go back to homepage or contact us at <a href='#'>support@todoapp.com</a>
        </h3>
        <Link to='/'><button className='go-back-home-btn'>Back to home</button></Link>
    </div>
)

export default NotFound