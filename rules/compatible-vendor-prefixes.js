'use strict';

const Rule = require('../lib/rule');

module.exports = class CompatibleVendorPrefixes extends Rule {
    setup(properties) {
        this._properties = Object.keys(properties).reverse();
        this._prefixes = this.applyPrefixes(properties);
        this._variations = this.getVariations();
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

    applyPrefixes(properties) {
        return this._properties.reduce((memo, property) => {
            const prefixes = properties[property].split(' ');
            memo[property] = prefixes.map((prefix) => `-${prefix}-${property}`);
            return memo;
        }, {});
    }

    getVariations() {
        return this._properties.reduce((memo, property) => {
            Array.prototype.push.apply(memo, this._prefixes[property]);
            return memo;
        }, []);
    }

    checkRule(rule, result) {
        const properties = rule.nodes.reduce((properties, node) => {
            if (node.type === 'decl' && this._variations.indexOf(node.prop) !== -1) {
                properties.push(node.prop);
            }

            return properties;
        }, []);

        const missingProperties = this.getMissingProperties(properties);

        Object.keys(missingProperties).forEach((property) => {
            this.complain(
                rule,
                `The property ${property} is compatible with ${missingProperties[property]} and should be included as well.`,
                result
            );
        });
    }

    getMissingProperties(properties) {
        const groups = this._properties.reduce((groups, name) => {
            var i = 0;

            while (i < properties.length) {
                if (properties[i].indexOf(name) === -1) {
                    i += 1;
                } else {
                    groups[name] = groups[name] || [];
                    groups[name].push(properties[i]);
                    properties.splice(i, 1);
                }
            }

            return groups;
        }, {});

        return Object.keys(groups).reduce((missing, property) => {
            const full = this._prefixes[property];
            const actual = groups[property];

            if (full.length > actual.length) {
                missing[property] = full.filter((name) => actual.indexOf(name) === -1);
            }

            return missing;
        }, {});
    }
};
