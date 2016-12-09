'use strict';

const Rule = require('../lib/rule');

module.exports = class VendorPrefix extends Rule {
    setup(properties) {
        this._properties = properties;
        return super.setup();
    }

    run(root, result) {
        root.walk((rule) => {
            if (rule.type === 'rule') {
                if (rule.nodes && rule.nodes.length > 0) {
                    this.checkRule(rule, result);
                }
            }
        });
    }

    checkRule(rule, result) {
        // filter only declaration nodes
        const nodes = rule.nodes.filter((node) => node.type === 'decl');
        const properties = nodes.map((node) => node.prop);

        nodes.forEach((node, pos) => {
            const standard = this._properties[properties[pos]];

            if (standard) {
                const spos = properties.indexOf(standard);

                if (spos === -1) {
                    this.complain(
                        node,
                        `Missing standard property '${standard}' to go along with '${properties[pos]}'.`,
                        result
                    );
                } else if (spos < pos) {
                    // make sure standard property is last
                    this.complain(
                        node,
                        `Standard property '${standard}' should come after vendor-prefixed property '${properties[pos]}'.`,
                        result
                    );
                }
            }
        });
    }
}
