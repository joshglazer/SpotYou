import React, { Component } from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'

import queryString from 'query-string';
import YouTube from 'react-youtube';
import { FaSpotify } from 'react-icons/fa';

import {authorizeUrl, getPlaylists, getPlaylistTracks} from '../api/spotify';
import {search} from '../api/youtube';

import logo from '../images/logo.png'

export default class IndexPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 1,
      accessToken: null,
      playlists: [],
      playlistSelected: null,
      playlistSelectedTracks: [],
      video: null,
    }

    this.handleSpotifyConnect = this.handleSpotifyConnect.bind(this);
    this.handlePlaylistClick = this.handlePlaylistClick.bind(this);

  }

  async componentDidMount() {
    // handle Spotify authroization flow
    const parsedHash = queryString.parse(this.props.location.hash);
    if (parsedHash['access_token']) {
      const accessToken = parsedHash['access_token'];
      const playlists = await getPlaylists(accessToken);
      console.log(playlists);
      this.setState({
        step: 2,
        accessToken: accessToken,
        playlists: playlists,
      });
    }

    if (this.state.accessToken) {
    }
  }

  handleSpotifyConnect() {
    window.location.replace(authorizeUrl(this.props.location));
  }

  async handlePlaylistClick(playlist) {
    const tracks = await getPlaylistTracks(this.state.accessToken, playlist.tracks.href);
    this.setState({
      step: 3,
      playlistSelected: playlist,
      playlistSelectedTracks: tracks,
    });
    window.scrollTo(0,0);
  }

  async youtubeSearch(track) {
    let searchTerms = [track.track.name];

    track.track.artists.map((artist) => {
      return searchTerms.push(artist.name);
    })

    searchTerms.push("Official Music Video");

    const data = await search(searchTerms);
    if (data.items.length) {
      this.setState({
        video: data.items[0],
      })
    } else {
      alert("There was a problem.....");
    }
  }

  handleBrokenImage(event) {
    event.target.src = logo;
  }

  render() {
    return (
      <Layout>
        <SEO
          title="Home"
          keywords={[`gatsby`, `tailwind`, `react`, `tailwindcss`]}
        />

        <div className="text-center flex flex-col flex-1">

          <div id="step1" className={'bg-blue-light step ' + (this.state.step === 1 ? "active" : "inactive")}>
            <h2 className="step-title">
              1. Connect your Spotify Account
            </h2>
            <div className="step-content">
              <p>
                Hey there! Welcome to SpotYou!
              </p>

              <p>
                To get started, click the button below to connect your spotify account.
              </p>

              <button
                className="btn mt-6"
                onClick={() => this.handleSpotifyConnect() }
              >
                <FaSpotify /> Click to Connect your Spotify Account
              </button>
            </div>
          </div>

          <div id="step2" className={'bg-blue step ' + (this.state.step === 2 ? "active" : "inactive")}>
            <h2 className="step-title">
              2. Choose a playlist
            </h2>
            <div className="step-content">
              { this.state.playlists.length > 0 &&
                <div className="flex flex-wrap">
                  {
                    this.state.playlists.map(function(playlist, index) {
                      return (
                        <div key={index} className="w-full md:w-1/2 lg:w-1/3" onClick={() => this.handlePlaylistClick(playlist)}>
                          <div className="m-2 flex bg-white rounded overflow-hidden border-grey-light text-left">
                            <div className="h-24 w-24 overflow-hidden">
                              <img src={playlist.images[0].url} alt={playlist.name} onError={this.handleBrokenImage}/>
                            </div>
                            <div className="p-4 flex flex-col justify-between">
                              <div>
                                <div className="text-black font-bold text-l mb-2">{playlist.name}</div>
                              </div>
                              <div className="flex items-center">
                                <div className="text-sm">
                                  <p className="text-grey-darkest">Owner: {playlist.owner.display_name}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                      )
                    }, this)
                  }
                </div>
              }
            </div>
          </div>

          <div id="step3" className={'bg-blue-dark step ' + (this.state.step === 3 ? "active" : "inactive")}>
            <h2 className="step-title">
              3. Choose a Song
            </h2>
            <div className="step-content">
              { this.state.playlistSelected &&
                <div>
                  <p className="leading-loose">
                    You have selected : {this.state.playlistSelected.name}
                  </p>
                  <div className="flex">
                    <div className="w-1/2">
                      { this.state.video &&
                        <div className="fixed">
                          { this.state.video.snippet.title }
                          <YouTube
                            videoId={this.state.video.id.videoId}
                            opts={{
                              width: 300,
                              height: 200,
                            }}
                          />
                        </div>
                      }
                    </div>
                    <div className="w-1/2">
                      {
                        this.state.playlistSelectedTracks && this.state.playlistSelectedTracks.map(function(track, index) {
                          return (
                            <div className="pb-10" key={index} onClick={() => this.youtubeSearch(track)}>
                              <div>{track.track.name}</div>
                              <div>
                              {
                                track.track.artists.map(function(artist, index) {
                                  return (
                                    <div key={index}>{artist.name}</div>
                                  )
                                },this)
                              }
                              </div>
                            </div>
                          )
                        }, this)
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

        </div>
      </Layout>
    );
  }
}
