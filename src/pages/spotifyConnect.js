import React, { Component } from 'react';
import { connect } from 'react-redux'
import { navigate } from "gatsby"

import queryString from 'query-string';

import Layout from '../components/layout';
import { spotifyConnect } from '../state/app';

class SpotifyConnectPage extends Component {

  componentDidMount() {
    const parsedHash = queryString.parse(this.props.location.hash);
    if (parsedHash['access_token']) {
      const accessToken = parsedHash['access_token'];
      this.props.spotifyConnect(accessToken);
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
    spotifyConnect: accessToken => {
      console.log("DISPATCH ME");
      dispatch(spotifyConnect(accessToken))
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(SpotifyConnectPage);
