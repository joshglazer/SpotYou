import React, { Component } from 'react'
import { connect } from 'react-redux'

import Layout from '../components/layout'
import SEO from '../components/seo'

import { FaSpotify } from 'react-icons/fa';
import queryString from 'query-string';
import ReactGA from 'react-ga';
import ReactPlayer from 'react-player';
import Sticky from 'react-sticky-el';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import {authorizeUrl, getPlaylists, getPlaylistTracks} from '../api/spotify';
import {search} from '../api/youtube';

import logo from '../images/logo.png'

class IndexPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 1,
      playlists: [],
      playlistSelected: null,
      playlistSelectedTracks: [],
      video: null,
    }

    this.handleSpotifyConnect = this.handleSpotifyConnect.bind(this);
    this.handlePlaylistClick = this.handlePlaylistClick.bind(this);

  }

  async componentDidMount() {
    ReactGA.initialize(process.env.GATSBY_GA_UA_ID);
    // handle Spotify authroization flow
    if (this.props.spotifyAccessToken) {
      const playlists = await getPlaylists(this.props.spotifyAccessToken);
      if (playlists) {
        this.setState({
          playlists: playlists,
        });
        this.setStep(2, true);
      } else {
        ReactGA.pageview('Step 1');
        this.spotifyWarnToast();
      }
    } else {
      ReactGA.pageview('Step 1');
    }
    const parsedQuery = queryString.parse(this.props.location.search);
    if (parsedQuery['error'] === 'access_denied') {
      toast.warn('Uh Oh! It looks like you did not agree to allow us to access your Spotify account. Please try again and make sure you click the "Agree" button.');
    }

  }

  setStep(step, skipCheck=false, resetMax=false) {
    if (!skipCheck && step > this.state.step) {
      return;
    } else {
      ReactGA.pageview(`Step ${step}`);
      window.scrollTo(0,0);
      this.setState({
        step: step,
      });
      if (step !== 3) {
        this.setState({
          video: null
        })
      }
    }
  }

  stepClassName(step) {
    if (step === this.state.step) {
      return "active";
    } else if (step <= this.state.step) {
      return "complete";
    } else {
      return "inactive";
    }
  }

  handleSpotifyConnect() {
    window.location.replace(authorizeUrl(this.props.location));
  }

  async handlePlaylistClick(playlist) {
    const tracks = await getPlaylistTracks(this.props.spotifyAccessToken, playlist.tracks.href);
    if (tracks) {
      ReactGA.event({
        category: 'Playlist',
        action: playlist.id,
        label: playlist.name,
      });
      this.setState({
        playlistSelected: playlist,
        playlistSelectedTracks: tracks,
      });
      this.setStep(3, true);
    } else {
      this.spotifyWarnToast();
      this.setStep(1, false, true)
    }
  }

  async youtubeSearch(track) {
    let searchTerms = [track.track.name];

    let artistList = [];
    track.track.artists.map((artist) => {
      artistList.push(artist.name);
      return searchTerms.push(artist.name);
    })

    searchTerms.push("Official Music Video");

    const data = await search(searchTerms);
    if (data.items.length) {
      ReactGA.event({
        category: 'Song',
        action: track.track.id,
        label: `${track.track.name} - ${artistList.join(', ')}`,
      });

      this.setState({
        video: data.items[0],
      })
    } else {
      toast.error("No videos were found.  Try a different one.");
    }
  }

  handleBrokenImage(event) {
    event.target.src = logo;
  }

  spotifyWarnToast() {
    toast.warn('Uh Oh! Your connection to spotify has expired. Please reconnect and try again!');
  }

  render() {
    return (
      <Layout>
        <SEO />
        <div className="text-center flex flex-col flex-1">

          <div id="step1" className={'bg-blue-light step ' + this.stepClassName(1)}>
            <h2 className="step-title" onClick={() => this.setStep(1)}>
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

              <button
                className="btn text-xl"
                onClick={() => this.handleSpotifyConnect() }
              >
                <FaSpotify /> Click to Connect your Spotify Account
              </button>
            </div>
          </div>

          <div id="step2" className={'bg-blue step ' + this.stepClassName(2)}>
            <h2 className="step-title" onClick={() => this.setStep(2)}>
              2. Choose a playlist
            </h2>
            <div className="step-content">
              { this.state.playlists.length > 0 &&
                <div className="flex flex-wrap">
                  <p className='w-full text-xl mb-4'>
                    Click on one of your playlists to watch some of it's music video.
                  </p>
                  {
                    this.state.playlists.map(function(playlist, index) {
                      return (
                        <div key={index} className="w-full md:w-1/2 lg:w-1/3 cursor-pointer" onClick={() => this.handlePlaylistClick(playlist)}>
                          <div className="m-2 flex bg-white rounded overflow-hidden border-grey-light text-left">
                            <div className="h-24 w-24 overflow-hidden flex-no-shrink">
                              <img src={(playlist.images.length && playlist.images[0].url) || logo} alt={playlist.name} onError={this.handleBrokenImage}/>
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
              { this.state.playlists.length === 0 &&
                <div>
                  You have not followed or created any playlists.  Go follow one and come back.
                </div>
              }
            </div>
          </div>

          <div id="step3" className={'bg-blue-dark step ' + this.stepClassName(3)}>
            <h2 className="step-title" onClick={() => this.setStep(3)}>
              3. Choose a Song
            </h2>
            <div className="step-content">
              <p className='w-full mb-4 text-xl'>
                Click on a song to watch it's music video.
                </p>
              { this.state.playlistSelected &&
                <div>
                  <div className="flex flex-wrap">
                    <div className="w-full md:w-1/2">
                      <p className="text-xl mb-4">
                        Selected Playlist: {this.state.playlistSelected.name}
                      </p>
                      { this.state.video &&
                        <div>
                          <div className='mb-4'>
                            { this.state.video.snippet.title }
                          </div>
                          <Sticky>
                            <div className='player-wrapper'>
                              <ReactPlayer
                                className='react-player'
                                url={`https://www.youtube.com/watch?v=${this.state.video.id.videoId}`}
                                controls
                                playing
                                width='100%'
                                height='100%'
                              />
                            </div>
                          </Sticky>
                        </div>
                      }
                    </div>
                    <div className="w-full md:w-1/2">
                      {
                        this.state.playlistSelectedTracks && this.state.playlistSelectedTracks.map(function(track, index) {
                          return (
                            <div className="bg-white rounded overflow-hidden border-grey-light text-left text-black p-4 m-2 cursor-pointer" key={index} onClick={() => this.youtubeSearch(track)}>
                              <div className="font-bold text-xl">{track.track.name}</div>
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
                      { (this.state.playlistSelectedTracks && this.state.playlistSelectedTracks.length === 0) &&
                        <div>
                          This playlist does not have any tracks.  Add some and come back.
                        </div>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

        </div>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange={false}
          draggable
          pauseOnHover={false}
        />
        <div className='sticky hidden'>
          This is needed so the .sticky class does not get purged from css
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    spotifyAccessToken: state.app.spotifyAccessToken
  }
}

export default connect(
  mapStateToProps
)(IndexPage);
