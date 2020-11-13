
import { QueueInterface, RunFunction } from './QueueInterface'
import { MutexInterface } from './MutexInterface'

export default class MutexQueue implements QueueInterface<RunFunction>, MutexInterface {

    private _queue: Array<{run: RunFunction}> = []
    private _noOfLocks: number = 0

    // #region queue
    queueSize(): number {
        return this._queue.length
    }

    enqueue(run: RunFunction): void {
        this._queue.push({ run })

        this.attemptExecute()

    }

    clearQueue(): void {
        this._queue = []
    }
    //#endregion

    // #region mutex
    lock(): Promise<number> {
        this._noOfLocks++
        return 
    }

    release(): void {
        this._noOfLocks--

        this.attemptExecute()
    }

    isLocked(): boolean {
        if (this.lockSize() == 0) {
            return false
        }

        return true
    }

    lockSize(): number {
        return this._noOfLocks
    }

    releaseAll(): void {
        this._noOfLocks = 0
    }
    // #endregion

    private dequeue(): RunFunction {
        let next = this._queue.shift()
        return next.run
    }

    private attemptExecute(): void {
        if (!this.isLocked()) {
            let next = this.dequeue()
            if (next) {
                next()
            }

            this.attemptExecute()
        }
    }
}