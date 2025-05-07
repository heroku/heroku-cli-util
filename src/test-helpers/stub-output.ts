import * as sinon from 'sinon'

let stdoutWriteStub: sinon.SinonStub
let stdoutOutput = ''
let stderrWriteStub: sinon.SinonStub
let stderrOutput = ''

export function setupStdoutStderr() {
  stdoutOutput = ''
  stdoutWriteStub = sinon.stub(process.stdout, 'write').callsFake((str: Uint8Array | string) => {
    stdoutOutput += str.toString()
    return true
  })
  stderrOutput = ''
  stderrWriteStub = sinon.stub(process.stderr, 'write').callsFake((str: Uint8Array | string) => {
    stderrOutput += str.toString()
    return true
  })
}

export function restoreStdoutStderr() {
  stdoutWriteStub.restore()
  stdoutOutput = ''
  stderrWriteStub.restore()
  stderrOutput = ''
}

export function stdout() {
  return stdoutOutput
}

export function stderr() {
  return stderrOutput
}
