import React, { Component } from 'react';
import { connect } from 'react-redux';

import { handleBrokenImage, stepClassName } from '../../helpers';
import { setStep } from '../../state/app';
import { spotifyGetPlaylistTracks } from '../../state/app';

class Step2 extends Component {

  componentDidUpdate(prevProps, prevState) {
    // only update chart if the data has changed
    if (this.props.playlistSelected && prevProps.playlistSelected !== this.props.playlistSelected) {
      this.props.setStep(3, true);
    }
  }

  render() {
    return (
      <div id="step2" className={'bg-blue step ' + stepClassName(2, this.props.step)}>
        <h2 className="step-title" onClick={() => this.props.setStep(2)}>
          2. Choose a playlist
        </h2>
        <div className="step-content">
          { this.props.playlists.length > 0 &&
            <div className="flex flex-wrap">
              <p className='w-full text-xl mb-4'>
                Click on one of your playlists to watch music videos for the tracks on that playlist.
              </p>
              {
                this.props.playlists.map(function(playlist, index) {
                  return (
                    <div key={index} className="w-full md:w-1/2 lg:w-1/3 cursor-pointer" onClick={() => this.props.spotifyGetPlaylistTracks(this.props.spotifyAccessToken, playlist)}>
                      <div className="m-2 flex bg-white rounded overflow-hidden border-grey-light text-left">
                        <div className="h-24 w-24 overflow-hidden flex-no-shrink">
                          <img src={(playlist.images.length && playlist.images[0].url)} alt={playlist.name} onError={handleBrokenImage}/>
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
          { this.props.playlists.length === 0 &&
            <div>
              You have not followed or created any playlists.  Go follow one and come back.
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
    playlists: state.app.playlists,
    playlistSelected: state.app.playlistSelected
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setStep: (step, skipCheck) => { dispatch(setStep(step, skipCheck)) },
    spotifyGetPlaylistTracks: (accessToken, playlist) => { dispatch(spotifyGetPlaylistTracks(accessToken, playlist)) }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Step2);
