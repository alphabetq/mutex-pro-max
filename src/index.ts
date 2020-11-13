
import { QueueInterface, RunFunction } from './QueueInterface'
import { MutexInterface } from './MutexInterface'

export class MutexQueue implements QueueInterface<RunFunction>, MutexInterface {

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
        if (this.isLocked()) {
            this._noOfLocks--

            this.attemptExecute()
            return
        }
        
        throw new Error(`Expect to lock() before release() is called, current lock size is ${this.lockSize()}`)
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

    dequeue(): RunFunction {
        let next = this._queue.shift()
        return next.run
    }

    private attemptExecute(): void {
        if (!this.isLocked()) {
            let next = this.dequeue()
            if (next) {
                next()
                this.attemptExecute()
            }
        }
    }

    async add<T>(fn: any): Promise<T> {
		return await new Promise<T>(() => {
			const run = async (): Promise<void> => {

				try {
					await Promise.resolve(fn())
                } 

                catch(e) {
					throw new Error(e)
				}
			}

			this.enqueue(run)
			this.attemptExecute()
		})
	}
}

module.exports = MutexQueue