import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'

import logo from '../images/logo.png'

const Header = ({ siteTitle, siteDescription }) => (
  <nav className="bg-blue-lighter pin-t w-full z-10 fixed">
    <div className="flex flex-wrap items-center justify-between max-w-xl mx-auto p-4 md:p-8">
      <div>
        <img src={logo} alt="SpotYou Logo" className='inline pr-5 align-middle h-16' />
        <Link to="/" className="no-underline text-black inline align-middle" >
          <h1 className="font-bold text-4xl inline m-0 p-0 align-middle">{siteTitle}</h1>
        </Link>
      </div>

      <span className="no-underline text-black text-xl hidden md:block">{siteDescription}</span>

    </div>
  </nav>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
