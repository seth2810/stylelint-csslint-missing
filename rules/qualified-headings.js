'use strict';

const SelectorParser = require('postcss-selector-parser');
const Rule = require('../lib/rule');

module.exports = class QualifiedHeadings extends Rule {

    run(root, result) {
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
        if (/h[1-6]/.test(node.value) && node.sourceIndex > 0) {
            this.complain(
                rule,
                `Heading (${node.value}) should not be qualified.`,
                result
            );
        }
    }
}
