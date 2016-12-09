const fs = require('fs');
const path = require('path');
const files = fs.readdirSync(__dirname);

module.exports = files.reduce(function(rules, fileName) {
    const filePath = path.resolve(__dirname, fileName);

    if (filePath !== __filename) {
        const Rule = require(filePath);
        rules.push(new Rule(filePath));
    }

    return rules;
}, []);
