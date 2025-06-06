const { pool } = require('../db/db');
const validator = require('validator');

const ALTERNATIVAS_VALIDAS = ['A', 'B', 'C', 'D', 'E'];

class Questao {
    constructor(data){
        data = data;
        error = [];
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
        this.error.push('Enunciado é obrigatório.')
    }

    if (!alternativaA) {
        this.error.push('Alternativa A é obrigatória.')
    }

    if (!alternativaB) {
        this.error.push('Alternativa B é obrigatória.')
    }

    if (!alternativaC) {
        this.error.push('Alternativa C é obrigatória.')
    }

    if (!alternativaD) {
        this.error.push('Alternativa D é obrigatória.')
    }

    if (!alternativaE) {
        this.error.push('Alternativa E é obrigatória.')
    }
    // Validando se o dado de correta está entre A a E.
    if (!ALTERNATIVAS_VALIDAS.includes(correta)) {
        this.error.push('Alternativa correta é deve ser uma letra de A a E.')
    }

    // Se todos os dados foram validados, substitui os dados formatados em data
    if (this.erros === 0) {
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
        this.data.alternativa_a,
        this.data.alternativa_b,
        this.data.alternativa_c,
        this.data.alternativa_d,
        this.data.alternativa_e,
        this.data.alternativa_correta
    ];

    return new Promise((resolve, reject) => {
        pool.query(query_text, query_params, (error, result) => {
            if (error) {
                reject('Erro ao inserir questão: ' + error);
            } else {
                const idDaQuestao
                resolve
            }
        })
    })

}