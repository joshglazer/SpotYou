import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { navigate } from "gatsby"

import { setStep } from '../state/app';

import logo from '../images/logo.png'

class Header extends Component {
  headerClick() {
    navigate("/")
    this.props.setStep(1);
  }

  render() {
    return (
      <nav className="bg-blue-lighter pin-t w-full z-10 fixed">
        <div className="flex flex-wrap items-center justify-between max-w-xl mx-auto p-8">
          <div onClick={() => this.headerClick()} className="cursor-pointer">
            <img src={logo} alt="SpotYou Logo" className='inline pr-5 align-middle h-16' />
            <h1 className="font-bold text-4xl inline m-0 p-0 align-middle text-black">{this.props.siteTitle}</h1>
          </div>
          <span className="no-underline text-black text-xl hidden md:block">{this.props.siteSubTitle}</span>
        </div>
      </nav>
    )
  }
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

const mapDispatchToProps = dispatch => {
  return {
    setStep: (step, skipCheck) => { dispatch(setStep(step, skipCheck)) }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Header);
