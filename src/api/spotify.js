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
  let data = await makeApiCall(accessToken, playlistsUrl);
  data.defaults = false;
  // this is the result of a bad access token
  if (!data.items) {
    return {}
  }

  // if the user does not have any playlists, show them a few defaults
  if (data.items.length === 0) {
    data.defaults = true;
    const defaultPlaylistIDs = [
      '37i9dQZF1DX6Rl8uES4jYu',
      '37i9dQZF1DX7KNKjOK0o75',
      '37i9dQZF1DXbTxeAdrVG2l'
    ];
    data.items = await Promise.all(defaultPlaylistIDs.map(async function(defaultPlaylistID, index) {
      const defaultPlaylistUrl = `https://api.spotify.com/v1/playlists/${defaultPlaylistID}`;
      const defaultPlaylistData = await makeApiCall(accessToken, defaultPlaylistUrl);
      return defaultPlaylistData;
    })).then(function(defaultPlaylistData) {
      return defaultPlaylistData;
    });
  }
  return data;
}

export async function getPlaylistTracks(accessToken, playlistUrl) {
  const data = await makeApiCall(accessToken, playlistUrl);
  data.defaults = false;
  // this is the result of a bad access token
  if (!data.items) {
    return {}
  }

  // if the user does not have any playlists, show them a few defaults
  if (data.items.length === 0) {
    data.defaults = true;
    const defaultTrackIDs = [
      '7hQJA50XrCWABAu5v6QZ4i',
      '4CbUtLtAcgLJ7mAIeooJS8',
      '0lnxrQAd9ZxbhBBe7d8FO8'
    ];
    const defaultTracksUrl = `https://api.spotify.com/v1/tracks?ids=${defaultTrackIDs.join()}`;
    const defaultTracksData = await makeApiCall(accessToken, defaultTracksUrl);
    defaultTracksData.tracks.map(function(track) {
      data.items.push({
        'track': track
      })
      return true;
    })
  }
  return data;
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
