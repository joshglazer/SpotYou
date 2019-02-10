const key = process.env.GATSBY_YOUTUBE_API_KEY;

export async function search(searchTerm) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&key=${key}&q=${searchTerm}`;
  const data = await makeApiCall(url);
  return data;
}

async function makeApiCall(url) {
  return fetch(url, {
    method: 'get',
  })
  .then((response) => response.json())
  .then((responseData) => {
    return responseData;
  })
}
