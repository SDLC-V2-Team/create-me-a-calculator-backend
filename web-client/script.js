document.addEventListener('DOMContentLoaded', () => {
  const operand1Input = document.getElementById('operand1') as HTMLInputElement;
  const operatorSelect = document.getElementById('operator') as HTMLSelectElement;
  const operand2Input = document.getElementById('operand2') as HTMLInputElement;
  const calculateBtn = document.getElementById('calculateBtn') as HTMLButtonElement;
  const resultDiv = document.getElementById('result') as HTMLDivElement;
  const errorDiv = document.getElementById('error') as HTMLDivElement;

  calculateBtn.addEventListener('click', async () => {
    const operand1 = parseFloat(operand1Input.value);
    const operand2 = parseFloat(operand2Input.value);
    const operator = operatorSelect.value;

    if (isNaN(operand1) || isNaN(operand2)) {
      errorDiv.textContent = 'Please enter valid numbers.';
      resultDiv.textContent = '';
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operand1, operand2, operator })
      });

      const data = await response.json();

      if (response.ok) {
        resultDiv.textContent = `Result: ${data.result}`;
        errorDiv.textContent = '';
      } else {
        errorDiv.textContent = `Error: ${data.error}`;
        resultDiv.textContent = '';
      }
    } catch (err) {
      errorDiv.textContent = 'Network error: Could not reach calculator service.';
      resultDiv.textContent = '';
    }
  });
});
