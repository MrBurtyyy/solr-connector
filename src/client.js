import _ from "lodash";

import SolrQuery from "./query";
import { InvalidSolrOption } from "./errors";

class SolrClient {
  /**
   *
   * @param {String} host - The host of the Solr instance
   * @param {Number} port - The port of the Solr instance
   * @param {Object} [options] - Optional object containing additional options
   * @param {String} [options.transportMethod] - If Solr is running in HTTP/HTTPS
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
      this.options = { ...this.options, options };
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
   * Execute a SolrQuery using the SolrClient
   * @param {SolrQuery} queryObj
   */
  executeQuery(queryObj) {
    if (!(queryObj instanceof SolrQuery)) {
      throw new InvalidSolrOption("Parameter is not instance of SolrQuery");
    }
  }

  getOptions() {
    return this.options;
  }
}

export default SolrClient;
