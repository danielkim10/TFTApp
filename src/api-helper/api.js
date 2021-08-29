import axios from 'axios';

export function getData(db) {
  return axios.get('http://localhost:5000/' + db + '/')
    .then(res => res.data);
}
export function getDataFromId(db, id) {
  return axios.get('http://localhost:5000/' + db + '/' + id)
    .then(res => res.data);
}
export function getDataFromName(db, name) {
  return axios.get('http://localhost:5000/' + db + '/name/' + name)
    .then(res => res.data[0]);
}
export function getSetData(db, set) {
  return axios.get('http://localhost:5000/' + db + '/set/' + set)
    .then(res => res.data);
}

export function postData(db, postObject, windowUrl) {
  axios.post('http://localhost:5000/' + db + '/add', postObject)
    .then(res => console.log(res.data));
    if (windowUrl !== "")
      window.location = windowUrl;
}
export function updateData(db, id, updateObject, windowUrl) {
  axios.post('http://localhost:5000/' + db + '/update/' + id, updateObject)
    .then(res => console.log(res.data));
    if (windowUrl !== "")
      window.location = windowUrl;
}

export const errorHandler = (status) => {
  switch(status) {
    case 400:
      return '400 Bad Request: A parameter is invalid or not provided.';
    case 401:
      return '401 Unauthorized: An API Key must be included with the request. Visit https://developer.riotgames.com/ to learn more.';
    case 403:
      return '403 Forbidden: The API Key is invalid, blacklisted or the request path is incorrect. Visit https://developer.riotgames.com/ to learn more.';
    case 404:
      return '404 Not Found: Summoner with name was not found in this region.';
    case 415:
      return '415 Unsupported Media Type.';
    case 429:
      return '429 Rate Limit Exceeded: Please wait before making more API requests.';
    case 500:
      return '500 Internal Server Error: An unexpected error occurred.';
    case 503:
      return '503 Service Unavailable: Service temporarily unavailable.';
    default:
      return 'Unknown error occurred';
  }
}
