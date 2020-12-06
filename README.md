
## mutex-pro-max

Queue with multi lock mutex.


## Installation

```sh
npm install mutex-pro-max
```

## Usage

#### .queueSize()

Returns: `number`\
Returns the remaining length of queues.

#### .enqueue

Type: `fn()`\
Adds functions to the current queue to be executed later in a FIFO order.

#### .clearQueue()

Empties the current queue.

#### .lock()

Lock the current queue until `.release()` is called to release the lock.\
_Note: The size of `.lock()` is propotional to `.release()`'s, `.release()` is needed to called as many times as `.lock()` in order to execute._


#### .release()

Releases the current queue.

#### .isLocked()

Returns: `boolean`\
Returns the state of the current queue.

#### .lockSize()

Returns: `number`\
Returns the size of `.lock()`


#### .releaseAll()

Releases all `.lock()`
