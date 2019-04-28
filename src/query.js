import _ from "lodash";
import querystring from "query-string";

const QUERY_KEY = "q";
const FILTER_QUERY_KEY = "fq";
const NUMBER_OF_ROWS_KEY = "rows";

export default class SolrQuery {
  constructor() {
    this.queryString = {
      q: "*:*",
      wt: "json",
      rows: 10
    };
  }

  /**
   * Set the query parameter of the Solr query
   * @param {String|Array<String>} query
   * @retuns Instance of SolrQuery
   */
  withQuery(query) {
    this.setParameter(QUERY_KEY, query);
    return this;
  }

  /**
   * Add a filter query to the Solr query
   * @param {String|Array<String>}
   */
  withFilterQuery(filterQuery) {
    this.addValueToParams(FILTER_QUERY_KEY, filterQuery);
    return this;
  }

  /**
   *
   * @param {Number} numberOfRows
   */
  setRows(numberOfRows) {
    this.setParameter(NUMBER_OF_ROWS_KEY, numberOfRows);
    return this;
  }

  /**
   * Set the value of a parameter to a specific value
   * @param {String} key
   * @param {*} value
   */
  setParameter(key, value) {
    _.set(this.queryString, key, value);
  }

  /**
   * Add a value to a parameter of the Solr query.  Adds the value to the array is more than one value.
   * @param {String} key
   * @param {*} value
   */
  addValueToParams(key, value) {
    /**
     * Check if the main querystring object already has an object (user may want more than one query object)
     */
    if (_.has(this.queryString, key)) {
      let curValue = _.get(this.queryString, key);
      if (!_.isArray(curValue)) {
        _.set(this.queryString, key, [curValue, value]);
      } else {
        _.set(this.queryString, key, [...curValue, value]);
      }
    } else {
      _.set(this.queryString, key, value);
    }
  }

  /**
   * Returns the current parameters in an object
   */
  getOptions() {
    return this.queryString;
  }

  createQueryString() {
    return querystring.stringify(this.queryString);
  }
}
