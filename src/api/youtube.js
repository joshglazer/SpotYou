const key = 'AIzaSyAhpRahc4Q9gdQX5IwN4cCZ2vxC2VEgYCQ';

export async function search(searchTerm) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=${key}&q=${searchTerm}`;
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
