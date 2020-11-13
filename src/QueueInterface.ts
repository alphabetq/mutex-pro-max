export type RunFunction = () => Promise<unknown>;

export interface QueueInterface<Func> {
    queueSize(): number

    enqueue: (run: Func) => void

    clearQueue(): void
}
