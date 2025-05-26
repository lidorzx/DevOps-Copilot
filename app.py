from flask import Flask, render_template, request, jsonify
from transformers import pipeline

app = Flask(__name__)
pipe = pipeline("text-generation", model="meta-llama/Llama-3.2-3B-Instruct", trust_remote_code=True)

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/copilot")
def copilot():
    return render_template("index.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/devops", methods=["POST"])
def devops_copilot():
    message = request.get_json().get("message")
    if not message:
        return jsonify({"error": "Missing message"}), 400

    prompt = (
        "<|start_header_id|>system<|end_header_id|>\n"
        "You are a helpful DevOps assistant.\n"
        "<|start_header_id|>user<|end_header_id|>\n"
        f"{message}\n"
        "<|start_header_id|>assistant<|end_header_id|>\n"
    )

    output = pipe(prompt, max_new_tokens=300)[0]['generated_text']
    if "<|start_header_id|>assistant<|end_header_id|>" in output:
        output = output.split("<|start_header_id|>assistant<|end_header_id|>")[-1]

    return jsonify({"response": output.strip()})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

