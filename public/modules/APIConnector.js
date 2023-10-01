'use strict';

const REQUEST_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

const REQUEST_HEADERS = {
  'Content-Type': 'application/json; charset=UTF-8',
};

/**
 * Module for connecting frontend with backend.
 * Provides sending requests to the server using fetch library.
 * @module APIConnector
 */
export default {
  async get(url) {
    return await this._sendRequest(url);
  },

  async post(url, data) {
    return await this._sendRequest(
      url,
      REQUEST_METHODS.POST,
      JSON.stringify(data)
    );
  },

  async put(url, data) {
    return await this._sendRequest(
      url,
      REQUEST_METHODS.PUT,
      JSON.stringify(data)
    );
  },

  async patch(url, data) {
    return await this._sendRequest(
      url,
      REQUEST_METHODS.PATCH,
      JSON.stringify(data)
    );
  },

  async delete(url) {
    return await this._sendRequest(url, REQUEST_METHODS.DELETE);
  },

  async _sendRequest(url, method = REQUEST_METHODS.GET, body = null) {
    let response = await fetch(url, {
      method: method,
      headers: REQUEST_HEADERS,
      body: body,
    });

    if (response.ok) {
      return response;
    } else {
      throw new Error('Server error: ' + response.status);
    }
  },
};
