📖 Docademia

Illuminate what you read.

Upload any book, paper, or document — Docademia extracts the essence: key concepts, memory aids, and deep character insight, powered by AI.

🔗 Live app: docademia.vercel.app


✨ What it does

Docademia turns dense PDFs into something you can actually study and remember. Upload a document and get back:


🗺 Concept Mapping — key ideas, visually connected
🃏 Memory Flashcards — auto-generated Q&A to retain what you read
👤 People Analysis — psychology and traits of characters or people mentioned in the text


Works on novels, research papers, textbooks, reports, and more.

🛠 Tech Stack

Layer and Technology:
FrontendReact, deployed on Vercel
BackendFastAPI (Python), containerized with Docker, hosted on Hugging Face Spaces
AIGroq — Llama 3.1 8B Instant
PDF ParsingPyMuPDF (fitz)

⚡ How it works


1 -> User uploads a PDF via the React frontend
2 -> FastAPI backend extracts and trims the text (PyMuPDF)
3 -> The text is sent to Groq's Llama 3.1 model with a structured prompt
4 -> The model returns a strict JSON payload — title, summary, concept map, flashcards, and character profiles
5 -> The frontend renders it all into an interactive, readable view


🚀 Running it locally

Backend

bash:
cd backend
pip install -r requirements.txt
# create a .env file with GROQ_API_KEY=your_key_here
uvicorn main:app --reload

Frontend

bash:
cd frontend
npm install
npm start

🌐 Deployment


Frontend is deployed on Vercel, auto-deploying from the main branch
Backend runs as a Docker-based Hugging Face Space, with GROQ_API_KEY stored as an encrypted secret. 
