from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
import fitz
import os
import json
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text(file_bytes: bytes) -> str:
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    words = text.split()
    return " ".join(words[:1500])

@app.get("/")
def root():
    return {"status": "running"}

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    contents = await file.read()
    book_text = extract_text(contents)

    prompt = (
        "You are a literary analyst. Read the text and fill the JSON below.\n"
        "RULES: Return ONLY JSON. No markdown. No code fences. No explanation.\n"
        "- title: actual document title, never placeholder\n"
        "- summary: exactly 2 real sentences about the content\n"
        "- concept_map: exactly 6 nodes, labels must be THEMES or IDEAS (not character names), under 5 words each\n"
        "- flashcards: exactly 6 items, real questions about the content, answers under 8 words\n"
        "- characters: 3 to 5 real people or characters from the text\n\n"
        "JSON to fill:\n"
        "{\n"
        '  "title": "FILL",\n'
        '  "summary": "FILL sentence one. FILL sentence two.",\n'
        '  "concept_map": [\n'
        '    {"id": "1", "label": "FILL", "connections": ["2", "3"]},\n'
        '    {"id": "2", "label": "FILL", "connections": ["1", "4"]},\n'
        '    {"id": "3", "label": "FILL", "connections": ["1", "5"]},\n'
        '    {"id": "4", "label": "FILL", "connections": ["2", "6"]},\n'
        '    {"id": "5", "label": "FILL", "connections": ["3"]},\n'
        '    {"id": "6", "label": "FILL", "connections": ["4"]}\n'
        "  ],\n"
        '  "flashcards": [\n'
        '    {"question": "FILL", "answer": "FILL"},\n'
        '    {"question": "FILL", "answer": "FILL"},\n'
        '    {"question": "FILL", "answer": "FILL"},\n'
        '    {"question": "FILL", "answer": "FILL"},\n'
        '    {"question": "FILL", "answer": "FILL"},\n'
        '    {"question": "FILL", "answer": "FILL"}\n'
        "  ],\n"
        '  "characters": [\n'
        '    {"name": "FILL", "traits": ["FILL", "FILL"], "psychology": "FILL"},\n'
        '    {"name": "FILL", "traits": ["FILL", "FILL"], "psychology": "FILL"},\n'
        '    {"name": "FILL", "traits": ["FILL", "FILL"], "psychology": "FILL"}\n'
        "  ]\n"
        "}\n\n"
        "Document text:\n"
        + book_text
    )

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=3000
    )

    raw = response.choices[0].message.content.strip()

    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip().rstrip("```").strip()

    last_brace = raw.rfind("}")
    if last_brace != -1:
        raw = raw[:last_brace + 1]

    return json.loads(raw)