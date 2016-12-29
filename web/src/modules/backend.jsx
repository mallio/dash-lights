import axios from 'axios';
import apiConfig from '../../../config/api.json';

/**
 * Handles calls to the Node backend that controls the dash buttons and
 * stores the configuration
 */
const backend = {
  _ajax: axios.create({baseURL: `http://${apiConfig.backend.server}:${apiConfig.backend.port}`}),

  api(method, url, data) {
    return this._ajax({method, url, data});
  },

  newButton(data) {
    return this.api('post', '/buttons/new', data);
  },

  buttons(data) {
    return this.api(data ? 'post' : 'get', '/buttons', data);
  }
}

export default backend;
