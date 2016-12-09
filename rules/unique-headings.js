'use strict';

const SelectorParser = require('postcss-selector-parser');
const Rule = require('../lib/rule');

module.exports = class UniqueHeadings extends Rule {

    run(root, result) {
        this._counters = { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 };

        root.walkRules((rule) => {
            this.checkRule(rule, result);
        });
    }

    checkRule(rule, result) {
        const selectorParser = SelectorParser((selector) => {
            selector.walkTags((node) => this.checkTag(node, rule, result));
        });

        selectorParser.process(rule.selector);
    }

    checkTag(node, rule, result) {
        if (/(h[1-6])/i.test(node.value)) {
            const selector = node.parent.toString();

            // tag inside
            if (selector.indexOf(':') === -1) {
                this._counters[RegExp.$1]++;

                if (this._counters[RegExp.$1] > 1) {
                    this.complain(
                        rule,
                        `Heading (${node.value}) has already been defined.`,
                        result
                    );
                }
            }
        }
    }
}
