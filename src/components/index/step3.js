import React, { Component } from 'react';
import { connect } from 'react-redux';

import { FaRedo } from 'react-icons/fa';
import ReactPlayer from 'react-player';
import Sticky from 'react-sticky-el';

import { stepClassName } from '../../helpers';
import { setStep, spotifyGetPlaylistTracks, youtubeSearch } from '../../state/app';

class Step3 extends Component {
  render() {
    return (
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
                  { this.props.video &&
                    <div>
                      <div className='mb-4'>
                        { this.props.video.snippet.title }
                      </div>
                      <Sticky>
                        <div className='player-wrapper'>
                          <ReactPlayer
                            className='react-player'
                            url={`https://www.youtube.com/watch?v=${this.props.video.id.videoId}`}
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
                        <div className="bg-white rounded overflow-hidden border-grey-light text-left text-black p-4 m-2 cursor-pointer" key={index} onClick={() => this.props.youtubeSearch(track)}>
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
                      This playlist does not have any tracks.  Add some and click refresh below.
                    </div>
                  }
                  <button className="btn text-xl mt-6" onClick={() => this.props.spotifyGetPlaylistTracks(this.props.spotifyAccessToken, this.props.playlistSelected)}>
                    <FaRedo className="align-middle" /> Refresh
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    step: state.app.step,
    spotifyAccessToken: state.app.spotifyAccessToken,
    playlistSelected: state.app.playlistSelected,
    playlistSelectedTracks: state.app.playlistSelectedTracks,
    video: state.app.video,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setStep: (step, skipCheck) => { dispatch(setStep(step, skipCheck)) },
    youtubeSearch: (track) => { dispatch(youtubeSearch(track)) },
    spotifyGetPlaylistTracks: (accessToken, playlist) => { dispatch(spotifyGetPlaylistTracks(accessToken, playlist)) }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Step3);
