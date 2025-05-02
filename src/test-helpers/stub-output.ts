import * as sinon from 'sinon'

let stdoutWriteStub: sinon.SinonStub
let stdoutOutput = ''
let stderrWriteStub: sinon.SinonStub
let stderrOutput = ''

beforeEach(function () {
  stdoutOutput = ''
  stdoutWriteStub = sinon.stub(process.stdout, 'write').callsFake((str: string | Uint8Array) => {
    stdoutOutput += str.toString()
    return true;
  })
  stderrOutput = ''
  stderrWriteStub = sinon.stub(process.stderr, 'write').callsFake((str: string | Uint8Array) => {
    stderrOutput += str.toString()
    return true;
  })
})

afterEach(function () {
  stdoutWriteStub.restore()
  stdoutOutput = ''
  stderrWriteStub.restore()
  stderrOutput = ''
})

export function stdout() {
  return stdoutOutput
}

export function stderr() {
  return stderrOutput
} 
