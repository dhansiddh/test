"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_resolver_1 = require("./base-resolver");
const gonzales = require('gonzales-pe-sl');
var TokenType;
(function (TokenType) {
    TokenType["NEWLINE"] = "\n";
    TokenType["OPEN"] = "{";
    TokenType["CLOSE"] = "}";
    TokenType["EMPTY"] = "";
    TokenType["COMMA"] = ",";
})(TokenType || (TokenType = {}));
class EmptyLineBetweenBlocks extends base_resolver_1.default {
    constructor(ast, parser) {
        super(ast, parser);
    }
    fix() {
        const { ast } = this;
        // TODO: Implement `fix` for sass
        if (ast.syntax === 'scss') {
            if (this.canInjectNewline()) {
                const content = ast.toString();
                const splitContent = content.split(TokenType.NEWLINE);
                const blocks = [];
                // Ordered set of token evaluators. Important that the ordering stayst the same
                const tokenEvaluationSet = [
                    line => (line.includes(TokenType.OPEN) ? TokenType.OPEN : null),
                    line => line.trimRight().endsWith(TokenType.COMMA) ? TokenType.OPEN : null,
                    line => (line.includes(TokenType.CLOSE) ? TokenType.CLOSE : null),
                ];
                splitContent.forEach((line, lineNumber) => {
                    tokenEvaluationSet.forEach(tokenEvaluator => {
                        const evaluationResult = tokenEvaluator(line);
                        if (evaluationResult !== null) {
                            blocks.push({
                                type: evaluationResult,
                                lineNumber: lineNumber + 1,
                            });
                        }
                    });
                    // push a newline per iteration of split content
                    blocks.push({
                        type: TokenType.NEWLINE,
                        lineNumber: lineNumber + 1,
                    });
                });
                const injectableBlocks = blocks.filter((block, index) => {
                    if (block.type === TokenType.CLOSE) {
                        if (this.shouldInjectNewline(blocks.slice(index + 1))) {
                            return true;
                        }
                    }
                    return false;
                });
                let numInjected = 0;
                injectableBlocks.forEach(({ lineNumber }) => splitContent.splice(lineNumber + numInjected++, 0, TokenType.EMPTY));
                const newTree = gonzales.parse(splitContent.join(TokenType.NEWLINE), {
                    syntax: 'scss',
                });
                return newTree;
            }
        }
        return ast;
    }
    shouldInjectNewline(blocks) {
        let c = 0;
        for (const block of blocks) {
            if (block.type === TokenType.NEWLINE) {
                c++;
            }
            else if (block.type === TokenType.OPEN) {
                return c < 2;
            }
        }
        return false;
    }
    canInjectNewline() {
        return (this.parser.options.include === true &&
            this.parser.options['allow-single-line-rulesets'] === true);
    }
}
exports.default = EmptyLineBetweenBlocks;
