import axios from 'axios';

export default axios.create({
  baseURL: 'http://194.5.193.231:8000/api/v1/',
  responseType: 'json',
});
