"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_resolver_1 = require("./base-resolver");
class HexNotation extends base_resolver_1.default {
    constructor(ast, parser) {
        super(ast, parser);
        this._letterRegex = /[a-z]/i;
    }
    fix() {
        const { ast } = this;
        ast.traverseByType('color', (colorNode) => {
            const content = colorNode.content.toString();
            if (content.match(this._letterRegex)) {
                if (this.shouldBeUppercase()) {
                    colorNode.content = content.toUpperCase();
                }
                else if (this.shouldBeLowercase()) {
                    colorNode.content = content.toLowerCase();
                }
            }
        });
        return ast;
    }
    shouldBeUppercase() {
        return this.parser.options.style === 'uppercase';
    }
    shouldBeLowercase() {
        return this.parser.options.style === 'lowercase';
    }
}
exports.default = HexNotation;
