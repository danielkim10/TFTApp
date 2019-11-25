import axios from 'axios';

export function getData(db, dictionary, returnObject) {
  var url = 'http://localhost:5000/' + db + '/'
}
export function getDataFromId(db, id) {
  var response;
  axios.post('http://localhost:5000/' + db + '/' + id)
    .then(res => {
      response = res;
    });
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
