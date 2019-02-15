import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import { FaGithub } from 'react-icons/fa';

import Header from './header'
import '../css/style.css'

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
            subtitle
            description
          }
        }
      }
    `}
    render={data => (
      <div className="flex flex-col min-h-screen text-grey-darkest bg-blue-light">
        <link href="https://fonts.googleapis.com/css?family=Poppins" rel="stylesheet" />
        <Header siteTitle={data.site.siteMetadata.title} siteSubTitle={data.site.siteMetadata.subtitle} />

        <div className="flex flex-col flex-1 md:justify-center w-full mt-32">
          {children}
        </div>

        <footer className="bg-blue-darker">
          <div className="w-full flex-wrap md:flex justify-between max-w-xl mx-auto p-4 md:p-8 text-sm">
            <p className="w-full md:w-1/2 text-white text-center md:text-left pb-2 md:pb-0">
              A {' '}
              <a
                href="https://www.linkedin.com/in/joshglazer/"
                className="font-bold no-underline text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                Josh Glazer
              </a>
              {' '} Project
            </p>

            <p className="w-full md:w-1/2 text-white text-center md:text-right">
              <a
                href="https://github.com/joshglazer/SpotYou"
                className="font-bold no-underline text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub /> Source Code on GitHub
              </a>
            </p>
          </div>
        </footer>
      </div>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
