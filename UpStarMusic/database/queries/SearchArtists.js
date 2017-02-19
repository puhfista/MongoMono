const Artist = require('../models/artist');

const buildQuery = (criteria) => {
  const criteriaCompiled = {};
  console.log(criteria);

  if (criteria.age) {
    criteriaCompiled.age = { $lte: criteria.age.max, $gte: criteria.age.min };
  }

  if (criteria.yearsActive) {
    criteriaCompiled.yearsActive = { $lte: criteria.yearsActive.max, $gte: criteria.yearsActive.min };
  }

  if (criteria.name) {
    criteriaCompiled.$text = { $search: criteria.name };
  }

  return criteriaCompiled;
}

/**
 * Searches through the Artist collection
 * @param {object} criteria An object with a name, age, and yearsActive
 * @param {string} sortProperty The property to sort the results by
 * @param {integer} offset How many records to skip in the result set
 * @param {integer} limit How many records to return in the result set
 * @return {promise} A promise that resolves with the artists, count, offset, and limit
 */
module.exports = (criteria, sortProperty, offset = 0, limit = 20) => {
  const sort = {};
  sort[sortProperty] = 1;

  const query = Artist
    .find(buildQuery(criteria))
    .sort(sort)
    .skip(offset)
    .limit(limit);

  return Promise.all([query, Artist
    .find(buildQuery(criteria)).count()])
    .then(results => {
      return {
        all: results[0],
        count: results[1],
        offset,
        limit,
      }
    });
};
