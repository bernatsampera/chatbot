# AI Chatbot Example

A full-stack AI chatbot application demonstrating how to build a conversational AI interface using modern web technologies. This project showcases integration between a React frontend with specialized chat UI components and a FastAPI backend powered by Google's Gemini AI model through LangGraph.

## Features

- 🤖 **AI-Powered Conversations**: Uses Google Gemini 2.5 Flash Lite model for intelligent responses
- 💬 **Modern Chat Interface**: Built with @assistant-ui/react for polished chat experiences
- 🔄 **Real-time Communication**: FastAPI backend with CORS-enabled API endpoints
- 🎨 **Beautiful UI**: React 19 + TypeScript + Vite + TailwindCSS + DaisyUI
- 🔧 **LangGraph Integration**: Structured conversation flow management
- 🚀 **Development Ready**: Hot-reload enabled for both frontend and backend

## Stack

- **Frontend**: React 19 + TypeScript + Vite + TailwindCSS + @assistant-ui/react
- **Backend**: FastAPI + Python 3.12 + LangGraph + LangChain + Google Gemini AI
- **AI Model**: Google Gemini 2.5 Flash Lite

## Quick Setup

1. **Set up environment variables**

   Create a `.env` file in the `backend` directory:

   ```bash
   # backend/.env
   GOOGLE_API_KEY=your_google_api_key_here
   ```

   Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

2. **Install dependencies**

   ```bash
   make setup-env    # Set up Python environment
   make install      # Install all dependencies
   ```

3. **Start development servers**

   ```bash
   make dev          # Start both servers
   ```

   Or individually:

   ```bash
   make dev-backend   # Backend: http://localhost:8008
   make dev-frontend  # Frontend: http://localhost:5173
   ```

## Available Commands

- `make help` - Show all available commands
- `make setup-env` - Set up Python virtual environment
- `make install` - Install all dependencies
- `make dev` - Run both servers
- `make test` - Run tests
- `make clean` - Clean up generated files

## Usage

Once both servers are running:

1. Open your browser and go to `http://localhost:5173`
2. Start chatting with the AI assistant in the chat interface
3. The frontend communicates with the backend API to process your messages through the Gemini AI model

## API Endpoints

- **Frontend**: `http://localhost:5173` - Chat interface
- **Backend API**: `http://localhost:8008` - FastAPI server
- **Chat API**: `POST http://localhost:8008/chat` - Send messages to the AI
- **API Documentation**: `http://localhost:8008/docs` - Interactive API docs

## Project Structure

```
chatbot/
├── backend/                 # FastAPI backend
│   ├── chatbot/
│   │   └── graph.py        # LangGraph conversation flow
│   ├── main.py             # FastAPI app with chat endpoint
│   └── pyproject.toml      # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── App.tsx         # Main app with chat adapter
│   │   └── components/     # Chat UI components
│   └── package.json        # Node.js dependencies
└── Makefile               # Development commands
```

## Key Components

- **`backend/main.py`**: FastAPI server with `/chat` endpoint that processes user messages
- **`backend/chatbot/graph.py`**: LangGraph implementation using Google Gemini AI model
- **`frontend/src/App.tsx`**: React app with chat model adapter connecting to backend API
- **`frontend/src/components/assistant-ui/`**: Specialized chat UI components

## Requirements

- Python 3.12+
- Node.js 18+
- uv (Python package manager)
- Google AI API key
