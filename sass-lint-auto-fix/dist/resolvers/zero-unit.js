"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_resolver_1 = require("./base-resolver");
class ZeroUnit extends base_resolver_1.default {
    constructor(ast, parser) {
        super(ast, parser);
        this._unitsRegex = /(em|ex|ch|rem|vh|vw|vmin|vmax|px|mm|cm|in|pt|pc|%)/g;
    }
    fix() {
        const { ast, parser } = this;
        if (parser.options.include) {
            // end early, user should specify units.
            return ast;
        }
        ast.traverseByType('number', (item, i, parent) => {
            if (parent.is('dimension')) {
                const nextNode = parent.content[i + 1] || {};
                if (item.content === '0' && nextNode.type === 'ident') {
                    if (nextNode.content.match(this._unitsRegex)) {
                        parent.removeChild(i + 1);
                    }
                }
            }
        });
        return ast;
    }
}
exports.default = ZeroUnit;
