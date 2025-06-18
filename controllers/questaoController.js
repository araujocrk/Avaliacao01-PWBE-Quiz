const Questao = require('../models/questaoModel');

exports.listarQuestoes = (req, res) => {
    Questao.listarQuestoes()
        .then(result => {
            return res.render('pages/listaQuestoes', {
                questoes: result,
                title: 'Lista de Questões',
                showHeader: true,
                page: 'questoes'
            });
        })
        .catch(error => {
            res.render('pages/error', {
                title: 'Lista de Questões',
                showHeader: true,
                page: '',
                erros: [error.message]
            });
        });
};

exports.novaQuestaoForm = (req, res) => {
    res.render('pages/novaQuestaoForm', {
        title: 'Criar Questão',
        showHeader: true,
        page: 'criar'
    });
};

exports.criarQuestao = function (req, res) {
    const questao = new Questao(req.body);
    questao.validate();
    console.log(questao)

    if (questao.errors.length > 0) {
        return res.render('pages/error', {
            title: 'Criar Questão',
            showHeader: false,
            page: '',
            erros: questao.errors
        });
    }

    questao.create()
        .then(result => {
            const { id, id_errors } = result;
            if (id_errors.length > 0) {
                return res.render('pages/error', {
                    title: `Erro ao criar questão de ID ${id}`,
                    showHeader: false,
                    page: '',
                    erros: id_errors
                });
            }
            res.redirect('/questoes');
        })
        .catch(error => {
            res.render('pages/error', {
                title: 'Erro ao Criar Questão',
                showHeader: false,
                page: '',
                erros: [error]
            });
        });
};

exports.editarQuestaoForm = function (req, res) {
    res.render('pages/editarQuestaoForm', {
        title: 'Editar Questão',
        showHeader: true,
        page: 'editar'
    });
};

exports.editarQuestao = function (req, res) {
    const questao = new Questao(req.body);
    questao.validate();

    if (questao.errors.length > 0) {
        return res.render('pages/error', {
            title: `Erro ao Editar Questão de ID ${questao.data.id}`,
            showHeader: false,
            page: '',
            erros: questao.errors
        });
    }

    questao.update()
        .then(result => {
            return res.redirect('/questoes');
        })
        .catch(error => {
            res.render('pages/error', {
                title: 'Erro ao editar',
                showHeader: false,
                page: '',
                erros: [error]
            });
        });
};

exports.deletarQuestaoForm = function (req, res) {
    res.render('pages/deletarQuestaoForm', {
        title: 'Deletar Questão',
        showHeader: true,
        page: 'deletar'
    });
};

exports.deletarQuestao = function (req, res) {
    const questao = new Questao(req.body);
    const { id, id_errors } = questao.validateID(questao.data.id);

    if (id_errors.length > 0) {
        return res.render('pages/error', {
            title: 'Erro ao Excluir Questão',
            showHeader: false,
            page: '',
            erros: id_errors
        });
    }

    Questao.deletar(id)
        .then(result => {
            res.redirect('/questoes');
        })
        .catch(error => {
            res.render('pages/error', {
                title: 'Erro ao Excluir Questão',
                showHeader: false,
                page: '',
                erros: [error]
            });
        });
};
