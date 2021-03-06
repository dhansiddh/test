"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_resolver_1 = require("./base-resolver");
class SpaceBeforeColon extends base_resolver_1.default {
    fix() {
        const { ast, parser } = this;
        const include = parser.options.include;
        ast.traverseByTypes(['propertyDelimiter', 'operator'], (delimiter, i, parent) => {
            if (delimiter.content === ':') {
                const previous = parent.content[i - 1] || {};
                if (previous.type === 'space') {
                    if (!include) {
                        // no space allowed
                        parent.content.splice(i - 1, 1);
                    }
                }
                else if (include) {
                    previous.content += ' ';
                }
            }
        });
        return ast;
    }
}
exports.default = SpaceBeforeColon;
