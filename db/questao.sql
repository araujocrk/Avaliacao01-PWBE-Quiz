CREATE TABLE IF NOT EXISTS questoes (
    id SERIAL PRIMARY KEY,
    enunciado VARCHAR(300) NOT NULL,
    alternativaA VARCHAR(100) NOT NULL,
    alternativaB VARCHAR(100) NOT NULL,
    alternativaC VARCHAR(100) NOT NULL,
    alternativaD VARCHAR(100) NOT NULL,
    alternativaE VARCHAR(100) NOT NULL,
    correta VARCHAR(1) NOT NULL CHECK (correta IN ('A', 'B', 'C', 'D', 'E'))
)