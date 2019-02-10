import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'

import Header from './header'
import '../css/style.css'

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
            description
          }
        }
      }
    `}
    render={data => (
      <div className="flex flex-col font-sans min-h-screen text-grey-darkest">
        <Header siteTitle={data.site.siteMetadata.title} siteDescription={data.site.siteMetadata.description} />

        <div className="flex flex-col flex-1 md:justify-center max-w-xl mx-auto px-4 py-8 md:p-8 w-full mt-32">
          {children}
        </div>

        <footer className="bg-blue-lighter">
          <div className="flex justify-between max-w-xl mx-auto p-4 md:p-8 text-sm">
            <p className="text-black">
              A {' '}
              <a
                href="https://www.linkedin.com/in/joshglazer/"
                className="font-bold no-underline text-black"
                target="_blank"
                rel="noopener noreferrer"
              >
                Josh Glazer
              </a>
              {' '} Project
            </p>

            <p>
              <a
                href="https://github.com/joshglazer/SpotYou"
                className="font-bold no-underline text-black"
                target="_blank"
                rel="noopener noreferrer"
              >
                Source Code on GitHub
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
