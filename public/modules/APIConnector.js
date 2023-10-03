'use strict';

import HTTPError from "./HTTPError.js";

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
    return this._sendRequest(url);
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
    return this._sendRequest(url, REQUEST_METHODS.POST, JSON.stringify(data));
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
    return this._sendRequest(url, REQUEST_METHODS.PUT, JSON.stringify(data));
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
    return this._sendRequest(url, REQUEST_METHODS.PATCH, JSON.stringify(data));
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
    return this._sendRequest(url, REQUEST_METHODS.DELETE);
  },

  /**
   * Makes HTTP request to url.
   * Returns Response if HTTP status is 200-299 and without network problems.
   * Throws an error otherwise.
   *
   * @param {string} url A string to set request's url.
   * @param {REQUEST_METHODS} [method=REQUEST_METHODS.GET] A string to set request's method.
   * @param {string} [body=null] A stringfied json to set request's body.
   * @throws Will throw an error if HTTP status is not 200-299 
   * or when network error occurs.
   * @returns {Response} A response from HTTP request.
   */
  async _sendRequest(url, method = REQUEST_METHODS.GET, body = null) {
    let response;
    try {
      response = await fetch(url, {
        method: method,
        headers: REQUEST_HEADERS,
        body: body,
      });
    } catch (error) {
      throw new Error(`network error: ${error.message}`);
    }

    if (!response.ok) {
      throw new HTTPError(response.status)
    }

    return response;
  },
};
