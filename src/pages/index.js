import React, { Component } from 'react'
import { connect } from 'react-redux'

import ReactGA from 'react-ga';
import ReactPlayer from 'react-player';
import Sticky from 'react-sticky-el';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import {search} from '../api/youtube';
import { stepClassName } from '../helpers';
import Layout from '../components/layout';
import Step1 from '../components/index/step1';
import Step2 from '../components/index/step2';
import { setStep, reset } from '../state/app';

class IndexPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      video: null,
    }
  }

  async componentDidMount() {
    ReactGA.initialize(process.env.GATSBY_GA_UA_ID);
    if (this.props.spotifyAccessToken) {
      if (this.props.spotifyAccessToken === 'error') {
        toast.warn('Uh Oh! It looks like you did not agree to allow us to access your Spotify account. Please try again and make sure you click the "Agree" button.');
      }
    } else {
      this.props.setStep(1, true);
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

  spotifyWarnToast() {
    toast.warn('Uh Oh! Your connection to spotify has expired. Please reconnect and try again!');
  }

  render() {
    return (
      <Layout>
        <div className="text-center flex flex-col flex-1">
          <Step1 />
          <Step2 />

          <div id="step3" className={'bg-blue-dark step ' + stepClassName(3, this.props.step)}>
            <h2 className="step-title" onClick={() => this.props.setStep(3)}>
              3. Choose a Song
            </h2>
            <div className="step-content">
              <p className='w-full mb-4 text-xl'>
                Click on a song to watch its music video.
                </p>
              { this.props.playlistSelected &&
                <div>
                  <div className="flex flex-wrap">
                    <div className="w-full md:w-1/2">
                      <p className="text-xl mb-4">
                        Selected Playlist: {this.props.playlistSelected.name}
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
                        this.props.playlistSelectedTracks && this.props.playlistSelectedTracks.map(function(track, index) {
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
                      { (this.props.playlistSelectedTracks && this.props.playlistSelectedTracks.length === 0) &&
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
    spotifyAccessToken: state.app.spotifyAccessToken,
    playlists: state.app.playlists,
    playlistSelected: state.app.playlistSelected,
    playlistSelectedTracks: state.app.playlistSelectedTracks,
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
