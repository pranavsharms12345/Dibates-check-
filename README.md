# GlucoCheck — Updated Diabetes Prediction App

Responsive HTML/CSS/JavaScript UI + Flask API + your `logistic.pkl` model.

## Run on Windows

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Open http://127.0.0.1:5000

## Model input order

1. Pregnancies
2. Glucose
3. BloodPressure
4. BMI
5. DiabetesPedigreeFunction
6. Age

The result label uses the model's predicted class: class 0 = "Lower chance indicated"; class 1 = "Higher chance indicated". If the model supports `predict_proba`, the app also shows the estimated probability of class 1.

## Included UI updates

- Added a quick reference table for fasting glucose, blood pressure, BMI, age, pregnancies, and Diabetes Pedigree Function.
- Input hints and results now distinguish lower vs higher model-indicated likelihood.
- Included medical disclaimers: this is an educational estimate, not a diagnosis. Fasting glucose cutoffs require appropriate clinical interpretation and confirmation.

## Important

The UI reference values are general guidance only and do not control the model's prediction. The prediction is produced by your trained model. Ensure feature order and units match your training data. If training used a scaler, load the saved preprocessing pipeline too.
