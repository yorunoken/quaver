const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.sqlite");

/**
 * @typedef {('get' | 'run')} QueryType
 */

/**
 * Performs a query based on the provided parameters.
 * @param {Object} options - The query options.
 * @param {string} options.query - The query string.
 * @param {Object} options.parameters - The query parameters.
 * @param {QueryType} options.type - The type of query. Can be 'get' or 'run'.
 * @returns {Promise} - A promise that resolves with the query result.
 */
async function query({ query, parameters, type }) {
  return new Promise((resolve, reject) => {
    const callback = (err, res) => {
      if (err) {
        reject(err);
        return;
      }

      if (type === "run") {
        resolve("done");
        return;
      }

      if (res) {
        resolve(JSON.parse(res.value));
      } else {
        resolve(null);
      }
    };

    if (parameters) {
      db[type](query, parameters, callback);
    } else {
      db[type](query, callback);
    }
  });
}
module.exports = {
  query,
};
