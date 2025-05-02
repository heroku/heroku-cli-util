import { expect } from 'chai';
import { wait } from '../../../src/ux/wait'

describe('wait', () => {
  it('should actually wait for at least the specified period of time', async () => {
    const duration = 200
    const start = Date.now()
    await wait(duration)
    const elapsed = Date.now() - start
    // Allow a small margin for timing inaccuracy
    expect(elapsed).to.be.at.least(duration - 10)
    expect(elapsed).to.be.at.most(duration + 10)
  });
}); 
