export function authorizeUrl(location) {
  const clientID = process.env.GATSBY_SPOTIFY_API_KEY;
  // Remove fragment from current url, in case there's a bad access token attached
  const redirectUri = location.href.match(/(^[^#]*)/)[0];
  const scope = 'playlist-read-private';
  const authorizeUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token`
  return authorizeUrl;
}

export async function getPlaylists(accessToken) {
  const playlistsUrl = 'https://api.spotify.com/v1/me/playlists';
  const data = await makeApiCall(accessToken, playlistsUrl);
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
  .then((response) => response.json())
  .then((responseData) => {
    return responseData;
  })
}
