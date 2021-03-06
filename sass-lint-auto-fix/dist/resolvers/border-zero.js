"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_resolver_1 = require("./base-resolver");
class BorderZero extends base_resolver_1.default {
    constructor(ast, parser) {
        super(ast, parser);
        this._borders = [
            'border',
            'border-top',
            'border-right',
            'border-bottom',
            'border-left',
        ];
        this.convention = this.parser.options.convention;
        this._allowedConventions = ['0', 'none'];
    }
    fix() {
        return this.traverse((node) => (node.content = this.convention));
    }
    traverse(callback) {
        this.ast.traverseByType('declaration', (decl) => {
            let isBorder = false;
            decl.traverse((item) => {
                if (item.type === 'property') {
                    item.traverse((childNode) => {
                        if (this.borders.indexOf(childNode.content) !== -1) {
                            isBorder = true;
                        }
                    });
                }
                if (isBorder) {
                    if (item.type === 'value') {
                        const node = item.content[0];
                        if (node.type === 'number' || node.type === 'ident') {
                            if (this.allowedConventions.includes(node.content)) {
                                callback(item);
                            }
                        }
                    }
                }
                return item;
            });
        });
        return this.ast;
    }
    get borders() {
        return this._borders;
    }
    get allowedConventions() {
        return this._allowedConventions;
    }
}
exports.default = BorderZero;
