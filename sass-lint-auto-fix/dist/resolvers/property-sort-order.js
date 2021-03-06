"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_resolver_1 = require("./base-resolver");
const sassLintHelpers = require('sass-lint/lib/helpers');
const gonzales = require('gonzales-pe-sl');
var SortOrderMethod;
(function (SortOrderMethod) {
    SortOrderMethod["RECESS"] = "recess";
    SortOrderMethod["SMACSS"] = "smacss";
    SortOrderMethod["CONCENTRIC"] = "concentric";
})(SortOrderMethod || (SortOrderMethod = {}));
class PropertySortOrder extends base_resolver_1.default {
    fix() {
        const producedOutput = this.ast.toString().split('\n');
        this.ast.traverseByType('block', (block) => {
            // Fix - if block is empty - do not attempt to sort properties.
            if (block.content.length === 0) {
                return;
            }
            const collectedDecl = [];
            const matchingIndices = [];
            block.forEach('declaration', (declaration, index) => {
                const prop = declaration.first('property');
                if (prop) {
                    let nodeContainingName = prop.first('ident');
                    // If the top level ident doesn't exist, we look for a nested variable ident instead
                    if (!nodeContainingName) {
                        const firstVariableNode = prop.first('variable');
                        if (firstVariableNode) {
                            nodeContainingName = firstVariableNode.first('ident');
                        }
                    }
                    if (nodeContainingName) {
                        const variable = prop.first('variable');
                        collectedDecl.push({
                            name: nodeContainingName.toString(),
                            node: declaration,
                            type: variable !== null ? 'variable' : 'property',
                        });
                        matchingIndices.push(index);
                    }
                }
            });
            if (this.parser.options.order === 'alphabetical') {
                collectedDecl.sort((p, c) => {
                    const endsEarlyOnVariablePrioritization = this.shouldEndEarly(p, c);
                    if (endsEarlyOnVariablePrioritization !== null) {
                        return endsEarlyOnVariablePrioritization;
                    }
                    return p.name.localeCompare(c.name);
                });
            }
            else {
                collectedDecl.sort((p, c) => {
                    const { order } = this.parser.options;
                    const priorities = this.getOrderConfig(order) || order || [];
                    // addresses special cases when sorting variables
                    // give priority to variables
                    // sorting variables based on same metrics solves issue
                    // with replacing property declarations
                    const endsEarlyOnVariablePrioritization = this.shouldEndEarly(p, c);
                    if (endsEarlyOnVariablePrioritization !== null) {
                        return endsEarlyOnVariablePrioritization;
                    }
                    if (priorities.indexOf(p.name) === -1) {
                        return 1;
                    }
                    if (priorities.indexOf(c.name) === -1) {
                        return -1;
                    }
                    return priorities.indexOf(p.name) - priorities.indexOf(c.name);
                });
            }
            const blockOffset = block.content[0].start.line - 1;
            const stagedBlock = block.toString().split('\n');
            collectedDecl.forEach(({ node }) => {
                const matchingIndex = matchingIndices.shift() || 0;
                const discoveredBlock = block.content[matchingIndex];
                const fromLine = node.start.line - 1;
                const toLine = discoveredBlock.start.line - 1;
                producedOutput[toLine] = stagedBlock[fromLine - blockOffset];
            });
        });
        return gonzales.parse(producedOutput.join('\n'), {
            syntax: this.ast.syntax,
        });
    }
    getOrderConfig(order) {
        if (this.orderPresets[order] !== undefined) {
            const filename = this.orderPresets[order];
            const orderConfig = sassLintHelpers.loadConfigFile(`property-sort-orders/${filename}`);
            return orderConfig.order;
        }
        return null;
    }
    shouldEndEarly(a, b) {
        if (a.type === 'variable' && b.type !== 'variable') {
            return -1;
        }
        else if (a.type !== 'variable' && b.type === 'variable') {
            return 1;
        }
        return null;
    }
    get orderPresets() {
        return {
            recess: 'recess.yml',
            smacss: 'smacss.yml',
            concentric: 'concentric.yml',
        };
    }
}
exports.default = PropertySortOrder;
