"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-console */
const chalk_1 = require("chalk");
class Logger {
    constructor(config = {}) {
        this._verbose = console.log;
        this._warn = console.log;
        this._debug = console.log;
        this._error = console.error;
        this.silentEnabled = config.silentEnabled || false;
        this.debugEnabled = config.debugEnabled || false;
        this.padding = config.padding || 10;
    }
    pad(str) {
        return str + ' '.repeat(Math.max(0, this.padding - str.length));
    }
    verbose(tag, ...terms) {
        if (!this.silentEnabled) {
            this._verbose(chalk_1.default.green(this.pad(`@${tag}`)), ...terms);
        }
    }
    debug(...terms) {
        if (this.debugEnabled) {
            this._debug(...terms);
        }
    }
    warn(tag, ...terms) {
        if (!this.silentEnabled) {
            this._warn(chalk_1.default.red(this.pad(`@${tag}`)), ...terms);
        }
    }
    error(error) {
        this._error(error);
    }
}
function createLogger(config = {}) {
    return new Logger(config);
}
exports.createLogger = createLogger;
