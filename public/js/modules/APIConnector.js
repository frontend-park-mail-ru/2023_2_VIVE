'use strict';

import HTTPError from './HTTPError.js';

const REQUEST_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

const MODES = {
  SAME_ORIGIN: 'same-origin',
  NO_CORS: 'no-cors',
  CORS: 'cors',
  NAVIGATE: 'navigate',
  WEBSOCKET: 'websocket',
};

const REQUEST_HEADERS = {
  'Content-Type': 'application/json; charset=UTF-8',
};

/**
 * Module for connecting frontend with backend.
 * Provides sending requests to the server using fetch library.
 * @module APIConnector
 * 
 * Usage:
 * ```js
 * APIConnector
    .get('example.com')
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.error(err));
 * ```
 */
export default {
  /**
   * Makes HTTP GET-request to url.
   * Returns Response if HTTP status is 200-299 and without network problems.
   *
   * @param {string} url A string to set request's url.
   * @throws Will throw an error if HTTP status is not 200-299
   * or when network error occurs.
   * @returns {Response} A response from HTTP GET-request.
   */
  async get(url) {
    return this._sendRequest({ url });
  },

  /**
   * Makes HTTP POST-request to url.
   * Returns Response if HTTP status is 200-299 and without network problems.
   *
   * @param {string} url A string to set request's url.
   * @param {object} data An object to set request's body.
   * @throws Will throw an error if HTTP status is not 200-299
   * or when network error occurs.
   * @returns {Response} A response from HTTP POST-request.
   */
  async post(url, data) {
    return this._sendRequest({
      url,
      method: REQUEST_METHODS.POST,
      body: JSON.stringify(data),
    });
  },

  /**
   * Makes HTTP PUT-request to url.
   * Returns Response if HTTP status is 200-299 and without network problems.
   *
   * @param {string} url A string to set request's url.
   * @param {object} data An object to set request's body.
   * @throws Will throw an error if HTTP status is not 200-299
   * or when network error occurs.
   * @returns {Response} A response from HTTP PUT-request.
   */
  async put(url, data) {
    return this._sendRequest({
      url,
      method: REQUEST_METHODS.PUT,
      body: JSON.stringify(data),
    });
  },

  /**
   * Makes HTTP PATCH-request to url.
   * Returns Response if HTTP status is 200-299 and without network problems.
   *
   * @param {string} url A string to set request's url.
   * @param {object} data An object to set request's body.
   * @throws Will throw an error if HTTP status is not 200-299
   * or when network error occurs.
   * @returns {Response} A response from HTTP PUT-request.
   */
  async patch(url, data) {
    return this._sendRequest({
      url,
      method: REQUEST_METHODS.PATCH,
      body: JSON.stringify(data),
    });
  },

  /**
   * Makes HTTP DELETE-request to url.
   * Returns Response if HTTP status is 200-299 and without network problems.
   *
   * @param {string} url A string to set request's url.
   * @throws Will throw an error if HTTP status is not 200-299
   * or when network error occurs.
   * @returns {Response} A response from HTTP PUT-request.
   */
  async delete(url) {
    return this._sendRequest({ url, method: REQUEST_METHODS.DELETE });
  },

  /**
   * Makes HTTP request to url.
   * Returns Response if HTTP status is 200-299 and without network problems.
   * Throws an error otherwise.
   *
   * @param {string} url A string to set request's url.
   * @param {REQUEST_METHODS} [method=REQUEST_METHODS.GET] A string to set request's method.
   * @param {REQUEST_METHODS} [headers=REQUEST_HEADERS] Any headers to add to your request.
   * @param {string} [body=null] A stringfied json to set request's body.
   * @param {MODES} [mode=MODES.CORS] The mode to use for the request.
   * @throws Will throw an error if HTTP status is not 200-299
   * or when network error occurs.
   * @returns {Response} A response from HTTP request.
   */
  async _sendRequest({
    url,
    method = REQUEST_METHODS.GET,
    headers = REQUEST_HEADERS,
    body = null,
    mode = MODES.CORS,
    credentials = 'include',
  }) {
    let response;
    try {
      response = await fetch(url, {
        method: method,
        headers: headers,
        body: body,
        mode: mode,
        credentials: credentials,
      });

      response.headers.forEach(console.log);
      if (!response.ok) {
        console.log('not ok');
        const csrf_token = response.headers.get('X-Csrf-Token')
        if (csrf_token) {
          console.log(csrf_token);
        } else {
          const httpError = new HTTPError('', response.status);
          httpError.statusCode = response.status;
          throw httpError;
        }
      }

      return response;
    } catch (error) {
      const networkError = new Error(`network error: ${error.message}`);
      networkError.status = error;
      throw networkError;
    }
  },
};
