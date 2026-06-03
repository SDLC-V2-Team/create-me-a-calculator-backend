import request from 'supertest';
import app from './server';
import { calculate, CalculatorError } from './calculator';

jest.mock('./calculator');

describe('POST /calculate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('happy path: valid operands and operator returns result', async () => {
    (calculate as jest.Mock).mockReturnValue(10);
    const response = await request(app)
      .post('/calculate')
      .send({ operand1: 4, operand2: 6, operator: '+' });
    expect(response.status).toBe(200);
    expect(response.body.result).toBe(10);
    expect(calculate).toHaveBeenCalledWith(4, 6, '+');
  });

  test('edge case: calculator error (division by zero) returns 400 with error message', async () => {
    (calculate as jest.Mock).mockImplementation(() => {
      throw new CalculatorError('Division by zero is not allowed');
    });
    const response = await request(app)
      .post('/calculate')
      .send({ operand1: 5, operand2: 0, operator: '/' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Division by zero is not allowed');
  });

  test('error path: missing operand1 in body returns 400', async () => {
    const response = await request(app)
      .post('/calculate')
      .send({ operand2: 2, operator: '+' });
    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/Invalid request body/);
  });

  test('error path: operand1 not a number returns 400', async () => {
    const response = await request(app)
      .post('/calculate')
      .send({ operand1: 'abc', operand2: 2, operator: '+' });
    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/Invalid request body/);
  });

  test('error path: calculate throws unexpected error returns 500', async () => {
    (calculate as jest.Mock).mockImplementation(() => {
      throw new Error('Unexpected');
    });
    const response = await request(app)
      .post('/calculate')
      .send({ operand1: 1, operand2: 2, operator: '+' });
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Internal server error');
  });
});

describe('GET /health', () => {
  test('returns status ok', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});