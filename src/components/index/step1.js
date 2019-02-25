import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Location } from '@reach/router';

import { FaSpotify } from 'react-icons/fa';

import { authorizeUrl } from '../../api/spotify';
import { stepClassName } from '../../helpers';
import { setStep } from '../../state/app';

class Step1 extends Component {

  handleSpotifyConnect(location) {
    window.location.replace(authorizeUrl(location));
  }

  render() {
    return (
      <div id="step1" className={'bg-blue-light step ' + stepClassName(1, this.props.step)}>
        <h2 className="step-title" onClick={() => this.props.setStep(1)}>
          1. Connect your Spotify Account
        </h2>
        <div className="step-content">
          <p className='mb-6'>
            Hey there! Welcome to SpotYou!
          </p>

          <p className='mb-6'>
            SpotYou allows you to connect Spotify and Youtube to watch your favorite music videos.
          </p>

          <p className='mb-6'>
            To get started, click the button below to connect your spotify account.
          </p>

          <Location>
            {({ navigate, location }) =>
              <button
                className="btn text-xl"
                onClick={() => this.handleSpotifyConnect(location) }
              >
                <FaSpotify /> Click to Connect your Spotify Account
              </button>
            }
          </Location>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    step: state.app.step,
    spotifyAccessToken: state.app.spotifyAccessToken
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setStep: (step, skipCheck) => { dispatch(setStep(step, skipCheck)) }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Step1);
