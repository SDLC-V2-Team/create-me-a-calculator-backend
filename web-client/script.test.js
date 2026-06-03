// Mock the fetch API before loading the script
global.fetch = jest.fn();

// Load the script once so that it registers the DOMContentLoaded listener
require('./script');

// Helper to flush pending microtasks and timers
const flushPromises = () => new Promise(resolve => setImmediate(resolve));

beforeEach(() => {
  // Set up fresh DOM elements for each test
  document.body.innerHTML = `
    <input id="operand1" type="text" value="">
    <select id="operator">
      <option value="+">+</option>
      <option value="-">-</option>
      <option value="*">*</option>
      <option value="/">/</option>
    </select>
    <input id="operand2" type="text" value="">
    <button id="calculateBtn">Calculate</button>
    <div id="result"></div>
    <div id="error"></div>
  `;

  // The script originally waits for DOMContentLoaded; we simulate it after
  // the DOM is ready so that the button click handler gets attached.
  document.dispatchEvent(new Event('DOMContentLoaded'));
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Calculator UI', () => {
  test('should display the result when the API returns successfully', async () => {
    // Arrange
    const operand1 = document.getElementById('operand1') as HTMLInputElement;
    const operand2 = document.getElementById('operand2') as HTMLInputElement;
    const operator = document.getElementById('operator') as HTMLSelectElement;
    const calculateBtn = document.getElementById('calculateBtn') as HTMLButtonElement;
    const resultDiv = document.getElementById('result') as HTMLDivElement;

    operand1.value = '10';
    operand2.value = '5';
    operator.value = '+';

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: 15 }),
    });

    // Act
    calculateBtn.click();
    await flushPromises();

    // Assert
    expect(resultDiv.textContent).toBe('Result: 15');
    expect(document.getElementById('error').textContent).toBe('');
  });

  test('should show error when operands are invalid', async () => {
    const operand1 = document.getElementById('operand1') as HTMLInputElement;
    const operand2 = document.getElementById('operand2') as HTMLInputElement;
    const calculateBtn = document.getElementById('calculateBtn') as HTMLButtonElement;

    operand1.value = 'abc';
    operand2.value = '1';

    calculateBtn.click();
    await flushPromises();

    expect(document.getElementById('error').textContent).toBe('Please enter valid numbers.');
    expect(document.getElementById('result').textContent).toBe('');
    // fetch should not have been called
    expect(fetch).not.toHaveBeenCalled();
  });

  test('should display server error when API returns a non‑ok response', async () => {
    const operand1 = document.getElementById('operand1') as HTMLInputElement;
    const operand2 = document.getElementById('operand2') as HTMLInputElement;
    const operator = document.getElementById('operator') as HTMLSelectElement;
    const calculateBtn = document.getElementById('calculateBtn') as HTMLButtonElement;
    const errorDiv = document.getElementById('error') as HTMLDivElement;

    operand1.value = '10';
    operand2.value = '0';
    operator.value = '/';

    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Division by zero' }),
    });

    calculateBtn.click();
    await flushPromises();

    expect(errorDiv.textContent).toBe('Error: Division by zero');
    expect(document.getElementById('result').textContent).toBe('');
  });

  test('should display a network error when fetch throws', async () => {
    const operand1 = document.getElementById('operand1') as HTMLInputElement;
    const operand2 = document.getElementById('operand2') as HTMLInputElement;
    const calculateBtn = document.getElementById('calculateBtn') as HTMLButtonElement;
    const errorDiv = document.getElementById('error') as HTMLDivElement;

    operand1.value = '5';
    operand2.value = '2';

    fetch.mockRejectedValueOnce(new Error('Network failure'));

    // Suppress unhandled rejection noise that might occur outside the test
    jest.spyOn(console, 'error').mockImplementation(() => {});

    calculateBtn.click();
    await flushPromises();

    expect(errorDiv.textContent).toBe('Network error: Could not reach calculator service.');
    expect(document.getElementById('result').textContent).toBe('');

    console.error.mockRestore();
  });
});