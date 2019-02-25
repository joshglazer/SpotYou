import React, { Component } from 'react'
import { connect } from 'react-redux'

import ReactGA from 'react-ga';
import ReactPlayer from 'react-player';
import Sticky from 'react-sticky-el';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import {getPlaylists, getPlaylistTracks} from '../api/spotify';
import {search} from '../api/youtube';
import { stepClassName } from '../helpers';
import Layout from '../components/layout';
import Step1 from '../components/index/step1';
import { setStep, reset } from '../state/app';

import logo from '../images/logo.png';

class IndexPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playlists: [],
      playlistSelected: null,
      playlistSelectedTracks: [],
      video: null,
    }
  }

  async componentDidMount() {
    ReactGA.initialize(process.env.GATSBY_GA_UA_ID);
    if (this.props.spotifyAccessToken) {
      if (this.props.spotifyAccessToken === 'error') {
        this.props.reset();
        toast.warn('Uh Oh! It looks like you did not agree to allow us to access your Spotify account. Please try again and make sure you click the "Agree" button.');
      } else {
        const playlists = await getPlaylists(this.props.spotifyAccessToken);
        if (playlists) {
          this.setState({
            playlists: playlists,
          });
          this.props.setStep(2, true);
        } else {
          this.props.setStep(1, true);
          this.spotifyWarnToast();
        }
      }
    } else {
      this.props.setStep(1, true);
    }
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
      this.props.setStep(3, true);
    } else {
      this.spotifyWarnToast();
      this.props.setStep(1, false)
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
        <div className="text-center flex flex-col flex-1">
          <Step1 />

          <div id="step2" className={'bg-blue step ' + stepClassName(2, this.props.step)}>
            <h2 className="step-title" onClick={() => this.props.setStep(2)}>
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

          <div id="step3" className={'bg-blue-dark step ' + stepClassName(3, this.props.step)}>
            <h2 className="step-title" onClick={() => this.props.setStep(3)}>
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
    step: state.app.step,
    spotifyAccessToken: state.app.spotifyAccessToken
  }
}

const mapDispatchToProps = dispatch => {
  return {
    reset: () => { dispatch(reset()) },
    setStep: (step, skipCheck) => { dispatch(setStep(step, skipCheck)) }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IndexPage);
