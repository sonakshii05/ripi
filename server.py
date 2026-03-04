"""
Sonakshi Portfolio — Flask Backend + Groq AI Chatbot
======================================================
Run locally  : python server.py
Run in prod  : gunicorn server:app
"""

import os
import json
import requests
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

# Load .env in local development
load_dotenv()

app = Flask(__name__, static_folder=".", static_url_path="")
CORS(app)  # Allow cross-origin in development

GROQ_API_KEY  = os.environ.get("GROQ_API_KEY", "")
GROQ_API_URL  = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL    = "llama-3.1-8b-instant"   # fast & capable

# ── Sonakshi's portfolio persona ──────────────────────────────────────────────
SYSTEM_PROMPT = """You are Sonakshi's personal AI assistant embedded in her portfolio website.

About Sonakshi Padhi:
- 2nd-year B.Tech Computer Science & Engineering student at NIST University (2024–2028), CGPA: 8.86
- Passionate about Data Analysis & Cybersecurity
- Believes in the intersection of data insights and system security

Skills:
- Frontend: HTML, CSS, JavaScript, React
- Programming: C (pointers, DSA), Java (OOP), Python (Pandas, NumPy, Matplotlib, basics of ML)
- Databases: SQL, MySQL, Git & GitHub
- Cybersecurity: fundamentals, threat identification, risk assessment, security best practices
- Currently learning: Advanced SQL, Data Analysis with Python, Applied Network Security

Education:
- B.Tech CSE — NIST University, 2024–2028, CGPA 8.86
- 12th (PCMB) — DAV Public School, CBSE, 85.2%
- 10th — Matrusri Anglo Vedic School, ICSE, 95%

Projects:
1. CafeX — Responsive café website (HTML/CSS/JS), live at cafeex.netlify.app
2. NagrikSetu — Citizen digital services platform (HTML/CSS/React/MongoDB), live at nagriksetu.site
3. Harrypottertribute — Harry Potter fan tribute with interactive features
4. Mini-games — Python Flask game collection (rock paper scissors, sudoku, memory, tic tac toe)
5. Talk-A-Tool — AI-powered human text generator (HTML/CSS/JS/Flask/AI models)

Experience:
- IoT Group Project 2025: Home Automation using Edge Computing with Arduino UNO R4 WiFi

Contact:
- Email: wintrydust@gmail.com
- LinkedIn: linkedin.com/in/sonakshi-padhi/
- GitHub: github.com/sonakshii05

Instructions:
- Be warm, helpful, and concise (2–4 sentences max per reply)
- Answer questions about Sonakshi's skills, projects, education, and goals
- If asked about something unrelated to Sonakshi, politely redirect to her portfolio topics
- Do NOT make up information not listed above
- Speak in first person only if asked to pretend to be Sonakshi, otherwise speak about her in third person
"""


# ── API Routes ─────────────────────────────────────────────────────────────────

@app.route("/api/chat", methods=["POST"])
def chat():
    """Proxy chat messages to Groq API."""
    if not GROQ_API_KEY:
        return jsonify({"error": "GROQ_API_KEY not configured on server."}), 500

    data = request.get_json(silent=True) or {}
    user_message = data.get("message", "").strip()

    if not user_message:
        return jsonify({"error": "No message provided."}), 400

    # Keep history if passed (max 10 turns to save tokens)
    history = data.get("history", [])[-10:]

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages.extend(history)
    messages.append({"role": "user", "content": user_message})

    try:
        response = requests.post(
            GROQ_API_URL,
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": GROQ_MODEL,
                "messages": messages,
                "max_tokens": 512,
                "temperature": 0.7,
            },
            timeout=20,
        )
        response.raise_for_status()
        result = response.json()
        reply = result["choices"][0]["message"]["content"].strip()
        return jsonify({"reply": reply})

    except requests.exceptions.Timeout:
        return jsonify({"error": "Request timed out. Please try again."}), 504
    except requests.exceptions.HTTPError as e:
        return jsonify({"error": f"Groq API error: {e.response.status_code}"}), 502
    except Exception as e:
        return jsonify({"error": "Something went wrong. Please try again."}), 500


# ── Static file serving (index.html + assets) ─────────────────────────────────

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_static(path):
    """Serve the portfolio static files."""
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")


# ── Entry point ────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_ENV", "production") == "development"
    print(f"[*] Server running at http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=debug)
