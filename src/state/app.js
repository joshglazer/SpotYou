//import {getPlaylists} from '../api/spotify';

const initialState = {
  spotifyAccessToken: false,
  spotifyPlaylists: [],
};

const SPOTIFY_CONNECT = 'SPOTIFY_CONNECT';

export const spotifyConnect = accessToken => ({ type: SPOTIFY_CONNECT, payload: accessToken });

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SPOTIFY_CONNECT:
      //const playlists = await getPlaylists(payload);
      return {
        ...state,
        spotifyAccessToken: payload,
        //spotifyPlaylists: playlists
      };
    default:
      return state;
  }
};
