import {ux} from '@oclif/core'
import {createPromptModule} from 'inquirer'

const prompt = createPromptModule()

export type PromptInputs<T> = {
  /**
   * default value to offer to the user.  Will be used if the user does not respond within the timeout period.
   */
  defaultAnswer?: T;
  /** after this many ms, the prompt will time out.  If a default value is provided, the default will be used.  Otherwise the prompt will throw an error */
  ms?: number;
};

export const confirm = async (message: string, {
  defaultAnswer = false,
  ms = 10_000,
}: PromptInputs<boolean> = {}): Promise<boolean> => {
  let timeoutId: NodeJS.Timeout | undefined

  const promptPromise = prompt([{
    default: defaultAnswer,
    message,
    name: 'answer',
    type: 'confirm',
  }]).then(({answer}: {answer: boolean}) => {
    if (timeoutId) clearTimeout(timeoutId)
    return answer
  })

  const timeoutPromise = new Promise<boolean>((resolve, reject) => {
    timeoutId = setTimeout(() => {
      if (defaultAnswer === undefined) {
        reject(ux.error('Prompt timed out'))
      } else {
        // Force the process to continue with the default answer
        process.stdin.push(null)
        // Clean up stdin
        process.stdin.pause()
        resolve(defaultAnswer)
      }
    }, ms)
  })

  try {
    return await Promise.race([promptPromise, timeoutPromise])
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
}
