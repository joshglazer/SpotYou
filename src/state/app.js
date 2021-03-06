import ReactGA from 'react-ga';

import { getPlaylists, getPlaylistTracks } from '../api/spotify';
import { search } from '../api/youtube';

const initialState = {
  step: 1,
  spotifyAccessToken: false,
  playlists: {},
  playlistSelected: null,
  playlistSelectedTracks: {},
  video: null,
};

ReactGA.initialize(process.env.GATSBY_GA_UA_ID);

const RESET = 'RESET';
const SET_STEP = 'SET_STEP';
const SPOTIFY_CONNECT = 'SPOTIFY_CONNECT';
const SPOTIFY_GET_PLAYLISTS = 'SPOTIFY_GET_PLAYLISTS';
const SPOTIFY_GET_PLAYLIST_TRACKS = 'SPOTIFY_GET_PLAYLIST_TRACKS';
const YOUTUBE_SEARCH = 'YOUTUBE_SEARCH';


export function reset() {
  return {
    type: RESET
  }
}

export function setStep(step, skipCheck=false) {
  return {
    type: SET_STEP,
    payload: {
      step,
      skipCheck
    }
  }
}

export function spotifyConnect(accessToken) {
  return {
    type: SPOTIFY_CONNECT,
    payload: accessToken
  }
}

export function spotifyGetPlaylists(accessToken) {
  return dispatch => {
    getPlaylists(accessToken).then((playlists) => {
      dispatch({
        type: SPOTIFY_GET_PLAYLISTS,
        payload: playlists
      });
    });
  }
}

export function spotifyGetPlaylistTracks(accessToken, playlist) {
  return dispatch => {
    getPlaylistTracks(accessToken, playlist.tracks.href).then((tracks) => {
      if (tracks.items) {
        ReactGA.event({
          category: 'Playlist',
          action: playlist.id,
          label: playlist.name,
        });
        dispatch({
          type: SPOTIFY_GET_PLAYLIST_TRACKS,
          payload: {
            playlist: playlist,
            tracks: tracks,
          }
        });
      }
    });
  }
}

export function youtubeSearch(track) {
  return dispatch => {

    let searchTerms = [track.track.name];

    let artistList = [];
    track.track.artists.map((artist) => {
      artistList.push(artist.name);
      return searchTerms.push(artist.name);
    })

    searchTerms.push("Official Music Video");

    search(searchTerms).then((data) => {
      if (data.items.length) {
        ReactGA.event({
          category: 'Song',
          action: track.track.id,
          label: `${track.track.name} - ${artistList.join(', ')}`,
        });

        dispatch({
          type: YOUTUBE_SEARCH,
          payload: data.items[0]
        });
      }
    });
  }
}


export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case RESET:
      return initialState;

    case SET_STEP:
      if (!payload.skipCheck && payload.step > state.step) {
        return state;
      } else {
        ReactGA.pageview(`Step ${payload.step}`);
        return {
          ...state,
          step: payload.step,
          video: state !== 3 ? null : state.video
        };
      }

    case SPOTIFY_CONNECT:
      return {
        ...state,
        spotifyAccessToken: payload,
      };

    case SPOTIFY_GET_PLAYLISTS:
      return {
        ...state,
        playlists: payload,
      };

    case SPOTIFY_GET_PLAYLIST_TRACKS:
      return {
        ...state,
        playlistSelected: payload.playlist,
        playlistSelectedTracks: payload.tracks,
      }

    case YOUTUBE_SEARCH:
      return {
        ...state,
        video: payload,
      }

    default:
      return state;
  }
};
