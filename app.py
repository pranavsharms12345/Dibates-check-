from flask import Flask, render_template, request, jsonify
import numpy as np
import pickle
import os

app = Flask(__name__)
MODEL_PATH = os.path.join(os.path.dirname(__file__), "logisticc1.pkl")

with open(MODEL_PATH, "rb") as model_file:
    model = pickle.load(model_file)

FEATURES = [
    "Pregnancies", "Glucose", "BloodPressure", "BMI",
    "DiabetesPedigreeFunction", "Age"
]

@app.get("/")
def home():
    return render_template("index.html")

@app.post("/predict")
def predict():
    payload = request.get_json(silent=True) or request.form
    try:
        values = [float(payload[name]) for name in FEATURES]
    except (KeyError, TypeError, ValueError):
        return jsonify({"error": "Please enter a valid number for every field."}), 400

    if not all(np.isfinite(v) for v in values):
        return jsonify({"error": "Please enter finite numeric values only."}), 400

    limits = {
        "Pregnancies": (0, 20),
        "Glucose": (0, 400),
        "BloodPressure": (0, 250),
        "BMI": (0, 100),
        "DiabetesPedigreeFunction": (0, 5),
        "Age": (1, 120),
    }
    for name, value in zip(FEATURES, values):
        low, high = limits[name]
        if not low <= value <= high:
            return jsonify({"error": f"{name} must be between {low} and {high}."}), 400

    try:
        sample = np.array([values], dtype=float)
        prediction = int(model.predict(sample)[0])
        probability = None
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(sample)[0]
            classes = list(model.classes_)
            if 1 in classes:
                probability = round(float(probs[classes.index(1)]) * 100, 1)

        return jsonify({
            "prediction": prediction,
            "risk_level": "higher" if prediction == 1 else "lower",
            "result_title": "Higher chance indicated" if prediction == 1 else "Lower chance indicated",
            "probability": probability,
            "message": (
                "The model classified these inputs as outcome 1. This is a model estimate, not a diagnosis."
                if prediction == 1 else
                "The model classified these inputs as outcome 0. A lower model estimate does not rule out diabetes."
            ),
            "disclaimer": "This tool is for educational awareness only. Please consult a qualified healthcare professional for screening or diagnosis."
        })
    except Exception:
        app.logger.exception("Prediction failed")
        return jsonify({"error": "The model could not process these inputs. Check model compatibility and feature order."}), 500

if __name__ == "__main__":
    app.run(debug=True)
