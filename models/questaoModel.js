const { pool } = require('../db/db');

const ALTERNATIVAS_VALIDAS = ['A', 'B', 'C', 'D', 'E'];

class Questao {
    constructor(data){
        this.data = data;
        this.errors = [];
    }
}

Questao.prototype.validate = function () {
    // Variáveis com os dados vindo de data (req.body)
    // Recebem .trim() para limpar espaços em branco antes e depois do texto ou '' caso não tenha sido enviado dados.
    let enunciado = this.data.enunciado ? this.data.enunciado.trim() : '';
    let alternativaA = this.data.alternativaA ? this.data.alternativaA.trim() : '';
    let alternativaB = this.data.alternativaB ? this.data.alternativaB.trim() : '';
    let alternativaC = this.data.alternativaC ? this.data.alternativaC.trim() : '';
    let alternativaD = this.data.alternativaD ? this.data.alternativaD.trim() : '';
    let alternativaE = this.data.alternativaE ? this.data.alternativaE.trim() : '';
    // Recebe .toUpperCase() para transformar o texto em maiúscula ou '' caso não tenha sido enviado dados.
    let correta = this.data.correta ? this.data.correta.trim().toUpperCase() : '';

    // Verificando se os campos estão vazios.
    if (!enunciado) {
        this.errors.push('Enunciado é obrigatório.')
    }

    if (!alternativaA) {
        this.errors.push('Alternativa A é obrigatória.')
    }

    if (!alternativaB) {
        this.errors.push('Alternativa B é obrigatória.')
    }

    if (!alternativaC) {
        this.errors.push('Alternativa C é obrigatória.')
    }

    if (!alternativaD) {
        this.errors.push('Alternativa D é obrigatória.')
    }

    if (!alternativaE) {
        this.errors.push('Alternativa E é obrigatória.')
    }
    // Validando se o dado de correta está entre A a E.
    if (!ALTERNATIVAS_VALIDAS.includes(correta)) {
        this.errors.push('Alternativa correta deve ser uma letra de A a E.')
    }

    // Se todos os dados foram validados, substitui os dados formatados em data
    if (this.errors.length === 0) {
        this.data = {
            enunciado,
            alternativaA,
            alternativaB,
            alternativaC,
            alternativaD,
            alternativaE,
            correta
        }
    }
}

Questao.prototype.create = function () {
    const query_text = `
        INSERT INTO questoes (
            enunciado,
            alternativaA,
            alternativaB,
            alternativaC,
            alternativaD,
            alternativaE,
            correta
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id;
    `;
    const query_params = [
        this.data.enunciado,
        this.data.alternativaA,
        this.data.alternativaB,
        this.data.alternativaC,
        this.data.alternativaD,
        this.data.alternativaE,
        this.data.correta
    ];

    return new Promise((resolve, reject) => {
        pool.query(query_text, query_params, (error, result) => {
            if (error) {
                reject('Erro ao inserir questão: ' + error);
            } else {
                const idDaQuestaoSalva = result.rows[0].id;
                resolve(idDaQuestaoSalva);
            }
        });
    });

};

Questao.listaQuestoes = function () {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT id, enunciado
        FROM questoes 
        ORDER BY id ASC
        `
        pool.query(query, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result.rows);
            }
        });
    });
};

Questao.prototype.update = function (id) {
    const query_text = `
        UPDATE questoes
        SET 
            enunciado = $1,
            alternativaA = $2,
            alternativaB = $3,
            alternativaC = $4,
            alternativaD = $5,
            alternativaE = $6,
            correta = $7
        WHERE id = $8;
    `
    const query_params = [
        this.data.enunciado,
        this.data.alternativaA,
        this.data.alternativaB,
        this.data.alternativaC,
        this.data.alternativaD,
        this.data.alternativaE,
        this.data.correta,
        id
    ]

    return new Promise((resolve, reject) => {
        pool.query(query_text, query_params, (error, result) => {
            if (error) {
                reject('Erro ao atualizar questão: ' + error);
            } else {
                resolve();
            }
        });
    });
};

Questao.deletar = function (id) {
    const query = `
        DELETE 
        FROM questoes
        WHERE id = $1;
    `
    return new Promise((resolve, reject) => {
        pool.query(query, [id], (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
};

module.exports = Questao;