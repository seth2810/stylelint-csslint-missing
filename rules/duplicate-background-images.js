'use strict';

const valueParser = require('postcss-value-parser');
const Rule = require('../lib/rule');

module.exports = class DuplicateBackgroundImages extends Rule {

    run(root, result) {
        const stack = {};

        root.walkDecls(/background/i, (decl) => {
            this.checkDeclaration(decl, stack, result);
        });
    }

    checkDeclaration(declaration, stack, result) {
        const parsed = valueParser(declaration.value);

        parsed.walk((node) => {
            if (node.type === 'function' &&
                node.value.toLowerCase() === 'url' &&
                node.nodes.length > 0) {

                const uri = valueParser.stringify(node.nodes);
                const stacked = stack[uri];

                if (typeof stacked === 'undefined') {
                    stack[uri] = declaration;
                } else {
                    const source = stacked.source.start;

                    this.complain(
                        declaration,
                        `Background image '${uri}' was used multiple times, first declared at line ${source.line}, col ${source.column}.`,
                        result
                    );
                }
            }
        })
    }
}
