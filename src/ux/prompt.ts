import inquirer from 'inquirer'

type PromptOptions = {
  default?: string
  required?: boolean
  type?: string
}

export async function prompt(name: string, options?: PromptOptions): Promise<string> {
  const {answer} = await (inquirer as any).prompt([{
    default: options?.default,
    message: name,
    name: 'answer',
    type: options?.type ?? 'input',
    validate: options?.required ? (input: string) => input.length > 0 || 'This field is required' : undefined,
  }])
  return answer
}
