const createNamespace = (prefix) => (name) => `${prefix}/${name}`;

module.exports = createNamespace('csslint');
