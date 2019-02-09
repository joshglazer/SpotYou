import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'

const handleClick = ev => {
  ev.preventDefault()
  const element = document.getElementById('nav')
  element.classList.toggle('block')
  element.classList.toggle('hidden')
}

const Header = ({ siteTitle, siteDescription }) => (
  <nav className="bg-blue-light">
    <div className="flex flex-wrap items-center justify-between max-w-xl mx-auto p-4 md:p-8">
      <Link to="/" className="flex items-center no-underline text-white">
        <span className="font-bold text-xl">{siteTitle}</span>
      </Link>

      <Link to="/" className="flex items-center no-underline text-white">
        <span className="text-xl">asdf{siteDescription}</span>
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
