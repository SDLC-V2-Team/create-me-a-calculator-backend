export type Operator = '+' | '-' | '*' | '/';

export class CalculatorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CalculatorError';
  }
}

/**
 * Performs a basic arithmetic operation.
 * @param operand1 - First number
 * @param operand2 - Second number
 * @param operator - Arithmetic operator
 * @returns Result of the operation
 * @throws CalculatorError on invalid operator or division by zero
 */
export function calculate(operand1: number, operand2: number, operator: Operator): number {
  switch (operator) {
    case '+':
      return operand1 + operand2;
    case '-':
      return operand1 - operand2;
    case '*':
      return operand1 * operand2;
    case '/':
      if (operand2 === 0) {
        throw new CalculatorError('Division by zero');
      }
      return operand1 / operand2;
    default:
      throw new CalculatorError(`Invalid operator: ${operator}`);
  }
}
