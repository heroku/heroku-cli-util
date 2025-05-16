import inquirer from 'inquirer'

export async function prompt(name: string, options?: {default?: string; required?: boolean; type?: string}): Promise<string> {
  const {answer} = await (inquirer as any).prompt([{
    default: options?.default,
    message: name,
    name: 'answer',
    type: 'input',
    validate: options?.required ? (input: string) => input.length > 0 || 'This field is required' : undefined,
  }])
  return answer
}
