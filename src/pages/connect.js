import React, { Component } from 'react';
import { connect } from 'react-redux'
import { navigate } from "gatsby"
import { toast } from 'react-toastify';

import queryString from 'query-string';

import Layout from '../components/layout';
import { reset, setStep, spotifyConnect, spotifyGetPlaylists } from '../state/app';

class SpotifyConnectPage extends Component {

  componentDidMount() {
    const parsedHash = queryString.parse(this.props.location.hash);
    let accessToken = null;
    if (parsedHash['access_token']) {
      accessToken = parsedHash['access_token'];
      this.props.spotifyConnect(accessToken);
      this.props.spotifyGetPlaylists(accessToken);
      this.props.setStep(2, true);
    } else {
      toast.warn('Uh Oh! It looks like you did not agree to allow us to access your Spotify account. Please try again and make sure you click the "Agree" button.');
      this.props.reset();
    }
    navigate("/");
  }

  render() {
    return (
      <Layout>
        <div className="text-center flex flex-col text-white">
          Connecting to Spotify ... Sit Tight!
        </div>
      </Layout>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    reset: () => { dispatch(reset()) },
    setStep: (step, skipCheck) => { dispatch(setStep(step, skipCheck)) },
    spotifyConnect: accessToken => { dispatch(spotifyConnect(accessToken)) },
    spotifyGetPlaylists: accessToken => { dispatch(spotifyGetPlaylists(accessToken)) }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(SpotifyConnectPage);
