FROM python:3.11-slim

WORKDIR /app

# Copier requirements.txt depuis le contexte racine
COPY apps/engine/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copier et installer quantum-st depuis packages/
# (Nécessite le setup.py dans packages/quantum-st/)
COPY packages/quantum-st /tmp/quantum-st
RUN pip install --no-cache-dir /tmp/quantum-st

# Copier le code de l'engine
COPY apps/engine /app

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]