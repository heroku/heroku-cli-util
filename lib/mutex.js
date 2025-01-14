'use strict'

// Adapted from https://blog.jcoglan.com/2016/07/12/mutexes-and-javascript/

const Mutex = function () {
  this._busy = false
  this._queue = []
}

Mutex.prototype.synchronize = function (task) {
  const self = this

  return new Promise(function (resolve, reject) {
    self._queue.push([task, resolve, reject])
    if (!self._busy) {
      self._dequeue()
    }
  })
}

Mutex.prototype._dequeue = function () {
  this._busy = true
  const next = this._queue.shift()

  if (next) {
    this._execute(next)
  } else {
    this._busy = false
  }
}

Mutex.prototype._execute = function (record) {
  const [task, resolve, reject] = record
  const self = this

  task().then(resolve, reject).then(function () {
    self._dequeue()
  })
}

module.exports = Mutex
