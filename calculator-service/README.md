# Calculator Service

Core arithmetic calculator service providing addition, subtraction, multiplication, and division.

## API

### POST /calculate

Request body:
```json
{
  "operand1": 10,
  "operand2": 5,
  "operator": "+"
}
```
Response (200):
```json
{ "result": 15 }
```
Error responses (400):
```json
{ "error": "Division by zero" }
```

### GET /health

Returns `{ "status": "ok" }`

## Run Locally

```bash
npm install
npm run dev
```

The service will start on port 3001.

## Run Tests

```bash
npm test
```

## Docker

```bash
docker build -t calculator-service .
docker run -p 3001:3001 calculator-service
```
