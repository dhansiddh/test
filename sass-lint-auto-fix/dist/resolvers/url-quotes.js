"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_resolver_1 = require("./base-resolver");
class UrlQuotes extends base_resolver_1.default {
    constructor(ast, parser) {
        super(ast, parser);
        this._variableRegex = /^[\$]/;
    }
    fix() {
        const { ast } = this;
        ast.traverseByType('uri', (node) => {
            node.traverse(item => {
                if (item.is('raw')) {
                    if (!this.isVariable(item)) {
                        item.content = `'${item.content}'`;
                    }
                }
            });
        });
        return ast;
    }
    isVariable(item) {
        return item.content.match(this._variableRegex);
    }
}
exports.default = UrlQuotes;
