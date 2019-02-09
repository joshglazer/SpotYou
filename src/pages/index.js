import React, { Component } from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'

import queryString from 'query-string';

// Source for following API endpoint
// https://developer.spotify.com/documentation/general/guides/authorization-guide/#implicit-grant-flow
// TODO: implement state parameter

const spotifyClientID = 'b31cb61c491840d69d23ff47bcbf3850';
const redirectURI = 'http://localhost:8000/';
const scope = 'playlist-read-private';
const spotifyURL = `https://accounts.spotify.com/authorize?client_id=${spotifyClientID}&redirect_uri=${redirectURI}&scope=${scope}&response_type=token`


export default class IndexPage extends Component {
  constructor(props) {
    super(props);

    let step = 1;
    let accessToken = null;

    const parsedHash = queryString.parse(this.props.location.hash);
    if (parsedHash['access_token']) {
      step = 2;
      accessToken = parsedHash['access_token'];
    }

    this.state = {
      step: step,
      accessToken: accessToken,
      playlists: [],
    }

  }

  componentDidMount() {
    if (this.state.accessToken) {
      const spotifyPlaylistUrl = 'https://api.spotify.com/v1/me/playlists';
      fetch(spotifyPlaylistUrl, {
        method: 'get',
        headers: {
          Authorization: `Bearer ${this.state.accessToken}`,
        }
      })
      .then((response) => response.json())
      .then((responseData) => {
          console.log(responseData);
        this.setState({
          playlists: responseData.items,
        });
      })
    }
  }

  render() {
    return (
      <Layout>
        <SEO
          title="Home"
          keywords={[`gatsby`, `tailwind`, `react`, `tailwindcss`]}
        />

        <div className="text-center">

          { this.state.step === 1 &&
            <div>
              <h2 className="bg-yellow inline-block my-8 p-3">
                Hey there! Welcome to SpotYou.
              </h2>

              <p>
                To get started, click the button below to connect your spotify account.
              </p>

              <a
                href={spotifyURL}
              >
                Connect your Spotify Account!
              </a>
            </div>
          }

          { this.state.step === 2 &&
            <div>
              <p className="leading-loose">
                Your playlists are below:
              </p>
              {
                this.state.playlists.map(function(playlist, index) {
                  return (
                    <div key={index}>
                      <img src={playlist.images[0].url} style={{maxHeight: 100}}/>
                    </div>
                  )
                })
              }
            </div>
          }
        </div>
      </Layout>
    );
  }
}
