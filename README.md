# React + FastAPI Template

A full-stack template with React frontend and FastAPI backend.

## Stack

- **Frontend**: React 19 + TypeScript + Vite + TailwindCSS + DaisyUI
- **Backend**: FastAPI + Python 3.12 + uvicorn

## Quick Setup

1. **Install dependencies**

   ```bash
   make setup-env    # Set up Python environment
   make install      # Install all dependencies
   ```

2. **Start development servers**

   ```bash
   make dev          # Start both servers
   ```

   Or individually:

   ```bash
   make dev-backend   # Backend: http://localhost:8008
   make dev-frontend  # Frontend: http://localhost:5177
   ```

## Available Commands

- `make help` - Show all available commands
- `make setup-env` - Set up Python virtual environment
- `make install` - Install all dependencies
- `make dev` - Run both servers
- `make test` - Run tests
- `make clean` - Clean up generated files

## API Endpoints

- Backend API: `http://localhost:8008`
- Frontend: `http://localhost:5177`
- API docs: `http://localhost:8008/docs`

## Requirements

- Python 3.12+
- Node.js 18+
- uv (Python package manager)
