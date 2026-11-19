# TPI-Prog4-FoodStore-Angelelli-Rodrigo
Repositorio utilizado para alojar el TP Integrador de la materia Programación 4 de la Tecnicatura Universitaria en Programación a Distancia (TUPAD) - Alumno: Angelelli, Rodrigo Martín

Repositorio: https://github.com/roangelelli/TPI-Prog4-FoodStore-Angelelli-Rodrigo

## Estructura
- `backend/`: API con FastAPI + SQLModel + PostgreSQL
- `frontend/`: aplicación React + TypeScript

## Requisitos
- Python 3.11 a 3.13
- PostgreSQL 15 o superior
- Node.js 20.19 o superior y pnpm 9 o superior

## Backend
```bash
cd backend
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # completar DATABASE_URL y SECRET_KEY
uvicorn app.main:app --reload
```
Documentación en http://localhost:8000/docs

> README en construcción: se completa en cada etapa (seed, frontend, usuario admin, video).
