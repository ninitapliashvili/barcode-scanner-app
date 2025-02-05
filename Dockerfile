FROM python:3.12-slim

RUN apt-get update && apt-get install -y libzbar0

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["gunicorn", "-b", "0.0.0.0:8080", "run:app"]
