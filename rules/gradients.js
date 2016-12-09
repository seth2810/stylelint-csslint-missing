'use strict';

const Rule = require('../lib/rule');

module.exports = class Gradients extends Rule {

    run(root, result) {
        root.walkRules((rule) => {
            if (rule.nodes && rule.nodes.length > 0) {
                this.checkRule(rule, result);
            }
        });
    }

    checkRule(rule, result) {
        const gradients = { moz: 0, webkit: 0, oldWebkit: 0, o: 0 };

        rule.walkDecls((node) => {
            const value = node.value;

            if (/-(moz|o|webkit)(?:-(?:linear|radial))-gradient/i.test(value)){
                gradients[RegExp.$1] = 1;
            } else if (/-webkit-gradient/i.test(value)){
                gradients.oldWebkit = 1;
            }
        })

        const missing = this.getMissingGradients(gradients);

        if (missing.length && missing.length < 4){
            this.complain(
                rule,
                `Missing vendor-prefixed CSS gradients for ${missing}.`,
                result
            );
        }
    }

    getMissingGradients(gradients) {
        const missing = [];

        if (!gradients.moz){
            missing.push("Firefox 3.6+");
        }

        if (!gradients.webkit){
            missing.push("Webkit (Safari 5+, Chrome)");
        }

        if (!gradients.oldWebkit){
            missing.push("Old Webkit (Safari 4+, Chrome)");
        }

        if (!gradients.o){
            missing.push("Opera 11.1+");
        }

        return missing;
    }
}
