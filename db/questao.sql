CREATE TABLE IF NOT EXISTS questoes (
    id SERIAL PRIMARY KEY,
    enunciado VARCHAR(300) NOT NULL,
    "alternativa_a" VARCHAR(100) NOT NULL,
    "alternativa_b" VARCHAR(100) NOT NULL,
    "alternativa_c" VARCHAR(100) NOT NULL,
    "alternativa_d" VARCHAR(100) NOT NULL,
    "alternativa_e" VARCHAR(100) NOT NULL,
    correta VARCHAR(1) NOT NULL CHECK (correta IN ('A', 'B', 'C', 'D', 'E'))
)