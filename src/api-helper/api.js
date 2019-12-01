import axios from 'axios';

export function getData(db) {
  return axios.get('http://localhost:5000/' + db + '/')
    .then(res => res.data);
}
export function getDataFromId(db, id) {
  return axios.get('http://localhost:5000/' + db + '/' + id)
    .then(res => res.data);
}
export function postData(db, postObject, windowUrl) {
  axios.post('http://localhost:5000/' + db + '/add', postObject)
    .then(res => console.log(res.data));
  window.location = windowUrl;
}
export function updateData(db, id, updateObject, windowUrl) {
  axios.post('http://localhost:5000/' + db + '/update/' + id, updateObject)
    .then(res => console.log(res.data));
  window.location = windowUrl;
}
