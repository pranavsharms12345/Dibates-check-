const form = document.getElementById('prediction-form');
const submitButton = document.getElementById('submit-button');
const errorMessage = document.getElementById('error-message');
const emptyState = document.getElementById('empty-state');
const resultContent = document.getElementById('result-content');
const resetButton = document.getElementById('reset-button');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  errorMessage.hidden = true;
  errorMessage.textContent = '';
  if (!form.reportValidity()) return;

  const payload = Object.fromEntries(new FormData(form).entries());
  for (const key of Object.keys(payload)) payload[key] = Number(payload[key]);

  submitButton.disabled = true;
  submitButton.querySelector('span:first-child').textContent = 'Calculating…';
  try {
    const response = await fetch('/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Something went wrong. Please try again.');

    const higher = data.prediction === 1;
    document.getElementById('result-badge').textContent = higher ? 'HIGHER LIKELIHOOD INDICATED' : 'LOWER LIKELIHOOD INDICATED';
    document.getElementById('result-badge').classList.toggle('positive', higher);
    document.getElementById('result-title').textContent = higher ? 'Higher chance indicated' : 'Lower chance indicated';
    document.getElementById('result-description').textContent = data.message;
    document.getElementById('probability-value').textContent = data.probability === null ? 'N/A' : `${data.probability}%`;
    document.getElementById('probability-bar').style.width = data.probability === null ? '0%' : `${data.probability}%`;
    document.getElementById('probability-bar').style.background = higher ? '#d98455' : '#2864dc';
    document.getElementById('disclaimer-text').textContent = data.disclaimer;

    emptyState.hidden = true;
    resultContent.hidden = false;
    document.getElementById('result-card').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (error) {
    errorMessage.textContent = error.message || 'Unable to connect to the prediction service. Is Flask running?';
    errorMessage.hidden = false;
  } finally {
    submitButton.disabled = false;
    submitButton.querySelector('span:first-child').textContent = 'Estimate likelihood';
  }
});

resetButton.addEventListener('click', () => {
  form.reset();
  resultContent.hidden = true;
  emptyState.hidden = false;
  errorMessage.hidden = true;
  document.getElementById('probability-bar').style.width = '0%';
  form.querySelector('input').focus();
});
