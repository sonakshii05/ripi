# Sonakshi Padhi — Portfolio + AI Chatbot

> A personal portfolio website with an integrated Groq-powered AI chatbot assistant.

[![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0-black?logo=flask)](https://flask.palletsprojects.com)
[![Groq](https://img.shields.io/badge/AI-Groq%20LLaMA-orange)](https://console.groq.com)

---

## 🚀 Features

- ⚡ Futuristic dark/light theme portfolio
- 🤖 Floating AI chatbot powered by Groq (LLaMA 3.1 8B)
- 🔒 API key never exposed to the frontend
- 🎨 Glassmorphism design with smooth animations
- 📱 Fully responsive (mobile, tablet, desktop)
- 🚀 Ready to deploy on Heroku / Render / Railway

---

## 📁 Project Structure

```
d:\ripi\
├── index.html          # Portfolio frontend
├── style.css           # All styles (design system + chatbot)
├── script.js           # Animations + chatbot interactions
├── pic.jpeg            # Profile photo
├── server.py           # Flask backend (API proxy)
├── requirements.txt    # Python dependencies
├── Procfile            # Heroku/Render deployment config
├── .env                # ⚠️ Local secrets — NEVER commit
├── .gitignore          # Keeps .env out of git
└── README.md           # This file
```

---

## 🛠️ Local Development

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Set up your `.env`

```bash
GROQ_API_KEY=your_groq_api_key_here
FLASK_ENV=development
```

Get your key at [console.groq.com](https://console.groq.com).

### 3. Run the server

```bash
python server.py
```


## 🤖 Chatbot Persona

The AI knows about Sonakshi's:
- Skills (Frontend, Python, SQL, Cybersecurity)
- Projects (CafeX, NagrikSetu, Harry Potter Tribute, Mini-games, Talk-A-Tool)
- Education (NIST University, DAV, Matrusri)
- Contact details

---

## 🔐 Security Notes

- API key lives **only** in `.env` (local) or platform environment variables (deployed)
- `.env` is listed in `.gitignore` — never committed to git
- Frontend only calls your own `/api/chat` endpoint — Groq key is never sent to browser

---

## 📄 License

MIT — feel free to fork and customize!

