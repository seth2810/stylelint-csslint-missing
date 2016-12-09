const rules = require('./rules');

const rulesPlugins = rules.map((rule) => rule.register());

module.exports = rulesPlugins;
