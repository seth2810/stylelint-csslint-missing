'use strict';

const path = require('path');
const stylelint = require('stylelint');
const namespace = require('./namespace');

module.exports = class Rule {
    constructor(rulePath) {
        this.ruleName = namespace(path.basename(rulePath, path.extname(rulePath)));
    }

    register(namespace) {
        return stylelint.createPlugin(this.ruleName, this.setup.bind(this));
    }

    complain(node, message, result) {
        return stylelint.utils.report({ ruleName: this.ruleName, node, message, result });
    }

    setup() {
        return this.run.bind(this);
    }

    run() {
        throw new Error('Not implemented');
    }
};
