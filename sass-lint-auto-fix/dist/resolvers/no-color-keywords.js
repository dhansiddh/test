"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_resolver_1 = require("./base-resolver");
const slHelpers = require('sass-lint/lib/helpers');
class NoColorKeywords extends base_resolver_1.default {
    constructor(ast, parser) {
        super(ast, parser);
        this._cssColors = slHelpers
            .loadConfigFile('../../data/literals.yml')
            .split(' ');
    }
    fix() {
        this.ast.traverseByType('value', (valueNode) => {
            valueNode.traverseByType('ident', (identNode, index, identParent) => {
                if (this.isValidParent(identParent)) {
                    const colorIndex = this.colorKeywordIndex(identNode);
                    if (colorIndex > -1) {
                        const sibling = identParent.get(index + 1);
                        if (sibling !== null) {
                            // Sibling type arguments makes identNode the function name
                            if (sibling.type === 'arguments') {
                                return;
                            }
                        }
                        identNode.content = `#${this._cssColors[1 + colorIndex]}`;
                    }
                }
            });
        });
        return this.ast;
    }
    colorKeywordIndex(node) {
        return this._cssColors.indexOf(node.content.toLowerCase());
    }
    isValidParent(parentNode) {
        if (parentNode) {
            if (['function', 'variable', 'customProperty'].some(prop => parentNode.is(prop))) {
                return false;
            }
        }
        return true;
    }
}
exports.default = NoColorKeywords;
