import _ from "lodash";
import axios from "axios";

import SolrQuery from "./query";
import { InvalidSolrOption } from "./errors";

class SolrClient {
  /**
   *
   * @param {String} host - The host of the Solr instance
   * @param {Number} port - The port of the Solr instance
   * @param {Object} [options] - Optional object containing additional options
   * @param {String} [options.transportMethod] - If Solr is running in HTTP/HTTPS
   * @param {Object} [options.auth] - Basic Authentication
   * @param {String} options.auth.username - Username for basic authentication
   * @param {String} options.auth.password - Password for basic authentication
   * @param {String} [options.collection] - The default collection for searching
   */
  constructor(host, port, options) {
    // Make sure the hostname is a string
    if (!_.isString(host)) {
      throw new InvalidSolrOption("Hostname must be a string");
    }

    // Check if port is a number, and if not check if the string can be converted to a number
    let number;
    if (!_.isNumber(port)) {
      number = _.toNumber(port);
      if (!number) {
        throw new InvalidSolrOption("Port must be a number");
      }
    } else {
      number = port;
    }

    this.host = host;
    this.port = number;

    this.options = {
      transportMethod: "http"
    };

    if (options) {
      this.options = _.merge(this.options, options);
    }
  }

  /**
   * Constant for HTTP traffic
   */
  static get HTTP() {
    return "http";
  }

  /**
   * Constant for HTTPS traffic
   */
  static get HTTPS() {
    return "https";
  }

  /**
   * Creates a new query object and returns it.
   * @returns Instance of SolrQuery
   */
  createQuery() {
    return new SolrQuery();
  }

  /**
   * Generates a Base64 encoded string used for basic authentication
   * @param {String} username - The username
   * @param {String} password - The password
   */
  generateBasicAuthentication(username, password) {
    const unencoded = `${username}:${password}`;
    const buffered = Buffer.from(unencoded);
    const base64Data = buffered.toString("base64");
    return `Basic ${base64Data}`;
  }

  /**
   * Execute a SolrQuery using the SolrClient
   * @param {SolrQuery} queryObj
   * @param {String} [collection] - The collection specified
   */
  executeQuery(queryObj, collection) {
    if (!(queryObj instanceof SolrQuery)) {
      throw new InvalidSolrOption("Parameter is not instance of SolrQuery");
    }

    const coll = collection ? collection : this.options.collection;

    const requestOptions = {};
    if (_.has(this.options, "auth")) {
      // Check to make sure we have a username and password
      const { username, password } = this.options.auth;
      if (!_.isEqual(username, "") && !_.isEqual(password, "")) {
        const base64Data = this.generateBasicAuthentication(username, password);
        _.set(requestOptions, "headers", {
          ...requestOptions.headers,
          Authorization: `${base64Data}`
        });
      }
    }

    const querystring = queryObj.createQueryString();
    const requestUrl = `${this.options.transportMethod}://${this.host}:${
      this.port
    }/solr/${coll}/select?${querystring}`;

    const request = this.doRequest(requestUrl, requestOptions);
    const thePromise = new Promise((resolve, reject) => {
      request
        .then(response => {
          resolve(response.data);
        })
        .catch(err => {
          const { error } = err.response.data;
          reject(
            `Failed to get data from Solr (status ${err.response.status}): ${
              error.msg
            }`
          );
        });
    });

    return thePromise;
  }

  doRequest(url, options) {
    return axios.get(url, options);
  }

  getOptions() {
    return this.options;
  }
}

export default SolrClient;
