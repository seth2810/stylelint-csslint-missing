'use strict';

const SelectorParser = require('postcss-selector-parser');
const Rule = require('../lib/rule');

module.exports = class UnqualifiedAttributes extends Rule {

    run(root, result) {
        root.walkRules((rule) => {
            this.checkRule(rule, result);
        });
    }

    checkRule(rule, result) {
        const selectorParser = SelectorParser((selector) => {
            selector.walkAttributes((node) => this.checkAttribute(node, rule, result));
        });

        selectorParser.process(rule.selector);
    }

    checkAttribute(node, rule, result) {
        const parts = node.parent.nodes.filter((node) => node.type !== 'combinator');
        const pos = parts.indexOf(node);

        if (pos === 0 || parts[pos - 1].value === '*') {
            this.complain(
                rule,
                'Unqualified attribute selectors are known to be slow.',
                result
            );
        }
    }
}
