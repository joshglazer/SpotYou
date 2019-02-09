import React, { Component } from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'

import queryString from 'query-string';

import {authorizeUrl, getPlaylists, getPlaylistTracks} from '../api/spotify';

export default class IndexPage extends Component {
  constructor(props) {
    super(props);

    let step = 1;
    let accessToken = null;

    // handle Spotify authroization flow
    const parsedHash = queryString.parse(this.props.location.hash);
    if (parsedHash['access_token']) {
      step = 2;
      accessToken = parsedHash['access_token'];
    }

    this.state = {
      step: step,
      accessToken: accessToken,
      playlists: [],
      playlistSelected: null,
      playlistSelectedTracks: [],
    }

    this.handlePlaylistClick = this.handlePlaylistClick.bind(this);

  }

  async componentDidMount() {
    if (this.state.accessToken) {
      const playlists = await getPlaylists(this.state.accessToken);
      this.setState({
        playlists: playlists,
      });
    }
  }

  async handlePlaylistClick(playlist) {
    const tracks = await getPlaylistTracks(this.state.accessToken, playlist.tracks.href);
    this.setState({
      step: 3,
      playlistSelected: playlist,
      playlistSelectedTracks: tracks,
    });
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
                href={authorizeUrl()}
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
                    <div key={index} onClick={() => this.handlePlaylistClick(playlist)}>
                      <div>{playlist.name}</div>
                      <img src={playlist.images[0].url} style={{maxHeight: 100}} alt={playlist.name}/>
                    </div>
                  )
                }, this)
              }
            </div>
          }

          { this.state.step === 3 &&
            <div>
              <p className="leading-loose">
                Have have selected : {this.state.playlistSelected.name}
              </p>
              {
                this.state.playlistSelectedTracks.map(function(track, index) {
                  return (
                    <div key={index}>
                      <div>{track.track.name}</div>
                      <div>
                      {
                        track.track.artists.map(function(artist, index) {
                          return (
                            <div>{artist.name}</div>
                          )
                        },this)
                      }
                      </div>
                    </div>
                  )
                }, this)
              }
            </div>
          }
        </div>
      </Layout>
    );
  }
}
