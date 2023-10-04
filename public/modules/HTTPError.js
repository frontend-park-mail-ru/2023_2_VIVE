'use strict';

import STATUS_CODES from './statusCodes.js';

/**
 * Class representing an HTTP error.
 *
 * @class
 * @extends Error
 */
class HTTPError extends Error {
  /**
   * Create an HTTP error.
   *
   * @param {number} statusCode Status code of HTTP error.
   * @param {string} [message=null] Message of HTTP error.
   */
  constructor(statusCode, message = null) {
    if (statusCode in STATUS_CODES) {
      super(message || STATUS_CODES[statusCode]);
      this.statusCode = statusCode;
      this.name = statusCode.toString();
    } else {
      super('Uknown HTTPError');
      this.statusCode = 0;
      this.name = '0';
    }
  }
}

export default HTTPError;
