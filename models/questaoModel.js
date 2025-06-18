const { pool } = require('../db/db');

const ALTERNATIVAS_VALIDAS = ['A', 'B', 'C', 'D', 'E'];

class Questao {
    constructor(data) {
        this.data = data;
        this.errors = [];
    }
}

Questao.prototype.validate = function () {
    this.errors = [];

    const {
        id,
        enunciado,
        alternativa_a,
        alternativa_b,
        alternativa_c,
        alternativa_d,
        alternativa_e,
        correta
    } = this.data;

    const { enunciado: enunciadoValidado, enunciado_errors: enun_errors } = this.validateEnunciado(enunciado);
    const { alternativa: alternativa_aValidado, alternativa_errors: alt_errors_a } = this.validateAlternativa(alternativa_a, 'A');
    const { alternativa: alternativa_bValidado, alternativa_errors: alt_errors_b } = this.validateAlternativa(alternativa_b, 'B');
    const { alternativa: alternativa_cValidado, alternativa_errors: alt_errors_c } = this.validateAlternativa(alternativa_c, 'C');
    const { alternativa: alternativa_dValidado, alternativa_errors: alt_errors_d } = this.validateAlternativa(alternativa_d, 'D');
    const { alternativa: alternativa_eValidado, alternativa_errors: alt_errors_e } = this.validateAlternativa(alternativa_e, 'E');
    const { correta: corretaValidado, correta_errors: cor_errors } = this.validateCorreta(correta);

    let idValidado = undefined;
    if (id !== undefined) {
        const { id: idVal, id_errors } = this.validateID(id);
        idValidado = idVal;
        if (id_errors.length > 0) this.errors.push(...id_errors);
    }

    if (enun_errors.length > 0) this.errors.push(...enun_errors);
    if (alt_errors_a.length > 0) this.errors.push(...alt_errors_a);
    if (alt_errors_b.length > 0) this.errors.push(...alt_errors_b);
    if (alt_errors_c.length > 0) this.errors.push(...alt_errors_c);
    if (alt_errors_d.length > 0) this.errors.push(...alt_errors_d);
    if (alt_errors_e.length > 0) this.errors.push(...alt_errors_e);
    if (cor_errors.length > 0) this.errors.push(...cor_errors);

    if (this.errors.length === 0) {
        this.data = {
            id: idValidado,
            enunciado: enunciadoValidado,
            alternativa_a: alternativa_aValidado,
            alternativa_b: alternativa_bValidado,
            alternativa_c: alternativa_cValidado,
            alternativa_d: alternativa_dValidado,
            alternativa_e: alternativa_eValidado,
            correta: corretaValidado
        };
    }

};

Questao.prototype.validateID = function (id) {
    const id_errors = [];

    // Verifica se é tipo number
    if (typeof (id) === 'number') {
        // Verifica se é inteiro e maior ou igual a 1
        if (Number.isInteger(id) && id >= 1) {
            return { id, id_errors };
            // Verifica se é float e maior ou igual a 1
        } else if (!Number.isInteger(id) && id >= 1) {
            // Truncamento do número float
            id = parseInt(id);
            // Era um float mas foi possível transformar em inteiro
            return { id, id_errors };
        } else {
            id_errors.push('Número do ID é menor que 1');
            return { id: undefined, id_errors };
        }
        // Verifica se é tipo string
    } else if (typeof (id) === 'string') {
        const id_parsed = parseInt(id);
        // Verifica se transformando/truncando o id em inteiro é um number e que não seja NaN
        if (typeof (id_parsed) === 'number' && !isNaN(id_parsed)) {
            // Era uma string mas foi possível transformar em inteiro
            return { id, id_errors }
            // É uma string que não começa com número
        } else {
            id_errors.push('ID é um texto quando deveria ser um número inteiro maior ou igual a 1');
            return { id, id_errors };
        }
    } else {
        id_errors.push(`Tipo inválido para ID: ${typeof (id)}`);
    }
    return { id: undefined, id_errors }
};

Questao.prototype.validateEnunciado = function (enunciado) {
    const enunciado_errors = [];
    enunciado = this.limparValor(enunciado);

    if (!enunciado) enunciado_errors.push('Enunciado está vazio ou inválido.');

    if (enunciado.length > 300) enunciado_errors.push('Enunciado está com mais de 300 caracteres');
    return { enunciado, enunciado_errors };
};

Questao.prototype.validateAlternativa = function (alternativa, letra) {
    const alternativa_errors = [];
    alternativa = this.limparValor(alternativa);

    if (!alternativa) alternativa_errors.push(`Alternativa ${letra} está vazia ou inválido.`);

    if (alternativa.length > 100) alternativa_errors.push(`Alternativa ${letra} está com mais de 100 caracteres`);

    return { alternativa, alternativa_errors };
};

Questao.prototype.validateCorreta = function (correta) {
    const correta_errors = [];
    correta = this.limparValor(correta);

    if (!correta) correta_errors.push('Alternativa correta está vazia ou inválida.');

    if (!ALTERNATIVAS_VALIDAS.includes(correta)) correta_errors.push('Alternativa correta não é uma letra de A a E.');

    return { correta, correta_errors };
};

// Valida se é uma string não vazia e retorna valor sem espaços ou string vazia
Questao.prototype.limparValor = function (valor) {
    return typeof (valor) === 'string' && valor.trim() !== ''
        ? valor.trim()
        : '';
};

Questao.prototype.create = function () {
    const query_text = `
        INSERT INTO questoes (
            enunciado,
            alternativa_a,
            alternativa_b,
            alternativa_c,
            alternativa_d,
            alternativa_e,
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
        this.data.correta
    ];

    return new Promise((resolve, reject) => {
        pool.query(query_text, query_params, (error, result) => {
            if (error) {
                reject('Erro ao inserir questão: ' + error);
            } else {
                const idDaQuestaoSalva = result.rows[0].id;
                const { id, id_errors } = this.validateID(idDaQuestaoSalva);
                resolve({ id, id_errors });
            }
        });
    });

};

Questao.listarQuestoes = function () {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT id, enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, alternativa_e, correta
        FROM questoes 
        ORDER BY id ASC
        `
        pool.query(query, (error, result) => {
            if (error) {
                reject(error);
            } else {
                const questoes = result.rows
                    .map(row => {
                        const questao = new Questao(row);
                        questao.validate();
                        return questao;
                    })
                    .filter(q => q.errors.length === 0);
                resolve(questoes);
            }
        });
    });
};

Questao.questaoID = function (id) {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT id, enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, alternativa_e, correta
        FROM questoes 
        WHERE questoes.id = ${id};
        `
        pool.query(query, (error, result) => {
            if (error) {
                reject(error);
            } else {
                const questao = new Questao(result.rows[0]);
                questao.validate();
                resolve(questao);
            }
        });
    });
};

Questao.prototype.update = function () {
    const query_text = `
        UPDATE questoes
        SET 
            enunciado = $1,
            alternativa_a = $2,
            alternativa_b = $3,
            alternativa_c = $4,
            alternativa_d = $5,
            alternativa_e = $6,
            correta = $7
        WHERE id = $8;
    `
    const query_params = [
        this.data.enunciado,
        this.data.alternativa_a,
        this.data.alternativa_b,
        this.data.alternativa_c,
        this.data.alternativa_d,
        this.data.alternativa_e,
        this.data.correta,
        this.data.id
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
                return reject(error);
            }
            if (result.rowCount === 0) {
                return reject('Nenhuma questão encontrada com o ID informado.');
            }
            resolve();
        });
    });
};

module.exports = Questao;
