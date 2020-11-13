export interface MutexInterface {
    lock(): Promise<number>

    release(): void

    isLocked(): boolean

    lockSize(): number

    releaseAll(): void

}