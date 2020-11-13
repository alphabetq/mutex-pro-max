"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        this._noOfLocks--;
        this.attemptExecute();
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
            }
            this.attemptExecute();
        }
    }
}
exports.default = MutexQueue;
//# sourceMappingURL=Queue.js.map