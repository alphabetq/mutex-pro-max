"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutexQueue = void 0;
class MutexQueue {
    constructor() {
        this._queue = [];
        this._noOfLocks = 0;
    }
    // #region queue
    queueSize() {
        return this._queue.length;
    }
    enqueue(run) {
        this._queue.push({ run });
        this.attemptExecute();
    }
    clearQueue() {
        this._queue = [];
    }
    //#endregion
    // #region mutex
    lock() {
        this._noOfLocks++;
        return;
    }
    release() {
        if (this.isLocked()) {
            this._noOfLocks--;
            this.attemptExecute();
            return;
        }
        throw new Error(`Expect to lock() before release() is called, current lock size is ${this.lockSize()}`);
    }
    isLocked() {
        if (this.lockSize() == 0) {
            return false;
        }
        return true;
    }
    lockSize() {
        return this._noOfLocks;
    }
    releaseAll() {
        this._noOfLocks = 0;
    }
    // #endregion
    dequeue() {
        let next = this._queue.shift();
        return next.run;
    }
    attemptExecute() {
        if (!this.isLocked()) {
            let next = this.dequeue();
            if (next) {
                next();
                this.attemptExecute();
            }
        }
    }
    add(fn) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise(() => {
                const run = () => __awaiter(this, void 0, void 0, function* () {
                    try {
                        yield Promise.resolve(fn());
                    }
                    catch (e) {
                        throw new Error(e);
                    }
                });
                this.enqueue(run);
                this.attemptExecute();
            });
        });
    }
}
exports.MutexQueue = MutexQueue;
module.exports = MutexQueue;
//# sourceMappingURL=index.js.map