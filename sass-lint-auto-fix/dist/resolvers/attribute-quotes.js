"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_resolver_1 = require("./base-resolver");
class AttributeQuotes extends base_resolver_1.default {
    constructor(ast, rule) {
        super(ast, rule);
        this._quotePattern = /("|')((?:\\.|[^"\\])*)("|')/;
    }
    fix() {
        return this.traverse((item) => {
            const { content } = item.content[0];
            if (this.shouldRemoveQuotes(item)) {
                item.content[0].content = content.replace(this.quotePattern, '$2');
            }
            else if (this.shouldAddQuotes(item)) {
                item.content[0].content = content.replace(/(.*)/, `"$1"`);
            }
        });
    }
    shouldRemoveQuotes(item) {
        return item.content[0].is('string') && !this.parser.options.include;
    }
    shouldAddQuotes(item) {
        return item.content[0].is('ident') && this.parser.options.include;
    }
    traverse(callback) {
        this.ast.traverseByType('attributeValue', callback);
        return this.ast;
    }
    get quotePattern() {
        return this._quotePattern;
    }
}
exports.default = AttributeQuotes;
