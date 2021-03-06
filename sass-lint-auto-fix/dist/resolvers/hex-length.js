"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_resolver_1 = require("./base-resolver");
class HexLength extends base_resolver_1.default {
    constructor(ast, parser) {
        super(ast, parser);
        this._lengths = {
            short: 3,
            long: 6,
        };
    }
    fix() {
        const { ast } = this;
        ast.traverseByType('color', (node) => {
            const colorValue = node.content;
            if (this.shouldShorten(colorValue)) {
                node.content = this.transformLongToShort(colorValue);
            }
            else if (this.shouldLengthen(colorValue)) {
                node.content = this.transformShortToLong(colorValue);
            }
        });
        return ast;
    }
    shouldShorten(hex) {
        return this.parser.options.style === 'short' && this.canShorten(hex);
    }
    shouldLengthen(hex) {
        return (this.parser.options.style === 'long' && hex.length === this._lengths.short);
    }
    canShorten(hex) {
        return (hex.length === this._lengths.long &&
            hex[0] === hex[1] &&
            hex[2] === hex[3] &&
            hex[4] === hex[5]);
    }
    transformLongToShort(hex) {
        return [0, 2, 4].reduce((acc, idx) => acc + hex[idx], '');
    }
    transformShortToLong(hex) {
        return hex.split('').reduce((acc, c) => acc + c + c, '');
    }
}
exports.default = HexLength;
