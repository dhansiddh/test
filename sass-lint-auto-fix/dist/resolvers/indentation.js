"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_resolver_1 = require("./base-resolver");
const gonzales = require('gonzales-pe-sl');
class Indentation extends base_resolver_1.default {
    constructor(ast, parser) {
        super(ast, parser);
        this._depth = 0;
        this._openingBraceRegex = /{|\(/g;
        this._closingBraceRegex = /}|\)/g;
        this._atQueryDelimiter = '@';
        this._newLineDelimiter = '\n';
        this._commaDelimiter = ',';
        this._bumpNextLine = false;
    }
    fix() {
        const { ast } = this;
        if (ast.syntax === 'sass') {
            return ast; // TODO: Support sass files
        }
        const rawContent = ast.toString();
        const resolvedContent = rawContent
            .split(this._newLineDelimiter)
            .map(line => this.visit(line))
            .join(this._newLineDelimiter);
        const resolvedAst = gonzales.parse(resolvedContent, {
            syntax: ast.syntax,
        });
        return resolvedAst;
    }
    visit(line) {
        if (this.isEmpty(line)) {
            return line;
        }
        const openMatches = line.match(this._openingBraceRegex) || [];
        const closeMatches = line.match(this._closingBraceRegex) || [];
        if (closeMatches.length > openMatches.length) {
            this._depth = Math.max(this._depth - 1, 0);
        }
        let appliedDepth = this._depth;
        if (this.shouldBumpNextLine(line)) {
            appliedDepth += 1;
        }
        const resolvedLine = this.apply_indentation(line, appliedDepth);
        if (openMatches.length > closeMatches.length) {
            this._depth += 1;
        }
        return resolvedLine;
    }
    apply_indentation(line, depth) {
        return `${this._spacingUnit.repeat(depth * this.numSpaces)}${line.trimLeft()}`;
    }
    shouldBumpNextLine(line) {
        if (this._bumpNextLine) {
            const cachedState = this._bumpNextLine;
            this._bumpNextLine = this.blockStillOpen(line);
            return cachedState;
        }
        else {
            const cachedState = this._bumpNextLine;
            this._bumpNextLine = this.startsWithAt(line) && this.endsWithComma(line);
            return cachedState;
        }
    }
    blockStillOpen(line) {
        return !line.trimRight().endsWith('}');
    }
    startsWithAt(line) {
        return line.trimLeft().startsWith(this._atQueryDelimiter);
    }
    endsWithComma(line) {
        return line.trimRight().endsWith(this._commaDelimiter);
    }
    isEmpty(line) {
        return line.trim().length === 0;
    }
    tabEnabled() {
        return this.parser.options.size === 'tab';
    }
    get _spacingUnit() {
        return this.tabEnabled() ? '\t' : ' ';
    }
    get numSpaces() {
        return this.tabEnabled() ? 1 : this.parser.options.size;
    }
}
exports.default = Indentation;
