import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'

import logo from '../images/logo.png'

const Header = ({ siteTitle, siteDescription }) => (
  <nav className="bg-blue-lighter">
    <div className="flex flex-wrap items-center justify-between max-w-xl mx-auto p-4 md:p-8">
      <div>
        <img src={logo} alt="SpotYou Logo" className='inline pr-5 align-middle' />
        <Link to="/" className="no-underline text-black inline" >
          <span className="font-bold text-xl">{siteTitle}</span>
        </Link>
      </div>

      <Link to="/" className="flex items-center no-underline text-black">
        <span className="text-xl">{siteDescription}</span>
      </Link>

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
