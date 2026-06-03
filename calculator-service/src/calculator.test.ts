import { calculate, CalculatorError, Operator } from './calculator';

describe('calculate', () => {
  test('adds two numbers', () => {
    expect(calculate(1, 2, '+')).toBe(3);
  });

  test('subtracts two numbers', () => {
    expect(calculate(5, 2, '-')).toBe(3);
  });

  test('multiplies two numbers', () => {
    expect(calculate(3, 4, '*')).toBe(12);
  });

  test('divides two numbers', () => {
    expect(calculate(6, 2, '/')).toBe(3);
  });

  test('throws CalculatorError on division by zero', () => {
    expect(() => calculate(5, 0, '/')).toThrow(CalculatorError);
    expect(() => calculate(5, 0, '/')).toThrow('Division by zero');
  });

  test('throws CalculatorError for an invalid operator', () => {
    // Use a type assertion to force an invalid operator for testing
    expect(() => calculate(1, 1, 'x' as Operator)).toThrow(CalculatorError);
    expect(() => calculate(1, 1, 'x' as Operator)).toThrow('Invalid operator: x');
  });
});