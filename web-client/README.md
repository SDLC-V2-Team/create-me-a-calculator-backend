# Web Client for Calculator Service

Frontend browser-based calculator UI that communicates with the calculator service.

## Usage

1. Ensure the calculator service is running on `localhost:3001`.
2. Open `index.html` in a browser or serve the directory:
   ```bash
   npx serve .
   ```
3. Enter two numbers, select operator, and click `=`.

## Docker

```bash
docker build -t web-client .
docker run -p 8080:80 web-client
```

Then visit `http://localhost:8080`.
