import axios from 'axios';

export default axios.create({
  baseURL: 'https://avalongame.ir/api/v1/',
  responseType: 'json',
});
