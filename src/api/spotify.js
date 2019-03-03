import { toast } from 'react-toastify';

import { reset } from '../state/app';
import { store } from '../state/reduxWrapper';

export function authorizeUrl(location) {
  const clientID = process.env.GATSBY_SPOTIFY_API_KEY;
  // Remove fragment from current url, in case there's a bad access token attached
  const redirectUri = `${location.href.match(/(^[^#?]*)/)[0]}connect/`;
  const scope = 'playlist-read-private';
  return `https://accounts.spotify.com/authorize?client_id=${clientID}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token`
}

export async function getPlaylists(accessToken) {
  const playlistsUrl = 'https://api.spotify.com/v1/me/playlists';
  const data = await makeApiCall(accessToken, playlistsUrl);

  // this is the result of a bad access token
  if (!data.items) {
    return []
  }

  // if the user does not have any playlists, show them a few defaults
  if (data.items.length === 0) {
    const defaultPlaylistIDs = [
      '37i9dQZF1DX6Rl8uES4jYu',
      '37i9dQZF1DX7KNKjOK0o75',
      '37i9dQZF1DXbTxeAdrVG2l'
    ];
    data.items = Promise.all(defaultPlaylistIDs.map(async function(defaultPlaylistID, index) {
      const defaultPlaylistUrl = `https://api.spotify.com/v1/playlists/${defaultPlaylistID}`;
      const defaultPlaylistData = await makeApiCall(accessToken, defaultPlaylistUrl);
      return defaultPlaylistData;
    })).then(function(defaultPlaylistData) {
      return defaultPlaylistData;
    });
  }
  return data.items;
}

export async function getPlaylistTracks(accessToken, playlistUrl) {
  const data = await makeApiCall(accessToken, playlistUrl);
  return data.items;
}

async function makeApiCall(accessToken, url) {
  return fetch(url, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  })
  .then((response) => {
    if (!response.ok) {
      toast.warn('Uh Oh! Your connection to spotify has expired. Please reconnect and try again!');
      store.dispatch(reset());
    }
    return response.json()
  }).then((responseData) => {
    return responseData;
  });
}
