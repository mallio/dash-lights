import axios from 'axios';
import apiConfig from '../../../config/api.json';

/**
 * Handles calls to the Hue API
 */
const hue = {
  _ajax: axios.create({baseURL: `http://${apiConfig.hue.bridge}/api/${apiConfig.hue.username}`}),

  api(method, url, data) {
    return this._ajax({method, url, data});
  },

  lights() {
    return this.api('get', '/lights');
  },

  light(id) {
    return this.api('get', `/lights/${id}`);
  },

  groups() {
    return this.api('get', '/groups');
  },

  group(id, data) {
    return this.api(data ? 'put' : 'get', `/groups/${id}`, data);
  }
}

export default hue;
