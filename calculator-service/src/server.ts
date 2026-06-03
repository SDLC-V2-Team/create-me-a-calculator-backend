import express, { Request, Response } from 'express';
import cors from 'cors';
import { calculate, CalculatorError, Operator } from './calculator';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

interface CalculateRequest {
  operand1: number;
  operand2: number;
  operator: Operator;
}

app.post('/calculate', (req: Request, res: Response) => {
  const { operand1, operand2, operator } = req.body as CalculateRequest;

  if (typeof operand1 !== 'number' || typeof operand2 !== 'number' || typeof operator !== 'string') {
    return res.status(400).json({ error: 'Invalid request body. Provide operand1, operand2 (numbers) and operator (string).' });
  }

  try {
    const result = calculate(operand1, operand2, operator as Operator);
    res.json({ result });
  } catch (err) {
    if (err instanceof CalculatorError) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Calculator service running on port ${PORT}`);
});

export default app;
