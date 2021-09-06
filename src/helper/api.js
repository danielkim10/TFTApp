import axios from 'axios';

export function getData(db) {
  return axios.get(`${process.env.REACT_APP_SERVER}` + db + '/')
    .then(res => res.data);
}
export function getDataFromId(db, id) {
  return axios.get(`${process.env.REACT_APP_SERVER}` + db + '/' + id)
    .then(res => res.data);
}

export function getSetData(db, set) {
  return axios.get(`${process.env.REACT_APP_SERVER}` + db + '/set/' + set)
    .then(res => res.data);
}

export function getDataFromDate(db, date) {
  return axios.get(`${process.env.REACT_APP_SERVER}` + db+ '/get/' + date)
    .then(res => res.data);
}

export function postData(db, postObject) {
  return axios.post(`${process.env.REACT_APP_SERVER}` + db + '/add', postObject)
    .then(res => res.data);
}
export function updateData(db, id, updateObject) {
  return axios.post(`${process.env.REACT_APP_SERVER}` + db + '/update/' + id, updateObject)
    .then(res => res.data);
}

export function deleteOldRateLimits(db) {
  return axios.post(`${process.env.REACT_APP_SERVER}` + db + '/delete')
    .then(res => res.data);
}

export function deleteTeams(db, deleteObject) {
  return axios.post(`${process.env.REACT_APP_SERVER}` + db + '/delete', deleteObject)
    .then(res => res.data);
}

export const checkRateLimit = async (callsObj) => {
  getDataFromDate('ratelimit', Date.now()).then(data => {
    if (data.length === 0) {
      let ratelimitObj = {dateFirst: Date.now(), dateNow: Date.now(), limitSecond: 20, limit2Minute: 100, remainingPerRegion: {
          'na1': {
              seconds: 20,
              minutes: 100,
          },
          'euw1': {
              seconds: 20,
              minutes: 100,
          },
          'americas': {
              seconds: 20,
              minutes: 100,
          },
          'europe': {
              seconds: 20,
              minutes: 100,
          },
      }};
      if (callsObj.platformCount > 100 || callsObj.regionCount > 100) {
        return -1;
      }

      ratelimitObj.remainingPerRegion[callsObj.platform].minutes -= callsObj.platformCount;
      ratelimitObj.remainingPerRegion[callsObj.region].minutes -= callsObj.regionCount;
      postData('ratelimit', ratelimitObj).then(res => {
        return 0;
      });
    }
    else {
        let ratelimitObj = Object.assign({}, data[0]);
        if (ratelimitObj.dateNow < Date.now() - 1000) {
          Object.keys(ratelimitObj.remainingPerRegion).forEach((key, index) => {
            ratelimitObj.remainingPerRegion[key].seconds = ratelimitObj.limitSecond;
          });
          ratelimitObj.dateNow = Date.now();
        }
        if (ratelimitObj.remainingPerRegion[callsObj.region].minutes <= callsObj.regionCount -1 || ratelimitObj.remainingPerRegion[callsObj.platform].minutes <= callsObj.platformCount -1) {
            return -1;
        }

        ratelimitObj.remainingPerRegion[callsObj.region].minutes -= callsObj.regionCount;
        ratelimitObj.remainingPerRegion[callsObj.platform].minutes -= callsObj.platformCount;
        ratelimitObj.dateNow = Date.now();

        updateData('ratelimit', ratelimitObj._id, ratelimitObj).then(res => {
          return 1;
        });
        return 3;
    }
    return 2;
  });

  deleteOldRateLimits('ratelimit').then(res => {
    return 0;
  });
  return 4;
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
      return 'Unknown error occurred. Try refreshing the page.';
  }
}
