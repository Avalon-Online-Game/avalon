import axios from 'axios';

const baseUrl = __DEV__ ? 'http://localhost:8000/api/v1/' : 'https://avalongame.ir/api/v1/';
console.log(baseUrl)
export default axios.create({
  baseURL: baseUrl,
  responseType: 'json',
});
