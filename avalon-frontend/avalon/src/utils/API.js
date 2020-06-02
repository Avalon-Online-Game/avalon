import axios from 'axios';

const baseUrl = __DEV__ ? 'http://localhost:8000/api/v1/' : 'https://avalongame.ir/api/v1/';
export default axios.create({
  baseURL: 'https://avalongame.ir/api/v1/',
  responseType: 'json',
});
