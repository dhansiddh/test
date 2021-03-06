"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_resolver_1 = require("./base-resolver");
class SpaceAfterBang extends base_resolver_1.default {
    constructor(ast, parser) {
        super(ast, parser);
        this._noSpaceAfterBang = /!\b/;
        this._spaceAfterBang = /!\s\b/;
    }
    fix() {
        const { ast } = this;
        ast.traverseByTypes(['important', 'default', 'global', 'optional'], (node) => {
            const value = node.content;
            if (this.shouldAddSpaceAfterBang(value)) {
                node.content = this.injectSpaceAfterBang(value);
            }
            else if (this.shouldRemoveSpaceAfterBang(value)) {
                node.content = this.removeSpaceAfterBang(value);
            }
        });
        return ast;
    }
    injectSpaceAfterBang(value) {
        return value.replace(this._noSpaceAfterBang, '! ');
    }
    shouldAddSpaceAfterBang(value) {
        return (this.parser.options.include &&
            value.match(this._noSpaceAfterBang) !== null);
    }
    removeSpaceAfterBang(value) {
        return value.replace(this._spaceAfterBang, '!');
    }
    shouldRemoveSpaceAfterBang(value) {
        return (!this.parser.options.include && value.match(this._spaceAfterBang) !== null);
    }
}
exports.default = SpaceAfterBang;
